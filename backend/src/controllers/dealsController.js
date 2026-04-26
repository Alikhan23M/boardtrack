import prisma from "../../prisma/client.js";

const dealInclude = {
  client: true,
  dealBoards: {
    include: {
      board: true,
    },
    orderBy: {
      id: "asc",
    },
  },
  installments: {
    orderBy: {
      createdAt: "desc",
    },
  },
};

const normalizeBoardSelections = (payload) => {
  if (Array.isArray(payload.boardSelections) && payload.boardSelections.length > 0) {
    return payload.boardSelections
      .map((item) => ({
        boardId: Number(item.boardId),
        startDate: item.startDate,
        endDate: item.endDate,
      }))
      .filter((item) => Number.isInteger(item.boardId) && item.boardId > 0);
  }

  // Backward compatibility with old payload.
  const fallbackBoardIds = Array.isArray(payload.boardIds) && payload.boardIds.length > 0
    ? payload.boardIds
    : payload.boardId
      ? [payload.boardId]
      : [];

  return fallbackBoardIds
    .map((id) => ({
      boardId: Number(id),
      startDate: payload.startDate,
      endDate: payload.endDate,
    }))
    .filter((item) => Number.isInteger(item.boardId) && item.boardId > 0);
};

const validateBoardSelections = (selections) => {
  if (selections.length === 0) return "At least one board must be selected";

  const uniqueIds = new Set();
  for (const selection of selections) {
    if (uniqueIds.has(selection.boardId)) return `Duplicate board selected: ${selection.boardId}`;
    uniqueIds.add(selection.boardId);

    const start = new Date(selection.startDate);
    const end = new Date(selection.endDate);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return `Invalid start/end date for board ${selection.boardId}`;
    }
    if (end <= start) {
      return `End date must be after start date for board ${selection.boardId}`;
    }
  }
  return null;
};

const buildPricingSummary = (selections, boardsById) => {
  let amount = 0;
  let minStart = null;
  let maxEnd = null;

  for (const selection of selections) {
    const board = boardsById.get(selection.boardId);
    const start = new Date(selection.startDate);
    const end = new Date(selection.endDate);
    const dayDiff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    amount += Number(board.price) * dayDiff;

    if (!minStart || start < minStart) minStart = start;
    if (!maxEnd || end > maxEnd) maxEnd = end;
  }

  return {
    amount: Number(amount.toFixed(2)),
    startDate: minStart,
    endDate: maxEnd,
  };
};

const validateAmounts = (amount, paidAmount) => {
  if (amount < 0 || paidAmount < 0) return "Amount and paid amount must be non-negative";
  if (paidAmount > amount) return "Paid amount cannot be greater than amount";
  return null;
};

export const getDeals = async (req, res) => {
  try {
    const clientId = req.query.clientId ? Number(req.query.clientId) : undefined;
    const remainingOnly = req.query.remainingOnly === "true";

    const deals = await prisma.deal.findMany({
      where: {
        ...(clientId ? { clientId } : {}),
        ...(remainingOnly ? { remainingAmount: { gt: 0 } } : {}),
      },
      include: dealInclude,
      orderBy: { id: "desc" },
    });

    res.json({ success: true, data: deals });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDeal = async (req, res) => {
  try {
    const deal = await prisma.deal.findUnique({
      where: { id: Number(req.params.id) },
      include: dealInclude,
    });

    if (!deal) return res.status(404).json({ success: false, message: "Deal not found" });

    res.json({ success: true, data: deal });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createDeal = async (req, res) => {
  try {
    const { clientId, paidAmount } = req.body;
    const selections = normalizeBoardSelections(req.body);
    const selectionValidationError = validateBoardSelections(selections);
    if (selectionValidationError) {
      return res.status(400).json({ success: false, message: selectionValidationError });
    }

    const boardIds = selections.map((item) => item.boardId);
    const boards = await prisma.board.findMany({
      where: { id: { in: boardIds } },
    });

    if (boards.length !== boardIds.length) {
      return res.status(404).json({ success: false, message: "One or more boards not found" });
    }

    const unavailableBoards = boards.filter((item) => item.status !== "AVAILABLE");
    if (unavailableBoards.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Board(s) not available: ${unavailableBoards.map((item) => item.id).join(", ")}`,
      });
    }

    const boardsById = new Map(boards.map((item) => [item.id, item]));
    const computedSummary = buildPricingSummary(selections, boardsById);
    const normalizedPaidAmount = Number(paidAmount || 0);
    const amountValidationError = validateAmounts(computedSummary.amount, normalizedPaidAmount);
    if (amountValidationError) {
      return res.status(400).json({ success: false, message: amountValidationError });
    }

    const result = await prisma.$transaction(async (tx) => {
      const createdDeal = await tx.deal.create({
        data: {
          clientId: Number(clientId),
          startDate: computedSummary.startDate,
          endDate: computedSummary.endDate,
          amount: computedSummary.amount,
          paidAmount: normalizedPaidAmount,
          remainingAmount: computedSummary.amount - normalizedPaidAmount,
          dealBoards: {
            create: selections.map((item) => ({
              boardId: item.boardId,
              startDate: new Date(item.startDate),
              endDate: new Date(item.endDate),
            })),
          },
        },
      });

      if (normalizedPaidAmount > 0) {
        await tx.installment.create({
          data: {
            dealId: createdDeal.id,
            amount: normalizedPaidAmount,
          },
        });
      }

      await Promise.all(
        selections.map((item) =>
          tx.board.update({
            where: { id: item.boardId },
            data: {
              availableDate: new Date(item.endDate),
              status: "OCCUPIED",
            },
          }),
        ),
      );

      return tx.deal.findUnique({
        where: { id: createdDeal.id },
        include: dealInclude,
      });
    });

    res.status(201).json({
      success: true,
      data: result,
      message: "Deal created successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateDeal = async (req, res) => {
  try {
    const dealId = Number(req.params.id);
    const existingDeal = await prisma.deal.findUnique({
      where: { id: dealId },
      include: {
        dealBoards: true,
      },
    });

    if (!existingDeal) {
      return res.status(404).json({ success: false, message: "Deal not found" });
    }

    const selections = normalizeBoardSelections(req.body);
    const nextSelections = selections.length > 0
      ? selections
      : existingDeal.dealBoards.map((item) => ({
          boardId: item.boardId,
          startDate: item.startDate,
          endDate: item.endDate,
        }));

    const selectionValidationError = validateBoardSelections(nextSelections);
    if (selectionValidationError) {
      return res.status(400).json({ success: false, message: selectionValidationError });
    }

    const nextBoardIds = nextSelections.map((item) => item.boardId);
    const currentBoardIds = existingDeal.dealBoards.map((item) => item.boardId);
    const boardsToRelease = currentBoardIds.filter((id) => !nextBoardIds.includes(id));
    const boardsToAdd = nextBoardIds.filter((id) => !currentBoardIds.includes(id));

    if (boardsToAdd.length > 0) {
      const boards = await prisma.board.findMany({
        where: { id: { in: boardsToAdd } },
      });

      if (boards.length !== boardsToAdd.length) {
        return res.status(404).json({ success: false, message: "One or more boards not found" });
      }

      const unavailableBoards = boards.filter((item) => item.status !== "AVAILABLE");
      if (unavailableBoards.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Board(s) not available: ${unavailableBoards.map((item) => item.id).join(", ")}`,
        });
      }
    }

    const allNextBoards = await prisma.board.findMany({
      where: { id: { in: nextBoardIds } },
    });
    const boardsById = new Map(allNextBoards.map((item) => [item.id, item]));
    const computedSummary = buildPricingSummary(nextSelections, boardsById);

    const normalizedPaidAmount =
      req.body.paidAmount !== undefined ? Number(req.body.paidAmount) : Number(existingDeal.paidAmount);
    const amountValidationError = validateAmounts(computedSummary.amount, normalizedPaidAmount);
    if (amountValidationError) {
      return res.status(400).json({ success: false, message: amountValidationError });
    }

    const updatedDeal = await prisma.$transaction(async (tx) => {
      if (boardsToRelease.length > 0) {
        await tx.board.updateMany({
          where: { id: { in: boardsToRelease } },
          data: {
            availableDate: null,
            status: "AVAILABLE",
          },
        });

        await tx.dealBoard.deleteMany({
          where: {
            dealId,
            boardId: { in: boardsToRelease },
          },
        });
      }

      if (boardsToAdd.length > 0) {
        await tx.dealBoard.createMany({
          data: nextSelections
            .filter((item) => boardsToAdd.includes(item.boardId))
            .map((item) => ({
              dealId,
              boardId: item.boardId,
              startDate: new Date(item.startDate),
              endDate: new Date(item.endDate),
            })),
        });
      }

      await Promise.all(
        nextSelections.map((item) =>
          tx.dealBoard.updateMany({
            where: { dealId, boardId: item.boardId },
            data: {
              startDate: new Date(item.startDate),
              endDate: new Date(item.endDate),
            },
          }),
        ),
      );

      await Promise.all(
        nextSelections.map((item) =>
          tx.board.update({
            where: { id: item.boardId },
            data: {
              availableDate: new Date(item.endDate),
              status: "OCCUPIED",
            },
          }),
        ),
      );

      await tx.deal.update({
        where: { id: dealId },
        data: {
          ...(req.body.clientId !== undefined ? { clientId: Number(req.body.clientId) } : {}),
          startDate: computedSummary.startDate,
          endDate: computedSummary.endDate,
          amount: computedSummary.amount,
          paidAmount: normalizedPaidAmount,
          remainingAmount: computedSummary.amount - normalizedPaidAmount,
        },
      });

      return tx.deal.findUnique({
        where: { id: dealId },
        include: dealInclude,
      });
    });

    res.json({ success: true, data: updatedDeal, message: "Deal updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteDeal = async (req, res) => {
  try {
    const dealId = Number(req.params.id);
    const deal = await prisma.deal.findUnique({
      where: { id: dealId },
      include: { dealBoards: true },
    });

    if (!deal) return res.status(404).json({ success: false, message: "Deal not found" });

    const boardIds = deal.dealBoards.map((item) => item.boardId);

    await prisma.$transaction(async (tx) => {
      if (boardIds.length > 0) {
        await tx.board.updateMany({
          where: { id: { in: boardIds } },
          data: {
            availableDate: null,
            status: "AVAILABLE",
          },
        });
      }

      await tx.deal.delete({
        where: { id: dealId },
      });
    });

    res.json({ success: true, message: "Deal deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

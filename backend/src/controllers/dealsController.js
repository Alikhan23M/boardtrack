import prisma from "../../prisma/client.js";

export const getDeals = async (req, res) => {
    try {
        const clientId = req.query.clientId ? Number(req.query.clientId) : undefined;
        const remainingOnly = req.query.remainingOnly === "true";

        const deals = await prisma.deal.findMany({
            where: {
                ...(clientId ? { clientId } : {}),
                ...(remainingOnly ? { remainingAmount: { gt: 0 } } : {}),
            },
            include: {
                client: true,
                board: true,
                installments: {
                    orderBy: { createdAt: "desc" },
                },
            },
            orderBy: { id: "desc" },
        });
        res.json({ success: true, data: deals });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getDeal = async (req, res) => {
    try {
        const deal = await prisma.deal.findUnique({
            where: { id: Number(req.params.id) },
            include: { client: true, board: true, installments: true },
        });
        if (!deal) return res.status(404).json({ success: false, message: "Deal not found" });
        res.json({ success: true, data: deal });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createDeal = async (req, res) => {
  try {
    const {
      clientId,
      boardId,
      startDate,
      endDate,
      amount,
      paidAmount,
    } = req.body;

    const board = await prisma.board.findUnique({
      where: { id: Number(boardId) },
    });

    if (!board) {
      return res.status(404).json({ success: false, message: "Board not found" });
    }

    if (board.status !== "AVAILABLE") {
      return res.status(400).json({
        success: false,
        message: "Board not available",
      });
    }

    const normalizedAmount = Number(amount);
    const normalizedPaidAmount = Number(paidAmount || 0);

    if (normalizedAmount < 0 || normalizedPaidAmount < 0) {
      return res.status(400).json({
        success: false,
        message: "Amount and paid amount must be non-negative",
      });
    }

    if (normalizedPaidAmount > normalizedAmount) {
      return res.status(400).json({
        success: false,
        message: "Paid amount cannot be greater than amount",
      });
    }

    const result = await prisma.$transaction(async (tx) => {
      const createdDeal = await tx.deal.create({
        data: {
          clientId: Number(clientId),
          boardId: Number(boardId),
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          amount: normalizedAmount,
          paidAmount: normalizedPaidAmount,
          remainingAmount: normalizedAmount - normalizedPaidAmount,
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

      await tx.board.update({
        where: { id: Number(boardId) },
        data: {
          availableDate: new Date(endDate),
          status: "OCCUPIED",
        },
      });

      return tx.deal.findUnique({
        where: { id: createdDeal.id },
        include: {
          client: true,
          board: true,
          installments: { orderBy: { createdAt: "desc" } },
        },
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
        const payload = { ...req.body };

        if (payload.amount !== undefined) payload.amount = Number(payload.amount);
        if (payload.paidAmount !== undefined) payload.paidAmount = Number(payload.paidAmount);

        if (payload.amount !== undefined || payload.paidAmount !== undefined) {
            const existingDeal = await prisma.deal.findUnique({
                where: { id: Number(req.params.id) },
            });

            if (!existingDeal) {
                return res.status(404).json({ success: false, message: "Deal not found" });
            }

            const nextAmount = payload.amount ?? existingDeal.amount;
            const nextPaidAmount = payload.paidAmount ?? existingDeal.paidAmount;
            payload.remainingAmount = Number(nextAmount) - Number(nextPaidAmount);
        }

        const deal = await prisma.deal.update({
            where: { id: Number(req.params.id) },
            data: payload,
        });
        res.json({ success: true, data: deal, message: "Deal updated successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteDeal = async (req, res) => {
    try {
        const deal = await prisma.deal.findUnique({where:{id:Number(req.params.id)}});

        const Board = await prisma.board.update({
            where:{id:deal.boardId},
            data:{
                availableDate: null,
                status:"AVAILABLE"
            }
        })
        await prisma.deal.delete({ where: { id: Number(req.params.id) } });
        res.json({ success: true, message: "Deal deleted successfully" });
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message });
    }
};

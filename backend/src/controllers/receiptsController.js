import prisma from "../../prisma/client.js";

export const getDealReceipt = async (req, res) => {
  try {
    const dealId = Number(req.params.dealId);

    const deal = await prisma.deal.findUnique({
      where: { id: dealId },
      include: {
        client: true,
        dealBoards: {
          include: {
            board: true,
          },
          orderBy: { id: "asc" },
        },
        installments: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!deal) {
      return res.status(404).json({ success: false, message: "Deal not found" });
    }

    res.json({
      success: true,
      data: deal,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

import prisma from "../../prisma/client.js";

export const getInstallments = async (req, res) => {
    try {
        const installments = await prisma.installment.findMany({
            include: {
                deal: {
                    include: {
                        client: true,
                        dealBoards: {
                            include: {
                                board: true,
                            },
                        },
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });
        res.json({ success: true, data: installments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createInstallment = async (req, res) => {
    try {
        const data = req.body;
        const dealId = Number(data.dealId);
        const amount = Number(data.amount);

        if (!dealId || !amount || amount <= 0) {
            return res.status(400).json({ success: false, message: "Valid dealId and amount are required" });
        }

        const deal = await prisma.deal.findUnique({ where: { id: dealId } });
        if (!deal) {
            return res.status(404).json({ success: false, message: "Deal not found" });
        }

        if (deal.remainingAmount < amount) {
            return res
                .status(400)
                .json({ success: false, message: "Amount greater than remaining amount cannot be deposited" });
        }

        const installment = await prisma.$transaction(async (tx) => {
            const createdInstallment = await tx.installment.create({
                data: {
                    dealId,
                    amount,
                    ...(data.createdAt ? { createdAt: new Date(data.createdAt) } : {}),
                },
            });

            await tx.deal.update({
                where: { id: dealId },
                data: {
                    paidAmount: deal.paidAmount + amount,
                    remainingAmount: deal.remainingAmount - amount,
                },
            });

            return tx.installment.findUnique({
                where: { id: createdInstallment.id },
                include: {
                    deal: {
                        include: {
                            client: true,
                            dealBoards: {
                                include: {
                                    board: true,
                                },
                            },
                        },
                    },
                },
            });
        });

        res.status(201).json({ success: true, data: installment, message: "Installment added" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateInstallment = async (req, res) => {
    try {
        const installment = await prisma.installment.update({
            where: { id: Number(req.params.id) },
            data: req.body,
        });
        res.json({ success: true, data: installment, message: "Installment updated" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteInstallment = async (req, res) => {
    try {
        await prisma.installment.delete({ where: { id: Number(req.params.id) } });
        res.json({ success: true, message: "Installment deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

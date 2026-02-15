import prisma from "../../prisma/client.js";

export const getInstallments = async (req, res) => {
    try {
        const installments = await prisma.installment.findMany({
            include: { deal: true },
        });
        res.json({ success: true, data: installments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createInstallment = async (req, res) => {
    try {
        const installment = await prisma.installment.create({ data: req.body });
        res.status(201).json({ success: true, data: installment, message: "Installment added" });
    } catch (error) {
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

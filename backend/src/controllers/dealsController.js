import prisma from "../../prisma/client.js";

export const getDeals = async (req, res) => {
    try {
        const deals = await prisma.deal.findMany({
            include: { client: true, board: true, installments: true },
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
        const deal = await prisma.deal.create({ data: req.body });
        res.status(201).json({ success: true, data: deal, message: "Deal created successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateDeal = async (req, res) => {
    try {
        const deal = await prisma.deal.update({
            where: { id: Number(req.params.id) },
            data: req.body,
        });
        res.json({ success: true, data: deal, message: "Deal updated successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteDeal = async (req, res) => {
    try {
        await prisma.deal.delete({ where: { id: Number(req.params.id) } });
        res.json({ success: true, message: "Deal deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

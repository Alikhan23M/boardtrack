import prisma from "../../prisma/client.js";

export const getPrintingServices = async (req, res) => {
    try {
        const services = await prisma.printingService.findMany({ include: { client: true } });
        res.json({ success: true, data: services });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createPrintingService = async (req, res) => {
    try {
        const service = await prisma.printingService.create({ data: req.body });
        res.status(201).json({ success: true, data: service, message: "Printing service added" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updatePrintingService = async (req, res) => {
    try {
        const service = await prisma.printingService.update({
            where: { id: Number(req.params.id) },
            data: req.body,
        });
        res.json({ success: true, data: service, message: "Printing service updated" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deletePrintingService = async (req, res) => {
    try {
        await prisma.printingService.delete({ where: { id: Number(req.params.id) } });
        res.json({ success: true, message: "Printing service deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

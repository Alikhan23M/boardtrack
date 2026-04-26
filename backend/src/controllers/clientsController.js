import prisma from "../../prisma/client.js";

// Standard response format: { success: true/false, data:..., message:... }

export const getClients = async (req, res) => {
    try {
        const clients = await prisma.client.findMany();
        res.json({ success: true, data: clients, message: "Clients fetched successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getClient = async (req, res) => {
    try {
        const client = await prisma.client.findUnique({
            where: { id: Number(req.params.id) },
        });
        if (!client) return res.status(404).json({ success: false, message: "Client not found" });
        res.json({ success: true, data: client });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createClient = async (req, res) => {
    try {
        const client = await prisma.client.create({ data: req.body });
        res.status(201).json({ success: true, data: client, message: "Client created successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateClient = async (req, res) => {
    try {
        const client = await prisma.client.update({
            where: { id: Number(req.params.id) },
            data: req.body,
        });
        res.json({ success: true, data: client, message: "Client updated successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteClient = async (req, res) => {
    try {
        await prisma.client.delete({ where: { id: Number(req.params.id) } });
        res.json({ success: true, message: "Client deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

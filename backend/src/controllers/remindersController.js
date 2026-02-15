import prisma from "../../prisma/client.js";

export const getReminders = async (req, res) => {
    try {
        const reminders = await prisma.reminder.findMany({ include: { board: true } });
        res.json({ success: true, data: reminders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createReminder = async (req, res) => {
    try {
        const reminder = await prisma.reminder.create({ data: req.body });
        res.status(201).json({ success: true, data: reminder, message: "Reminder created" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateReminder = async (req, res) => {
    try {
        const reminder = await prisma.reminder.update({
            where: { id: Number(req.params.id) },
            data: req.body,
        });
        res.json({ success: true, data: reminder, message: "Reminder updated" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteReminder = async (req, res) => {
    try {
        await prisma.reminder.delete({ where: { id: Number(req.params.id) } });
        res.json({ success: true, message: "Reminder deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

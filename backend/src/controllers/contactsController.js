import prisma from "../../prisma/client.js";

export const getContacts = async (req, res) => {
  try {
    
    const contacts = await prisma.contact.findMany({
      include: { board: true },
      orderBy: { createdAt: "desc" },
    });
    res.json({ success: true, data: contacts });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getContact = async (req, res) => {
  try {
    const contact = await prisma.contact.findUnique({
      where: { id: Number(req.params.id) },
      include: { board: true },
    });
    if (!contact) {
      return res.status(404).json({ success: false, message: "Contact not found" });
    }
    res.json({ success: true, data: contact });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createContact = async (req, res) => {
  try {
    const { name, email, phone, boardId, message } = req.body;

    if (!name || !email || !phone || !message) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const contact = await prisma.contact.create({
      data: {
        name,
        email,
        phone,
        boardId: boardId ? Number(boardId) : null,
        message,
      },
      include: { board: true },
    });

    res.status(201).json({ success: true, data: contact });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateContactStatus = async (req, res) => {
  try {
    console.log("updating")
    const { isRead } = req.body;
    const contact = await prisma.contact.update({
      where: { id: Number(req.params.id) },
      data: { isRead },
      include: { board: true },
    });
    res.json({ success: true, data: contact });
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteContact = async (req, res) => {
  try {
    await prisma.contact.delete({
      where: { id: Number(req.params.id) },
    });
    res.json({ success: true, message: "Contact deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

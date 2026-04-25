import prisma from "../../prisma/client.js";
import cloudinary from "../config/cloudinary.js";
export const getBoards = async (req, res) => {
  try {
    const boards = await prisma.board.findMany();
    const updateBoards = boards.map((board) => {

    })
    res.json({ success: true, data: boards });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBoard = async (req, res) => {
  try {
    const board = await prisma.board.findUnique({
      where: { id: Number(req.params.id) },
    });
    if (!board) return res.status(404).json({ success: false, message: "Board not found" });
    res.json({ success: true, data: board });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createBoard = async (req, res) => {
  try {
    
    const data = req.body;

    const board = await prisma.board.create({
      data: {
        size: data.size,
        location: data.location,
        frontSide: data.frontSide,
        price: parseFloat(data.price),
        availableDate: data.availableDate
          ? new Date(data.availableDate).toISOString()
          : null,

        imageUrl: req.file?.path || null, 
        imagePublicId: req.file?.filename || null,
        featured: data.featured === "true" || data.featured === true,
      },
    });

    res.status(201).json({
      success: true,
      data: board,
      message: "Board created successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


export const updateBoard = async (req, res) => {
  try {
    const data = req.body;

    const existingBoard = await prisma.board.findUnique({
      where: { id: Number(req.params.id) },
    });

    if (!existingBoard) {
      return res.status(404).json({
        success: false,
        message: "Board not found",
      });
    }

    // 🧹 if new image uploaded → delete old one
    if (req.file && existingBoard.imagePublicId) {
      await cloudinary.uploader.destroy(existingBoard.imagePublicId);
    }

    const board = await prisma.board.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        size: data.size,
        location: data.location,
        frontSide: data.frontSide,
        price: Number(data.price),
        status: data.status,
        availableDate: data.availableDate
          ? new Date(data.availableDate).toISOString()
          : null,
        featured: data.featured === "true" || data.featured === true,

        imageUrl: req.file?.path || existingBoard.imageUrl,
        imagePublicId: req.file?.filename || existingBoard.imagePublicId,
      },
    });

    res.json({
      success: true,
      data: board,
      message: "Board updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getFeaturedBoards = async (req, res) => {
  try {
    
    const boards = await prisma.board.findMany({
      where: {
        featured: true,
        status: "AVAILABLE",
      },
    });
    res.json({ success: true, data: boards });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteBoard = async (req, res) => {
  try {
    const board = await prisma.board.findUnique({
      where: { id: Number(req.params.id) },
    });

    if (!board) {
      return res.status(404).json({
        success: false,
        message: "Board not found",
      });
    }

    // 🧹 delete image from cloudinary first
    if (board.imagePublicId) {
      await cloudinary.uploader.destroy(board.imagePublicId);
    }

    await prisma.board.delete({
      where: { id: Number(req.params.id) },
    });

    res.json({
      success: true,
      message: "Board deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

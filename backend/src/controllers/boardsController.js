import prisma from "../../prisma/client.js";

export const getBoards = async (req, res) => {
    try {
        const boards = await prisma.board.findMany();
        const updateBoards = boards.map((board)=>{
            
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
                availableDate: (new Date(data.availableDate)).toISOString(),
            }
         });
        res.status(201).json({ success: true, data: board, message: "Board created successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateBoard = async (req, res) => {
    try {
        const data = req.body;
        data.availableDate = (new Date(data.availableDate)).toISOString();
        const board = await prisma.board.update({
            where: { id: Number(req.params.id) },
            data: data,
        });
        res.json({ success: true, data: board, message: "Board updated successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteBoard = async (req, res) => {
    try {
        await prisma.board.delete({ where: { id: Number(req.params.id) } });
        res.json({ success: true, message: "Board deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

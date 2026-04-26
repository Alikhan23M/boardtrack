import express from "express";
import {
   getBoard,
   getBoards,
   createBoard,
   updateBoard,
   deleteBoard,
   getFeaturedBoards
   
} from "../controllers/boardsController.js";
import upload from "../middleware/upload.js";
import { auth } from "../middleware/auth.js";


const router = express.Router();
router.get("/featured", getFeaturedBoards);
/**
 * @swagger
 * /api/boards:
 *   get:
 *     tags: [Boards]
 *     summary: Get all boards
 *     responses:
 *       200:
 *         description: Boards fetched successfully
 *       500:
 *         description: Server error
 */
router.get("/", getBoards);
/**
 * @swagger
 * /api/boards/{id}:
 *   get:
 *     tags: [Boards]
 *     summary: Get a single board
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Board fetched successfully
 *       404:
 *         description: Board not found
 *       500:
 *         description: Server error
 */
router.get("/:id", getBoard);
/**
 * @swagger
 * /api/boards:
 *   post:
 *     tags: [Boards]
 *     summary: Create a board
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BoardInput'
 *     responses:
 *       201:
 *         description: Board created
 *       500:
 *         description: Server error
 */
// router.post("/", createBoard);
/**
 * @swagger
 * /api/boards/{id}:
 *   put:
 *     tags: [Boards]
 *     summary: Update a board
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BoardInput'
 *     responses:
 *       200:
 *         description: Board updated
 *       500:
 *         description: Server error
 */
// router.put("/:id", updateBoard);
/**
 * @swagger
 * /api/boards/{id}:
 *   delete:
 *     tags: [Boards]
 *     summary: Delete a board
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Board deleted
 *       500:
 *         description: Server error
 */
router.get("/featured", getFeaturedBoards);
router.delete("/:id",auth, deleteBoard);
router.post("/",auth, upload.single("image"), createBoard);
router.put("/:id",auth, upload.single("image"), updateBoard);
export default router;

import express from "express";
import {
    getDeals,
    getDeal,
    createDeal,
    updateDeal,
    deleteDeal
} from "../controllers/dealsController.js";

const router = express.Router();

/**
 * @swagger
 * /api/deals:
 *   get:
 *     tags: [Deals]
 *     summary: Get all deals
 *     responses:
 *       200:
 *         description: Deals fetched successfully
 *       500:
 *         description: Server error
 */
router.get("/", getDeals);
/**
 * @swagger
 * /api/deals/{id}:
 *   get:
 *     tags: [Deals]
 *     summary: Get a single deal
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Deal fetched successfully
 *       404:
 *         description: Deal not found
 *       500:
 *         description: Server error
 */
router.get("/:id", getDeal);
/**
 * @swagger
 * /api/deals:
 *   post:
 *     tags: [Deals]
 *     summary: Create a deal
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DealInput'
 *     responses:
 *       201:
 *         description: Deal created
 *       500:
 *         description: Server error
 */
router.post("/", createDeal);
/**
 * @swagger
 * /api/deals/{id}:
 *   put:
 *     tags: [Deals]
 *     summary: Update a deal
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
 *             $ref: '#/components/schemas/DealInput'
 *     responses:
 *       200:
 *         description: Deal updated
 *       500:
 *         description: Server error
 */
router.put("/:id", updateDeal);
/**
 * @swagger
 * /api/deals/{id}:
 *   delete:
 *     tags: [Deals]
 *     summary: Delete a deal
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Deal deleted
 *       500:
 *         description: Server error
 */
router.delete("/:id", deleteDeal);

export default router;

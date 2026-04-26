import express from "express";
import {
   
    getInstallments,
    createInstallment,
    updateInstallment,
    deleteInstallment
} from "../controllers/installmentsController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

/**
 * @swagger
 * /api/installments:
 *   get:
 *     tags: [Installments]
 *     summary: Get all installments
 *     responses:
 *       200:
 *         description: Installments fetched successfully
 *       500:
 *         description: Server error
 */
router.get("/",auth, getInstallments);
// router.get("/:id", getClient);
/**
 * @swagger
 * /api/installments:
 *   post:
 *     tags: [Installments]
 *     summary: Create an installment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InstallmentInput'
 *     responses:
 *       201:
 *         description: Installment created
 *       500:
 *         description: Server error
 */
router.post("/",auth, createInstallment);
/**
 * @swagger
 * /api/installments/{id}:
 *   put:
 *     tags: [Installments]
 *     summary: Update an installment
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
 *             $ref: '#/components/schemas/InstallmentInput'
 *     responses:
 *       200:
 *         description: Installment updated
 *       500:
 *         description: Server error
 */
router.put("/:id",auth, updateInstallment);
/**
 * @swagger
 * /api/installments/{id}:
 *   delete:
 *     tags: [Installments]
 *     summary: Delete an installment
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Installment deleted
 *       500:
 *         description: Server error
 */
router.delete("/:id",auth, deleteInstallment);

export default router;

import express from "express";
import {
    getPrintingServices,
    createPrintingService,
    updatePrintingService,
    deletePrintingService
    
} from "../controllers/printingController.js";

const router = express.Router();

/**
 * @swagger
 * /api/printing-services:
 *   get:
 *     tags: [Printing Services]
 *     summary: Get all printing services
 *     responses:
 *       200:
 *         description: Printing services fetched successfully
 *       500:
 *         description: Server error
 */
router.get("/", getPrintingServices);
// router.get("/:id", getClient);
/**
 * @swagger
 * /api/printing-services:
 *   post:
 *     tags: [Printing Services]
 *     summary: Create a printing service
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PrintingServiceInput'
 *     responses:
 *       201:
 *         description: Printing service created
 *       500:
 *         description: Server error
 */
router.post("/", createPrintingService);
/**
 * @swagger
 * /api/printing-services/{id}:
 *   put:
 *     tags: [Printing Services]
 *     summary: Update a printing service
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
 *             $ref: '#/components/schemas/PrintingServiceInput'
 *     responses:
 *       200:
 *         description: Printing service updated
 *       500:
 *         description: Server error
 */
router.put("/:id", updatePrintingService);
/**
 * @swagger
 * /api/printing-services/{id}:
 *   delete:
 *     tags: [Printing Services]
 *     summary: Delete a printing service
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Printing service deleted
 *       500:
 *         description: Server error
 */
router.delete("/:id", deletePrintingService);

export default router;

import express from "express";
import {
    getClients,
    getClient,
    createClient,
    updateClient,
    deleteClient
} from "../controllers/clientsController.js";

const router = express.Router();

/**
 * @swagger
 * /api/clients:
 *   get:
 *     tags: [Clients]
 *     summary: Get all clients
 *     responses:
 *       200:
 *         description: Clients fetched successfully
 *       500:
 *         description: Server error
 */
router.get("/", getClients);
/**
 * @swagger
 * /api/clients/{id}:
 *   get:
 *     tags: [Clients]
 *     summary: Get a single client
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Client fetched successfully
 *       404:
 *         description: Client not found
 *       500:
 *         description: Server error
 */
router.get("/:id", getClient);
/**
 * @swagger
 * /api/clients:
 *   post:
 *     tags: [Clients]
 *     summary: Create a new client
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ClientInput'
 *     responses:
 *       201:
 *         description: Client created
 *       500:
 *         description: Server error
 */
router.post("/", createClient);
/**
 * @swagger
 * /api/clients/{id}:
 *   put:
 *     tags: [Clients]
 *     summary: Update a client
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
 *             $ref: '#/components/schemas/ClientInput'
 *     responses:
 *       200:
 *         description: Client updated
 *       500:
 *         description: Server error
 */
router.put("/:id", updateClient);
/**
 * @swagger
 * /api/clients/{id}:
 *   delete:
 *     tags: [Clients]
 *     summary: Delete a client
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Client deleted
 *       500:
 *         description: Server error
 */
router.delete("/:id", deleteClient);

export default router;

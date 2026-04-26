import express from "express";
import {
  getContacts,
  getContact,
  createContact,
  updateContactStatus,
  deleteContact,
} from "../controllers/contactsController.js";
import {auth} from '../middleware/auth.js'

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Contacts
 *     description: Contact message management endpoints
 */

/**
 * @swagger
 * /api/contacts:
 *   get:
 *     summary: Get all contact messages
 *     tags: [Contacts]
 *     responses:
 *       200:
 *         description: List of all contacts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 */
router.get("/", auth, getContacts);

/**
 * @swagger
 * /api/contacts/{id}:
 *   get:
 *     summary: Get a specific contact by ID
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Contact details
 *       404:
 *         description: Contact not found
 */
router.get("/:id",auth, getContact);

/**
 * @swagger
 * /api/contacts:
 *   post:
 *     summary: Create a new contact message
 *     tags: [Contacts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, phone, message]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               boardId:
 *                 type: integer
 *                 nullable: true
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Contact created successfully
 */
router.post("/", createContact);

/**
 * @swagger
 * /api/contacts/{id}:
 *   patch:
 *     summary: Update contact read status
 *     tags: [Contacts]
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
 *             type: object
 *             properties:
 *               isRead:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Contact updated
 */
router.patch("/:id",auth, updateContactStatus);

/**
 * @swagger
 * /api/contacts/{id}:
 *   delete:
 *     summary: Delete a contact
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Contact deleted successfully
 */
router.delete("/:id",auth, deleteContact);

export default router;

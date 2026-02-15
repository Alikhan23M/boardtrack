import express from "express";
import {
   getReminders,
   createReminder,
   updateReminder,
   deleteReminder
} from "../controllers/remindersController.js";

const router = express.Router();

/**
 * @swagger
 * /api/reminders:
 *   get:
 *     tags: [Reminders]
 *     summary: Get all reminders
 *     responses:
 *       200:
 *         description: Reminders fetched successfully
 *       500:
 *         description: Server error
 */
router.get("/", getReminders);
// router.get("/:id", getClient);
/**
 * @swagger
 * /api/reminders:
 *   post:
 *     tags: [Reminders]
 *     summary: Create a reminder
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReminderInput'
 *     responses:
 *       201:
 *         description: Reminder created
 *       500:
 *         description: Server error
 */
router.post("/", createReminder);
/**
 * @swagger
 * /api/reminders/{id}:
 *   put:
 *     tags: [Reminders]
 *     summary: Update a reminder
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
 *             $ref: '#/components/schemas/ReminderInput'
 *     responses:
 *       200:
 *         description: Reminder updated
 *       500:
 *         description: Server error
 */
router.put("/:id", updateReminder);
/**
 * @swagger
 * /api/reminders/{id}:
 *   delete:
 *     tags: [Reminders]
 *     summary: Delete a reminder
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Reminder deleted
 *       500:
 *         description: Server error
 */
router.delete("/:id", deleteReminder);

export default router;

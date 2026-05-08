import express from "express";
import { hearingController } from "./controller.js";
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Hearings
 *   description: Hearing management APIs
 */

/**
 * @swagger
 * /api/hearings/{caseId}:
 *   post:
 *     summary: Add a hearing to a case
 *     tags: [Hearings]
 *     parameters:
 *       - in: path
 *         name: caseId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date-time
 *               description:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [hearing, deadline]
 *     responses:
 *       200:
 *         description: Hearing added
 *       400:
 *         description: Error
 *   get:
 *     summary: List all hearings for a case
 *     tags: [Hearings]
 *     parameters:
 *       - in: path
 *         name: caseId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Page size
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [date, status, type]
 *         description: Sort field
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *         description: Sort order
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by court name or event type
 *     responses:
 *       200:
 *         description: List of hearings
 *       400:
 *         description: Error
 * /api/hearings/{id}:
 *   put:
 *     summary: Update a hearing
 *     tags: [Hearings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Hearing updated
 *       400:
 *         description: Error
 *   delete:
 *     summary: Delete a hearing
 *     tags: [Hearings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Hearing deleted
 *       400:
 *         description: Error
 */
router.post("/:caseId", hearingController.add);
router.get("/:caseId", hearingController.list);
router.put("/:id", hearingController.update);
router.delete("/:id", hearingController.remove);

export default router;

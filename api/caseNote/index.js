import express from "express";
import { caseNoteController } from "./controller.js";
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: CaseNotes
 *   description: Case note management APIs
 */

/**
 * @swagger
 * /api/case-notes/{caseId}:
 *   post:
 *     summary: Add a note to a case
 *     tags: [CaseNotes]
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
 *               note:
 *                 type: string
 *     responses:
 *       200:
 *         description: Note added
 *       400:
 *         description: Error
 *   get:
 *     summary: List all notes for a case
 *     tags: [CaseNotes]
 *     parameters:
 *       - in: path
 *         name: caseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of notes
 *       400:
 *         description: Error
 * /api/case-notes/{id}:
 *   put:
 *     summary: Update a note
 *     tags: [CaseNotes]
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
 *             properties:
 *               note:
 *                 type: string
 *     responses:
 *       200:
 *         description: Note updated
 *       400:
 *         description: Error
 *   delete:
 *     summary: Delete a note
 *     tags: [CaseNotes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Note deleted
 *       400:
 *         description: Error
 */
router.post("/:caseId", caseNoteController.add);
router.get("/:caseId", caseNoteController.list);
router.put("/:id", caseNoteController.update);
router.delete("/:id", caseNoteController.remove);

export default router;

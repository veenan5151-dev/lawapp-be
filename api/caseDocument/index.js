import express from "express";
import { caseDocumentController } from "./controller.js";
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: CaseDocuments
 *   description: Case document management APIs
 */

/**
 * @swagger
 * /api/case-documents/{caseId}:
 *   post:
 *     summary: Upload a document to a case
 *     tags: [CaseDocuments]
 *     parameters:
 *       - in: path
 *         name: caseId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               originalName:
 *                 type: string
 *     responses:
 *       200:
 *         description: Document uploaded
 *       400:
 *         description: Error
 *   get:
 *     summary: List all documents for a case
 *     tags: [CaseDocuments]
 *     parameters:
 *       - in: path
 *         name: caseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of documents
 *       400:
 *         description: Error
 * /api/case-documents/{id}:
 *   delete:
 *     summary: Delete a document
 *     tags: [CaseDocuments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Document deleted
 *       400:
 *         description: Error
 */
router.post("/:caseId", caseDocumentController.add);
router.get("/:caseId", caseDocumentController.list);
router.delete("/:id", caseDocumentController.remove);

export default router;

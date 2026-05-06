import express from "express";
import { caseController } from "./controller.js";

const router = express.Router();

/**
 * @openapi
 * /api/cases:
 *   post:
 *     summary: Create a new case
 *     tags:
 *       - Case
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - caseNumber
 *               - courtName
 *               - clientId
 *             properties:
 *               title:
 *                 type: string
 *               caseNumber:
 *                 type: string
 *               courtName:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Active, Closed, Pending]
 *               clientId:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Case created
 *       400:
 *         description: Error
 *   get:
 *     summary: List all cases
 *     tags:
 *       - Case
 *     parameters:
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
 *           enum: [title, courtName, caseNumber, status]
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
 *         description: Search by title, case number, or court name
 *       - in: query
 *         name: filterStatus
 *         schema:
 *           type: string
 *           enum: [Active, Closed, Pending]
 *         description: Filter by status
 *       - in: query
 *         name: filterClient
 *         schema:
 *           type: string
 *         description: Filter by linked client (clientId)
 *     responses:
 *       200:
 *         description: List of cases
 *       400:
 *         description: Error
 * /api/cases/{id}:
 *   get:
 *     summary: Get case by ID
 *     tags:
 *       - Case
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Case details
 *       400:
 *         description: Error
 *   put:
 *     summary: Update case by ID
 *     tags:
 *       - Case
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
 *               title:
 *                 type: string
 *               caseNumber:
 *                 type: string
 *               courtName:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Active, Closed, Pending]
 *               clientId:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Case updated
 *       400:
 *         description: Error
 *   delete:
 *     summary: Delete case by ID
 *     tags:
 *       - Case
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Case deleted
 *       400:
 *         description: Error
 */

router.post("/", caseController.create);
router.get("/", caseController.list);
router.get("/:id", caseController.get);
router.put("/:id", caseController.update);
router.delete("/:id", caseController.remove);

export default router;

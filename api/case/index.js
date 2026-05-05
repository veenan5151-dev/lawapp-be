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

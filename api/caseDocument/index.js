import express from "express";
import { caseDocumentController } from "./controller.js";
const router = express.Router();

router.post("/:caseId", caseDocumentController.add);
router.get("/:caseId", caseDocumentController.list);
router.delete("/:id", caseDocumentController.remove);

export default router;

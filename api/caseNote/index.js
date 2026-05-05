import express from "express";
import { caseNoteController } from "./controller.js";
const router = express.Router();

router.post("/:caseId", caseNoteController.add);
router.get("/:caseId", caseNoteController.list);
router.put("/:id", caseNoteController.update);
router.delete("/:id", caseNoteController.remove);

export default router;

import express from "express";
import { hearingController } from "./controller.js";
const router = express.Router();

router.post("/:caseId", hearingController.add);
router.get("/:caseId", hearingController.list);
router.put("/:id", hearingController.update);
router.delete("/:id", hearingController.remove);

export default router;

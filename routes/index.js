import express from "express";
import authRouter from "../api/auth/index.js";
import caseRouter from "../api/case/index.js";
import caseDocumentRouter from "../api/caseDocument/index.js";
import caseNoteRouter from "../api/caseNote/index.js";
import clientRouter from "../api/client/index.js";
import hearingRouter from "../api/hearing/index.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/clients", clientRouter);
router.use("/cases", caseRouter);
router.use("/case-notes", caseNoteRouter);
router.use("/hearings", hearingRouter);
router.use("/case-documents", caseDocumentRouter);

export default router;

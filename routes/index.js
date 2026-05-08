import express from "express";
import authRouter from "../api/auth/index.js";
import caseRouter from "../api/case/index.js";
import caseDocumentRouter from "../api/caseDocument/index.js";
import caseNoteRouter from "../api/caseNote/index.js";
import clientRouter from "../api/client/index.js";
import hearingRouter from "../api/hearing/index.js";
import userRouter from "../api/user/index.js";

import auth from "../middleware/auth.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/clients", auth, clientRouter);
router.use("/cases", auth, caseRouter);
router.use("/case-notes", auth, caseNoteRouter);
router.use("/hearings", auth, hearingRouter);
router.use("/case-documents", auth, caseDocumentRouter);
router.use("/user", auth, userRouter);

export default router;

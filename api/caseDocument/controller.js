// Controller logic for case documents
import { failedResponse, goodResponse } from "../../helper/response.js";
import { caseDocumentService } from "./service.js";

export const caseDocumentController = {
    async add(req, res) {
        try {
            // file upload logic should set fileUrl and originalName in req.body
            const doc = await caseDocumentService.addDocument({
                ...req.body,
                caseId: req.params.caseId,
            });
            res.json(goodResponse(doc, "Document uploaded"));
        } catch (err) {
            res.status(400).json(failedResponse(err.message));
        }
    },
    async list(req, res) {
        try {
            const docs = await caseDocumentService.getDocuments(req.params.caseId);
            res.json(goodResponse(docs, "Documents list"));
        } catch (err) {
            res.status(400).json(failedResponse(err.message));
        }
    },
    async remove(req, res) {
        try {
            await caseDocumentService.deleteDocument(req.params.id);
            res.json(goodResponse({}, "Document deleted"));
        } catch (err) {
            res.status(400).json(failedResponse(err.message));
        }
    },
};

export default caseDocumentController;

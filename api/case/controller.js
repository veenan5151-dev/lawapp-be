// Controller logic for case
import { failedResponse, goodResponse } from "../../helper/response.js";
import { caseService } from "./service.js";

export const caseController = {
    async create(req, res) {
        try {
            const kase = await caseService.createCase(req.body);
            res.json(goodResponse(kase, "Case created"));
        } catch (err) {
            res.status(400).json(failedResponse(err.message));
        }
    },
    async list(req, res) {
        try {
            const cases = await caseService.getCases();
            res.json(goodResponse({ cases }, "Cases list"));
        } catch (err) {
            res.status(400).json(failedResponse(err.message));
        }
    },
    async get(req, res) {
        try {
            const data = await caseService.getCaseById(req.params.id);
            res.json(goodResponse({ data }, "Case details"));
        } catch (err) {
            res.status(400).json(failedResponse(err.message));
        }
    },
    async update(req, res) {
        try {
            await caseService.updateCase(req.params.id, req.body);
            res.json(goodResponse({}, "Case updated"));
        } catch (err) {
            res.status(400).json(failedResponse(err.message));
        }
    },
    async remove(req, res) {
        try {
            await caseService.deleteCase(req.params.id);
            res.json(goodResponse({}, "Case deleted"));
        } catch (err) {
            res.status(400).json(failedResponse(err.message));
        }
    },
};

export default caseController;

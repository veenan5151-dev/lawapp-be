// Controller logic for hearings
import { failedResponse, goodResponse } from "../../helper/response.js";
import { hearingService } from "./service.js";

export const hearingController = {
    async add(req, res) {
        try {
            const hearing = await hearingService.addHearing({
                ...req.body,
                caseId: req.params.caseId,
            });
            res.json(goodResponse(hearing, "Hearing added"));
        } catch (err) {
            res.status(400).json(failedResponse(err.message));
        }
    },
    async list(req, res) {
        try {
            const result = await hearingService.getHearings(req.params.caseId, req.query);
            res.json(goodResponse(result, "Hearings list"));
        } catch (err) {
            res.status(400).json(failedResponse(err.message));
        }
    },
    async update(req, res) {
        try {
            const hearing = await hearingService.updateHearing(req.params.id, req.body);
            res.json(goodResponse(hearing, "Hearing updated"));
        } catch (err) {
            res.status(400).json(failedResponse(err.message));
        }
    },
    async remove(req, res) {
        try {
            await hearingService.deleteHearing(req.params.id);
            res.json(goodResponse({}, "Hearing deleted"));
        } catch (err) {
            res.status(400).json(failedResponse(err.message));
        }
    },
};

export default hearingController;

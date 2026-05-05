// Controller logic for case notes
import { failedResponse, goodResponse } from "../../helper/response.js";
import { caseNoteService } from "./service.js";

export const caseNoteController = {
    async add(req, res) {
        try {
            const note = await caseNoteService.addNote({ ...req.body, caseId: req.params.caseId });
            res.json(goodResponse(note, "Note added"));
        } catch (err) {
            res.status(400).json(failedResponse(err.message));
        }
    },
    async list(req, res) {
        try {
            const notes = await caseNoteService.getNotes(req.params.caseId);
            res.json(goodResponse(notes, "Notes list"));
        } catch (err) {
            res.status(400).json(failedResponse(err.message));
        }
    },
    async update(req, res) {
        try {
            const note = await caseNoteService.updateNote(req.params.id, req.body.note);
            res.json(goodResponse(note, "Note updated"));
        } catch (err) {
            res.status(400).json(failedResponse(err.message));
        }
    },
    async remove(req, res) {
        try {
            await caseNoteService.deleteNote(req.params.id);
            res.json(goodResponse({}, "Note deleted"));
        } catch (err) {
            res.status(400).json(failedResponse(err.message));
        }
    },
};

export default caseNoteController;

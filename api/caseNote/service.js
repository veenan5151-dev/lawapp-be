// Service logic for case notes
import CaseNote from "../../models/CaseNote.js";

export const caseNoteService = {
    async addNote(data) {
        return await CaseNote.create(data);
    },
    async getNotes(caseId) {
        return await CaseNote.findAll({ where: { caseId }, order: [["createdAt", "DESC"]] });
    },
    async updateNote(id, note) {
        const entry = await CaseNote.findByPk(id);
        if (!entry) throw new Error("Note not found");
        return await entry.update({ note });
    },
    async deleteNote(id) {
        const entry = await CaseNote.findByPk(id);
        if (!entry) throw new Error("Note not found");
        await entry.destroy();
        return true;
    },
};

export default caseNoteService;

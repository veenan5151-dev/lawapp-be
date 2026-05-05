// Service logic for case documents
import CaseDocument from "../../models/CaseDocument.js";

export const caseDocumentService = {
    async addDocument(data) {
        return await CaseDocument.create(data);
    },
    async getDocuments(caseId) {
        return await CaseDocument.findAll({ where: { caseId }, order: [["createdAt", "DESC"]] });
    },
    async deleteDocument(id) {
        const doc = await CaseDocument.findByPk(id);
        if (!doc) throw new Error("Document not found");
        await doc.destroy();
        return true;
    },
};

export default caseDocumentService;

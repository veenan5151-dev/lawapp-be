// Service logic for case
import Case from "../../models/Case.js";
import User from "../../models/User.js";

export const caseService = {
    async createCase(data) {
        await Case.create(data);
    },
    async getCases() {
        const data = await Case.findAll({ include: [{ model: User, as: "client" }] });
        return data;
    },
    async getCaseById(id) {
        const data = await Case.findByPk(id, { include: [{ model: User, as: "client" }] });
        return data;
    },
    async updateCase(id, data) {
        const caseData = await Case.findByPk(id);
        if (!caseData) throw new Error("Case not found");
        await caseData.update(data);
    },
    async deleteCase(id) {
        const caseData = await Case.findByPk(id);
        if (!caseData) throw new Error("Case not found");
        await caseData.destroy();
    },
};

export default caseService;

// Service logic for hearings
import Hearing from "../../models/Hearing.js";

export const hearingService = {
    async addHearing(data) {
        return await Hearing.create(data);
    },
    async getHearings(caseId) {
        return await Hearing.findAll({ where: { caseId }, order: [["date", "ASC"]] });
    },
    async updateHearing(id, data) {
        const hearing = await Hearing.findByPk(id);
        if (!hearing) throw new Error("Hearing not found");
        return await hearing.update(data);
    },
    async deleteHearing(id) {
        const hearing = await Hearing.findByPk(id);
        if (!hearing) throw new Error("Hearing not found");
        await hearing.destroy();
        return true;
    },
};

export default hearingService;

// Service logic for hearings
import Hearing from "../../models/Hearing.js";


export const hearingService = {
    async addHearing(data) {
        return await Hearing.create(data);
    },
    async getHearings(
        caseId,
        { page = 1, limit = 10, sortBy = "date", sortOrder = "ASC", search = "" } = {},
    ) {
        const offset = (page - 1) * limit;
        const where = { caseId };

        // Search by case's court name or event type
        if (search) {
            // Need to join with Case for courtName
            // Sequelize include with where on associated model
        }

        // Allowed sort fields
        const allowedSort = ["date", "status", "type"];
        const order = allowedSort.includes(sortBy) ? [[sortBy, sortOrder]] : [["date", "ASC"]];

        // Include Case for searching courtName
        const include = [{ model: (await import("../../models/Case.js")).default }];

        // If searching by courtName or event type
        if (search) {
            include[0].where = {
                courtName: { [Op.iLike]: `%${search}%` },
            };
            include[0].required = false;
            where[Op.or] = [{ type: { [Op.iLike]: `%${search}%` } }];
        }

        const { Op } = (await import("sequelize")).default;
        const data = await Hearing.findAndCountAll({
            where,
            include,
            offset,
            limit,
            order,
            distinct: true,
        });
        return data;
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

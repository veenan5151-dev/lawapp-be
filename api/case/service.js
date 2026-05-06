// Service logic for case
import Case from "../../models/Case.js";
import User from "../../models/User.js";

export const caseService = {
    async createCase(data) {
        await Case.create(data);
    },
    async getCases({
        page = 1,
        limit = 10,
        sortBy = "title",
        sortOrder = "ASC",
        search = "",
        filterStatus = null,
        filterClient = null,
    } = {}) {
        const offset = (page - 1) * limit;
        const where = {};

        // Search by title, case number, court name
        if (search) {
            where[Op.or] = [
                { title: { [Op.iLike]: `%${search}%` } },
                { caseNumber: { [Op.iLike]: `%${search}%` } },
                { courtName: { [Op.iLike]: `%${search}%` } },
            ];
        }

        // Filter by status
        if (filterStatus) {
            where.status = filterStatus;
        }

        // Filter by linked client
        if (filterClient) {
            where.clientId = filterClient;
        }

        // Allowed sort fields
        const allowedSort = ["title", "courtName", "caseNumber", "status"];
        const order = allowedSort.includes(sortBy) ? [[sortBy, sortOrder]] : [["title", "ASC"]];

        const { Op } = (await import("sequelize")).default;
        const data = await Case.findAndCountAll({
            where,
            include: [{ model: User, as: "client" }],
            offset,
            limit,
            order,
            distinct: true,
        });
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

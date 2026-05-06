// Service logic for client
import STATUS from "../../helper/enum/status.js";
import USER_TYPES from "../../helper/enum/userType.js";
import BadRequest from "../../helper/exception/badRequest.js";
import Case from "../../models/Case.js";
import User from "../../models/User.js";

export const clientService = {
    async createClient(data) {
        const existingUser = await User.findOne({ where: { email: data.email } });
        if (existingUser) {
            throw new BadRequest("Email already in use");
        }
        const payload = {
            ...data,
            userType: USER_TYPES.CLIENT,
            status: STATUS.ACTIVE,
        };
        await User.create(payload);
    },

    async getClients({
        page = 1,
        limit = 10,
        sortBy = "name",
        sortOrder = "ASC",
        search = "",
        filterLinked = null,
        filterDate = null,
    } = {}) {
        const offset = (page - 1) * limit;
        const where = {};

        // Search by name, phone, address
        if (search) {
            where[Op.or] = [
                { name: { [Op.iLike]: `%${search}%` } },
                { phone: { [Op.iLike]: `%${search}%` } },
                { address: { [Op.iLike]: `%${search}%` } },
            ];
        }

        // Filter by linked (has cases)
        if (filterLinked !== null) {
            where["$cases.id$"] = filterLinked ? { [Op.ne]: null } : null;
        }

        // Filter by case date (any case linked to client with date in range)
        let include = [{ model: Case, as: "cases" }];
        if (filterDate) {
            include = [
                {
                    model: Case,
                    as: "cases",
                    where: {
                        createdAt: filterDate,
                    },
                    required: true,
                },
            ];
        }

        // Allowed sort fields
        const allowedSort = ["name", "address", "phone"];
        const order = allowedSort.includes(sortBy) ? [[sortBy, sortOrder]] : [["name", "ASC"]];

        const { Op } = (await import("sequelize")).default;
        const data = await User.findAndCountAll({
            where,
            include,
            offset,
            limit,
            order,
            distinct: true,
        });
        return data;
    },

    async getClientById(id) {
        return await User.findByPk(id, { include: [{ model: Case, as: "cases" }] });
    },

    async updateClient(id, data) {
        const client = await User.findByPk(id);
        if (!client) throw new BadRequest("Client not found");
        return await client.update(data);
    },

    async deleteClient(id) {
        const client = await User.findByPk(id);
        if (!client) throw new BadRequest("Client not found");
        await client.destroy();
        return true;
    },
};

export default clientService;

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

    async getClients() {
        const data = await User.findAll({ include: [{ model: Case, as: "cases" }] });
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

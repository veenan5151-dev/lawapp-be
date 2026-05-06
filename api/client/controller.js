// Controller logic for client
import { failedResponse, goodResponse } from "../../helper/response.js";
import { clientService } from "./service.js";

export const clientController = {
    async create(req, res) {
        try {
            const client = await clientService.createClient(req.body);
            res.json(goodResponse(client, "Client created"));
        } catch (err) {
            res.status(400).json(failedResponse(err.message));
        }
    },

    async list(req, res) {
        try {
            const result = await clientService.getClients(req.query);
            res.json(goodResponse(result, "Clients list"));
        } catch (err) {
            res.status(400).json(failedResponse(err.message));
        }
    },

    async get(req, res) {
        try {
            const client = await clientService.getClientById(req.params.id);
            res.json(goodResponse({ client }, "Client details"));
        } catch (err) {
            res.status(400).json(failedResponse(err.message));
        }
    },

    async update(req, res) {
        try {
            await clientService.updateClient(req.params.id, req.body);
            res.json(goodResponse({}, "Client updated"));
        } catch (err) {
            res.status(400).json(failedResponse(err.message));
        }
    },

    async remove(req, res) {
        try {
            await clientService.deleteClient(req.params.id);
            res.json(goodResponse({}, "Client deleted"));
        } catch (err) {
            res.status(400).json(failedResponse(err.message));
        }
    },
};

export default clientController;

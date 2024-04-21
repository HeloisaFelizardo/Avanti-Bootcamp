import { prismaClient } from '../database/PrismaClient.js';

export class ClientController {
	async findAllClients(request, response) {
		const clients = await prismaClient.client.findMany();
		response.status(200).json(clients);
	}

	async findClientById(request, response) {
		const { id } = request.params;
		try {
			const client = await prismaClient.client.findFirst({
				where: {
					id,
				},

				include: {
					order: {
						orderBy: { price: 'asc' },
					},
				},
			});
			if (!client) {
				response.status(404).send();
			}
			response.status(200).json(client);
		} catch (error) {
			response.status(500).send();
		}
	}

	async createClient(request, response) {
		const { name, email, phone } = request.body;
		const client = await prismaClient.client.create({
			data: {
				name: name,
				email: email,
				phone: phone,
			},
		});
		response.status(201).json(client);
	}

	async updateClient(request, response) {
		const { id } = request.params;
		const { name, email, phone } = request.body;
		const client = await prismaClient.client.update({
			where: {
				id,
			},
			data: {
				name: name,
				email: email,
				phone: phone,
			},
		});
		response.status(200).json(client);
	}

	async deleteClient(request, response) {
		const { id } = request.params;
		const client = await prismaClient.client.delete({
			where: {
				id: id,
			},
		});
		response.status(204).send();
	}
}

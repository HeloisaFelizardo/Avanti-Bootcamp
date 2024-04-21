import { prismaClient } from '../database/PrismaClient.js';

export class OrderController {
	async createOrder(request, response) {
		const { description, price, client_id } = request.body;
		const client = await prismaClient.order.create({
			data: {
				description,
				price,
				client_id,
			},
		});
		response.status(201).json(client);
	}
}

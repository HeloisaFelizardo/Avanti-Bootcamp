import { Router } from 'express';

import { ClientController } from '../controller/ClientController.js';
import { OrderController } from '../controller/OrderController.js';

const routes = Router();
const clientController = new ClientController();
const orderController = new OrderController();

//Rotas de Clientes
routes.get('/', clientController.findAllClients);
routes.get('/client/:id', clientController.findClientById);
routes.post('/client', clientController.createClient);
routes.put('/client/:id', clientController.updateClient);
routes.delete('/client/:id', clientController.deleteClient);

//Rotas de Orders
routes.post('/order', orderController.createOrder);

export { routes };

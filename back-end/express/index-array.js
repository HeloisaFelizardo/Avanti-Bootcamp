import express from 'express';

const app = express();

app.use(express.json());

const clientes = [
	{ id: 1, nome: 'Heloisa', idade: 25 },
	{ id: 2, nome: 'Jose', idade: 35 },
];

app.get('/clientes', (request, response) => {
	return response.status(200).json(clientes);
});

app.post('/cliente', (request, response) => {
	const { nome, idade } = request.body;
	const id = clientes.length + 1; // Gerando um novo ID
	clientes.push({ id, nome, idade });
	return response.status(201).json({ id, nome, idade });
});

app.put('/cliente/:id', (request, response) => {
	const { id } = request.params;
	const { nome, idade } = request.body;
	const cliente = clientes.find((cliente) => cliente.id == id);
	if (cliente) {
		cliente.nome = nome;
		cliente.idade = idade;
		return response.status(200).json(cliente);
	}
	return response.status(404).json({ error: 'Cliente não encontrado' });
});

app.delete('/cliente/:id', (request, response) => {
	const { id } = request.params;
	const index = clientes.findIndex((cliente) => cliente.id === parseInt(id));
	if (index !== -1) {
		clientes.splice(index, 1);
		return response.status(204).send();
	}
	return response.status(404).json({ error: 'Cliente não encontrado' });
});

app.listen(3000, () => {
	console.log('Running server');
});

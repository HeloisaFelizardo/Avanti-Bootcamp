import express from 'express';
import pkg from 'pg';

const app = express();

app.use(express.json());

const { Pool } = pkg;

const pool = new Pool({
	//usuario do banco de dados
	user: 'postgres',
	// host local
	host: 'localhost',
	// Nome do banco de dados
	database: 'avanti',
	//Senha do banco
	password: '12345',
	port: 5432,
});

app.get('/clientes', async (request, response) => {
	const { rows } = await pool.query('SELECT * FROM cliente');
	return response.status(200).json(rows);
});

app.post('/cliente', async (request, response) => {
	const { nome, cpf } = request.body;
	const cliente = await pool.query('INSERT INTO cliente (nome, cpf) VALUES ($1, $2)', [nome, cpf]);

	return response.status(201).json({ nome: nome, cpf: cpf });
});

app.put('/cliente/:id', async (request, response) => {
	const { id } = request.params;
	const { nome, cpf } = request.body;
	const cliente = await pool.query('UPDATE cliente SET nome = $1, cpf = $2 WHERE id = $3', [
		nome,
		cpf,
		id,
	]);
	if (cliente) {
		cliente.nome = nome;
		cliente.cpf = cpf;
		return response.status(200).json({ nome: nome, cpf: cpf });
	}
	return response.status(404).json({ error: 'Cliente não encontrado' });
});

app.delete('/cliente/:id', async (request, response) => {
	const { id } = request.params;
	const cliente = await pool.query('DELETE FROM cliente WHERE id = $1', [id]);
	if (cliente.rowCount === 0) {
		return response.status(404).json({ error: 'Cliente não encontrado' });
	}

	return response.status(204).send();
});

app.listen(3000, () => {
	console.log('Running server');
});

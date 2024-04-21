CREATE table IF NOT EXISTS cliente(
    id SERIAL PRIMARY key not null,
    nome VARCHAR(100),
    cpf CHAR(11)
);

select * from cliente;

insert into cliente (nome, cpf)
values
('João Nascimento', '85429712385' ),
('Marina Silva' , '35245628955'),
('Luis Fernandes' , '44465820144');

CREATE table IF NOT EXISTS certidao(
    id SERIAL PRIMARY key not null,
    cliente_id INTEGER, 
    data_emissao DATE,
    validade DATE,
    codigo_validacao uuid,
    FOREIGN KEY (cliente_id) REFERENCES cliente(id)
);

select * from certidao;

/*
 *A função set_validade() é chamada sempre que uma linha é inserida ou atualizada na tabela certidao. A função define o campo validade para ser 30 dias após a data_emissao.
 */
CREATE OR REPLACE FUNCTION set_validade()
RETURNS TRIGGER AS $$
BEGIN
  NEW.validade := NEW.data_emissao + INTERVAL '30 days';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validade_trigger
BEFORE INSERT OR UPDATE ON certidao
FOR EACH ROW EXECUTE PROCEDURE set_validade();
/*
 * Extensão que Gera uma versão 4 UUID, que é derivada inteiramente de números aleatórios. 
 */
SELECT * FROM pg_extension WHERE extname = 'uuid-ossp';
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

INSERT INTO certidao (cliente_id, data_emissao, codigo_validacao)
values
(1, '2024-03-11',  uuid_generate_v4()),
(1, '2024-01-14',  uuid_generate_v4()),
(2, '2023-11-27',  uuid_generate_v4()),
(3, '2024-04-05',  uuid_generate_v4());


CREATE table  IF NOT EXISTS  imovel(
    id SERIAL PRIMARY key not null,
    cliente_id INTEGER,
    endereco VARCHAR(100),
    contrato_ativo BOOLEAN,
    FOREIGN KEY (cliente_id) REFERENCES cliente(id)
);

select  * from imovel;

insert into imovel(cliente_id, endereco, contrato_ativo)
 values  
 (1, 'Rua Alpha', true),
 (2, 'Rua Omega', false),
 (3, 'Rua Beta', true),
 (1, 'Rua Ypsilon', true);


CREATE table  IF NOT EXISTS debito(
    id SERIAL PRIMARY key not null,
    cliente_id INTEGER,
    valor DECIMAL(10,2),
    data_vencimento DATE,
    FOREIGN KEY (cliente_id) REFERENCES cliente(id)
);

select * from debito;

insert into debito(cliente_id, valor, data_vencimento)
 values 
 (1, 850, '2024-04-27'),
 (1, 1000,'2024-04-30'),
 (2, 799, '2024-04-29'),
 (3,1500, '2024-03-31');

//a. Obter todos os clientes:
select * from cliente;

//b. Selecionar todas certidões emitidas ( A certidão só poderá ser emitida se o cliente não tiver débito)
SELECT c.*
FROM certidao c 
JOIN debito d ON d.id = c.cliente_id 
WHERE d.data_vencimento > CURRENT_DATE;

//c.  Obter os débitos pendentes de um cliente específico:
select id, valor
FROM debito 
WHERE cliente_id = 1 AND data_vencimento < CURRENT_DATE;

//d. Obter os imóveis de um cliente com contratos ativos
select *
from imovel 
where contrato_ativo = true;

//e. Obter as certidões emitidas por um cliente em um intervalo de datas:
select * 
from certidao 
where validade > '2023-11-01' and validade < '2024-04-30';

//f. Obter o valor total dos débitos de um cliente
SELECT SUM(valor) 
FROM debito 
WHERE cliente_id = 1;

//g.  Obter as certidões emitidas com código de validação e data de validade:
select id, validade, codigo_validacao
from certidao;

//h. Obter os clientes que possuem débitos pendentes: 
SELECT  c.id, c.nome 
FROM cliente c 
JOIN debito d ON c.id = d.cliente_id 
WHERE d.data_vencimento < CURRENT_DATE;

//i. Obter a quantidade de certidões emitidas por mês:
SELECT EXTRACT(MONTH FROM data_emissao) AS month, 
       COUNT(*) AS quantity
FROM certidao 
GROUP BY month;






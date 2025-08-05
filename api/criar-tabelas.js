import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  try {
    // Cria a tabela de produtos
    await sql`CREATE TABLE IF NOT EXISTS produtos (
      id SERIAL PRIMARY KEY,
      nome VARCHAR(255) NOT NULL,
      descricao TEXT,
      preco DECIMAL(10, 2) NOT NULL,
      estoque INTEGER NOT NULL,
      imagem_url VARCHAR(255)
    );`;

    // Cria a tabela de clientes
    await sql`CREATE TABLE IF NOT EXISTS clientes (
      id SERIAL PRIMARY KEY,
      nome VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL
    );`;

    // Cria a tabela de pedidos
    await sql`CREATE TABLE IF NOT EXISTS pedidos (
      id SERIAL PRIMARY KEY,
      cliente_id INTEGER REFERENCES clientes(id),
      status VARCHAR(50) NOT NULL,
      data_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`;

    return res.status(200).json({ message: 'Tabelas criadas com sucesso!' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
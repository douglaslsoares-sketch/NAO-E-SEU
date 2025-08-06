import { Pool } from 'pg';

export default async function handler(req, res) {
  const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
  });

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS produtos (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        descricao TEXT,
        preco DECIMAL(10, 2) NOT NULL,
        estoque INTEGER NOT NULL,
        imagem_url VARCHAR(255)
      );
    `);
    // Adicione aqui os comandos para as outras tabelas (clientes, pedidos)
    return res.status(200).json({ message: 'Tabelas criadas com sucesso!' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  } finally {
    await pool.end();
  }
}
const { Pool } = require('pg');

exports.handler = async (event, context) => {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  const { httpMethod, body, queryStringParameters } = event;
  const sessionId = event.headers['client-id'] || 'guest';

  try {
    switch (httpMethod) {
      case 'GET':
        const { rows } = await pool.query(
          'SELECT p.id, p.nome, p.preco, c.quantidade FROM carrinho c JOIN produtos p ON c.produto_id = p.id WHERE c.session_id = $1',
          [sessionId]
        );
        return { statusCode: 200, body: JSON.stringify(rows) };

      case 'POST':
        const { produto_id, quantidade } = JSON.parse(body);
        await pool.query(
          'INSERT INTO carrinho (produto_id, quantidade, session_id) VALUES ($1, $2, $3)',
          [produto_id, quantidade || 1, sessionId]
        );
        return { statusCode: 201, body: 'Item adicionado' };

      case 'DELETE':
        await pool.query('DELETE FROM carrinho WHERE id = $1 AND session_id = $2', [
          queryStringParameters.id,
          sessionId
        ]);
        return { statusCode: 200, body: 'Item removido' };

      default:
        return { statusCode: 405, body: 'Método não permitido' };
    }
  } catch (err) {
    return { statusCode: 500, body: err.toString() };
  } finally {
    await pool.end();
  }
};
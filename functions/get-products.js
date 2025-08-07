const { Client } = require('pg');

exports.handler = async (event) => {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });

    try {
        await client.connect();
        const result = await client.query('SELECT * FROM produtos');
        const produtos = result.rows;

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(produtos)
        };
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Erro ao buscar produtos.' })
        };
    } finally {
        await client.end();
    }
};
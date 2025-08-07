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
        console.log('Conexão bem-sucedida!');
        return {
            statusCode: 200,
            body: JSON.stringify({ status: 'ok', message: 'Conexão com o banco de dados Neon bem-sucedida!' })
        };
    } catch (error) {
        console.error('Erro na conexão:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ status: 'error', message: 'Falha na conexão com o banco de dados.' })
        };
    } finally {
        await client.end();
    }
};
const { Pool } = require('pg');
require('dotenv').config();

let pool;

const getPool = () => {
    if (!pool) {
        pool = new Pool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT || 5432,
            ssl: {
                rejectUnauthorized: false
            },
            connectionTimeoutMillis: 30000,  // ← AJOUTER (30 secondes)
            idleTimeoutMillis: 30000,        // ← AJOUTER
            max: 10
        });
        console.log('Pool PostgreSQL créé');
    }
    return pool;
};

module.exports = getPool;
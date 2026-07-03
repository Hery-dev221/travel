const { Pool } = require('pg');
require('dotenv').config();

let pool;

const getPool = () => {
    if (!pool) {
        pool = new Pool({
            host: process.env.DB_HOST || 'db.xxxxx.supabase.co',
            user: process.env.DB_USER || 'postgres',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'postgres',
            port: process.env.DB_PORT || 5432,
            ssl: {
                rejectUnauthorized: false
            }
        });
        console.log('Pool PostgreSQL créé');
    }
    return pool;
};

module.exports = getPool;
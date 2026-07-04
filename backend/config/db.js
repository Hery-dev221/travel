const { Pool } = require('pg');
require('dotenv').config();

let pool;

const getPool = () => {
    if (!pool) {
        pool = new Pool({
            host: process.env.DB_HOST || 'aws-0-eu-central-1.pooler.supabase.com',
            user: process.env.DB_USER || 'postgres.agitpyomcnxzfjtxfmzf',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'postgres',
            port: process.env.DB_PORT || 5432,
            ssl: {
                rejectUnauthorized: false
            },
            connectionTimeoutMillis: 30000,
            idleTimeoutMillis: 30000,
            max: 10
        });
        console.log('✅ Pool PostgreSQL créé (Session pooler)');
    }
    return pool;
};

module.exports = getPool;
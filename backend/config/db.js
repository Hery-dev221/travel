const mysql = require('mysql2/promise');
require('dotenv').config();

let pool;

const getPool = () => {
    if (!pool) {
        const config = {
            host: process.env.DB_HOST || 'sql.freedb.tech',
            user: process.env.DB_USER || 'u_ZUbF1u',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'freedb_fE5t6JPI',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
            authSwitchHandler: (data, cb) => {
                if (data.pluginName === 'sha256_password') {
                    cb(null, Buffer.from(''));
                } else {
                    cb(null, data);
                }
            },
            ssl: {
                rejectUnauthorized: false
            }
        };

        pool = mysql.createPool(config);
        console.log('✅ Pool MySQL créé');
    }
    return pool;
};

module.exports = getPool;
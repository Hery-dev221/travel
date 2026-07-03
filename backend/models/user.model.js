const getPool = require('../config/db');
const { hashPassword } = require('../utils/hashPassword');

const createUser = async (nom, email, telephone, password) => {
    const pool = getPool();
    const hashedPassword = await hashPassword(password);
    const result = await pool.query(
        'INSERT INTO users (nom, email, telephone, password, role, statut) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
        [nom, email, telephone, hashedPassword, 'client', 'en_attente']
    );
    return result.rows[0].id;
};

const findUserByEmail = async (email) => {
    const pool = getPool();
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
};

const findUserById = async (id) => {
    const pool = getPool();
    const result = await pool.query(
        'SELECT id, nom, email, telephone, role, statut, date_inscription FROM users WHERE id = $1',
        [id]
    );
    return result.rows[0];
};

const getAllUsers = async () => {
    const pool = getPool();
    const result = await pool.query(
        'SELECT id, nom, email, telephone, role, statut, date_inscription FROM users ORDER BY date_inscription DESC'
    );
    return result.rows;
};

const getUsersEnAttente = async () => {
    const pool = getPool();
    const result = await pool.query(
        'SELECT id, nom, email, telephone, role, statut, date_inscription FROM users WHERE statut = $1 ORDER BY date_inscription DESC',
        ['en_attente']
    );
    return result.rows;
};

const activerUser = async (id) => {
    const pool = getPool();
    const result = await pool.query(
        'UPDATE users SET statut = $1 WHERE id = $2',
        ['actif', id]
    );
    return result.rowCount;
};

const rejeterUser = async (id) => {
    const pool = getPool();
    const result = await pool.query(
        'UPDATE users SET statut = $1 WHERE id = $2',
        ['rejete', id]
    );
    return result.rowCount;
};

const deleteUserById = async (id) => {
    const pool = getPool();
    const userResult = await pool.query('SELECT role FROM users WHERE id = $1', [id]);
    if (userResult.rows[0]?.role === 'admin') {
        return 0;
    }
    const result = await pool.query('DELETE FROM users WHERE id = $1', [id]);
    return result.rowCount;
};

module.exports = { 
    createUser, 
    findUserByEmail, 
    findUserById, 
    getAllUsers,
    getUsersEnAttente,
    activerUser,
    rejeterUser,
    deleteUserById 
};
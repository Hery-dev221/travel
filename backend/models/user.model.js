const pool = require('../config/db');
const { hashPassword } = require('../utils/hashPassword');

const createUser = async (nom, email, telephone, password) => {
    const hashedPassword = await hashPassword(password);
    const [result] = await pool.query(
        'INSERT INTO users (nom, email, telephone, password, role, statut) VALUES (?, ?, ?, ?, "client", "en_attente")',
        [nom, email, telephone, hashedPassword]
    );
    return result.insertId;
};

const findUserByEmail = async (email) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
};

const findUserById = async (id) => {
    const [rows] = await pool.query('SELECT id, nom, email, telephone, role, statut, date_inscription FROM users WHERE id = ?', [id]);
    return rows[0];
};

const getAllUsers = async () => {
    const [rows] = await pool.query('SELECT id, nom, email, telephone, role, statut, date_inscription FROM users ORDER BY date_inscription DESC');
    return rows;
};

const getUsersEnAttente = async () => {
    const [rows] = await pool.query(
        'SELECT id, nom, email, telephone, role, statut, date_inscription FROM users WHERE statut = "en_attente" ORDER BY date_inscription DESC'
    );
    return rows;
};

const activerUser = async (id) => {
    const [result] = await pool.query(
        'UPDATE users SET statut = "actif" WHERE id = ?',
        [id]
    );
    return result.affectedRows;
};

const rejeterUser = async (id) => {
    const [result] = await pool.query(
        'UPDATE users SET statut = "rejete" WHERE id = ?',
        [id]
    );
    return result.affectedRows;
};
const deleteUserById = async (id) => {
    const [user] = await pool.query('SELECT role FROM users WHERE id = ?', [id]);
    if (user[0]?.role === 'admin') {
        return 0;
    }
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
    return result.affectedRows;
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
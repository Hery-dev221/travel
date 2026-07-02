const pool = require('../config/db');

const createAvis = async (user_id, note, commentaire) => {
    const [result] = await pool.query(
        'INSERT INTO avis (user_id, note, commentaire, statu) VALUES (?, ?, ?, "en_attente")',
        [user_id, note, commentaire]
    );
    return result.insertId;
};

const getAvisEnAttente = async () => {
    const [rows] = await pool.query(
        `SELECT a.*, u.nom as client_nom, u.email 
         FROM avis a 
         JOIN users u ON a.user_id = u.id 
         WHERE a.statu = 'en_attente' 
         ORDER BY a.date_creation DESC`
    );
    return rows;
};

const getAvisPublies = async () => {
    const [rows] = await pool.query(
        `SELECT a.*, u.nom as client_nom 
         FROM avis a 
         JOIN users u ON a.user_id = u.id 
         WHERE a.statu = 'publie' 
         ORDER BY a.date_publication DESC 
         LIMIT 10`
    );
    return rows;
};

const getAvisRejetes = async () => {
    const [rows] = await pool.query(
        `SELECT a.*, u.nom as client_nom, u.email 
         FROM avis a 
         JOIN users u ON a.user_id = u.id 
         WHERE a.statu = 'rejete' 
         ORDER BY a.date_creation DESC`
    );
    return rows;
};

const publierAvis = async (id) => {
    const [result] = await pool.query(
        'UPDATE avis SET statu = "publie", date_publication = NOW() WHERE id = ?',
        [id]
    );
    return result.affectedRows;
};

const rejeterAvis = async (id) => {
    const [result] = await pool.query('UPDATE avis SET statu = "rejete" WHERE id = ?', [id]);
    return result.affectedRows;
};

module.exports = { 
    createAvis, 
    getAvisEnAttente, 
    getAvisPublies, 
    getAvisRejetes,
    publierAvis, 
    rejeterAvis 
};
const getPool = require('../config/db');

const createAvis = async (user_id, note, commentaire) => {
    const pool = getPool();
    const result = await pool.query(
        'INSERT INTO avis (user_id, note, commentaire, statu) VALUES ($1, $2, $3, $4) RETURNING id',
        [user_id, note, commentaire, 'en_attente']
    );
    return result.rows[0].id;
};

const getAvisEnAttente = async () => {
    const pool = getPool();
    const result = await pool.query(
        `SELECT a.*, u.nom as client_nom, u.email 
         FROM avis a 
         JOIN users u ON a.user_id = u.id 
         WHERE a.statu = $1 
         ORDER BY a.date_creation DESC`,
        ['en_attente']
    );
    return result.rows;
};

const getAvisPublies = async () => {
    const pool = getPool();
    const result = await pool.query(
        `SELECT a.*, u.nom as client_nom 
         FROM avis a 
         JOIN users u ON a.user_id = u.id 
         WHERE a.statu = $1 
         ORDER BY a.date_publication DESC 
         LIMIT 10`,
        ['publie']
    );
    return result.rows;
};

const getAvisRejetes = async () => {
    const pool = getPool();
    const result = await pool.query(
        `SELECT a.*, u.nom as client_nom, u.email 
         FROM avis a 
         JOIN users u ON a.user_id = u.id 
         WHERE a.statu = $1 
         ORDER BY a.date_creation DESC`,
        ['rejete']
    );
    return result.rows;
};

const publierAvis = async (id) => {
    const pool = getPool();
    const result = await pool.query(
        'UPDATE avis SET statu = $1, date_publication = NOW() WHERE id = $2',
        ['publie', id]
    );
    return result.rowCount;
};

const rejeterAvis = async (id) => {
    const pool = getPool();
    const result = await pool.query('UPDATE avis SET statu = $1 WHERE id = $2', ['rejete', id]);
    return result.rowCount;
};

module.exports = { 
    createAvis, 
    getAvisEnAttente, 
    getAvisPublies, 
    getAvisRejetes,
    publierAvis, 
    rejeterAvis 
};
const pool = require('../config/db');

const getAllTrajets = async () => {
    const [rows] = await pool.query(`
        SELECT t.*, 
               v.marque_modele AS vehicule_marque, 
               v.photo_voiture AS vehicule_photo, 
               v.places AS vehicule_places,
               v.immatriculations AS vehicule_immatriculation
        FROM trajets t 
        LEFT JOIN vehicules v ON t.vehicule_id = v.id 
        ORDER BY t.date_depart DESC
    `);
    return rows;
};

const getTrajetsAVenir = async () => {
    const [rows] = await pool.query(`
        SELECT t.*, 
               v.marque_modele AS vehicule_marque, 
               v.photo_voiture AS vehicule_photo, 
               v.places AS vehicule_places,
               v.immatriculations AS vehicule_immatriculation
        FROM trajets t 
        LEFT JOIN vehicules v ON t.vehicule_id = v.id 
        WHERE t.date_depart >= CURDATE() AND t.statut = 'actif'
        ORDER BY t.date_depart ASC, t.heure_depart ASC
        LIMIT 10
    `);
    return rows;
};

const getTrajetsDans2Jours = async () => {
    const [rows] = await pool.query(`
        SELECT t.*, 
               v.marque_modele AS vehicule_marque, 
               v.photo_voiture AS vehicule_photo, 
               v.places AS vehicule_places,
               v.immatriculations AS vehicule_immatriculation
        FROM trajets t 
        LEFT JOIN vehicules v ON t.vehicule_id = v.id 
        WHERE t.date_depart BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 2 DAY) 
        AND t.statut = 'actif'
        ORDER BY t.date_depart ASC, t.heure_depart ASC
    `);
    return rows;
};

const getTrajetsPasses = async () => {
    const [rows] = await pool.query(`
        SELECT t.*, 
               v.marque_modele AS vehicule_marque, 
               v.photo_voiture AS vehicule_photo, 
               v.places AS vehicule_places,
               v.immatriculations AS vehicule_immatriculation
        FROM trajets t 
        LEFT JOIN vehicules v ON t.vehicule_id = v.id 
        WHERE t.date_depart < CURDATE()
        ORDER BY t.date_depart DESC
        LIMIT 20
    `);
    return rows;
};

const getTrajetById = async (id) => {
    const [rows] = await pool.query(`
        SELECT t.*, 
               v.marque_modele AS vehicule_marque, 
               v.photo_voiture AS vehicule_photo, 
               v.places AS vehicule_places,
               v.immatriculations AS vehicule_immatriculation
        FROM trajets t 
        LEFT JOIN vehicules v ON t.vehicule_id = v.id 
        WHERE t.id = ?
    `, [id]);
    return rows[0];
};

const createTrajet = async (depart, destination, date_depart, heure_depart, frais, places_disponibles, vehicule_id, statut = 'actif') => {
    const [result] = await pool.query(
        `INSERT INTO trajets (depart, destination, date_depart, heure_depart, frais, places_disponibles, vehicule_id, statut) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [depart, destination, date_depart, heure_depart, frais, places_disponibles, vehicule_id, statut]
    );
    return result.insertId;
};

const updateTrajet = async (id, depart, destination, date_depart, heure_depart, frais, places_disponibles, vehicule_id, statut) => {
    const [result] = await pool.query(
        `UPDATE trajets 
         SET depart = ?, destination = ?, date_depart = ?, heure_depart = ?, 
             frais = ?, places_disponibles = ?, vehicule_id = ?, statut = ? 
         WHERE id = ?`,
        [depart, destination, date_depart, heure_depart, frais, places_disponibles, vehicule_id, statut, id]
    );
    return result.affectedRows;
};

const deleteTrajet = async (id) => {
    const [result] = await pool.query('DELETE FROM trajets WHERE id = ?', [id]);
    return result.affectedRows;
};

const updatePlacesDisponibles = async (id, nombre) => {
    const [result] = await pool.query('UPDATE trajets SET places_disponibles = places_disponibles - ? WHERE id = ?', [nombre, id]);
    return result.affectedRows;
};

module.exports = {
    getAllTrajets,
    getTrajetsAVenir,
    getTrajetsDans2Jours,
    getTrajetsPasses,
    getTrajetById,
    createTrajet,
    updateTrajet,
    deleteTrajet,
    updatePlacesDisponibles
};
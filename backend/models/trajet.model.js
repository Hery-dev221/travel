const getPool = require('../config/db');

const getAllTrajets = async () => {
    const pool = getPool();
    const result = await pool.query(`
        SELECT t.*, 
               v.marque_modele AS vehicule_marque, 
               v.photo_voiture AS vehicule_photo, 
               v.places AS vehicule_places,
               v.immatriculations AS vehicule_immatriculation
        FROM trajets t 
        LEFT JOIN vehicules v ON t.vehicule_id = v.id 
        ORDER BY t.date_depart DESC
    `);
    return result.rows;
};

const getTrajetsAVenir = async () => {
    const pool = getPool();
    const result = await pool.query(`
        SELECT t.*, 
               v.marque_modele AS vehicule_marque, 
               v.photo_voiture AS vehicule_photo, 
               v.places AS vehicule_places,
               v.immatriculations AS vehicule_immatriculation
        FROM trajets t 
        LEFT JOIN vehicules v ON t.vehicule_id = v.id 
        WHERE t.date_depart >= CURRENT_DATE AND t.statut = 'actif'
        ORDER BY t.date_depart ASC, t.heure_depart ASC
        LIMIT 10
    `);
    return result.rows;
};

const getTrajetsDans2Jours = async () => {
    const pool = getPool();
    const result = await pool.query(`
        SELECT t.*, 
               v.marque_modele AS vehicule_marque, 
               v.photo_voiture AS vehicule_photo, 
               v.places AS vehicule_places,
               v.immatriculations AS vehicule_immatriculation
        FROM trajets t 
        LEFT JOIN vehicules v ON t.vehicule_id = v.id 
        WHERE t.date_depart BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '2 days'
        AND t.statut = 'actif'
        ORDER BY t.date_depart ASC, t.heure_depart ASC
    `);
    return result.rows;
};

const getTrajetsPasses = async () => {
    const pool = getPool();
    const result = await pool.query(`
        SELECT t.*, 
               v.marque_modele AS vehicule_marque, 
               v.photo_voiture AS vehicule_photo, 
               v.places AS vehicule_places,
               v.immatriculations AS vehicule_immatriculation
        FROM trajets t 
        LEFT JOIN vehicules v ON t.vehicule_id = v.id 
        WHERE t.date_depart < CURRENT_DATE
        ORDER BY t.date_depart DESC
        LIMIT 20
    `);
    return result.rows;
};

const getTrajetById = async (id) => {
    const pool = getPool();
    const result = await pool.query(`
        SELECT t.*, 
               v.marque_modele AS vehicule_marque, 
               v.photo_voiture AS vehicule_photo, 
               v.places AS vehicule_places,
               v.immatriculations AS vehicule_immatriculation
        FROM trajets t 
        LEFT JOIN vehicules v ON t.vehicule_id = v.id 
        WHERE t.id = $1
    `, [id]);
    return result.rows[0];
};

const createTrajet = async (depart, destination, date_depart, heure_depart, frais, places_disponibles, vehicule_id, statut = 'actif') => {
    const pool = getPool();
    const result = await pool.query(
        `INSERT INTO trajets (depart, destination, date_depart, heure_depart, frais, places_disponibles, vehicule_id, statut) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
        [depart, destination, date_depart, heure_depart, frais, places_disponibles, vehicule_id, statut]
    );
    return result.rows[0].id;
};

const updateTrajet = async (id, depart, destination, date_depart, heure_depart, frais, places_disponibles, vehicule_id, statut) => {
    const pool = getPool();
    const result = await pool.query(
        `UPDATE trajets 
         SET depart = $1, destination = $2, date_depart = $3, heure_depart = $4, 
             frais = $5, places_disponibles = $6, vehicule_id = $7, statut = $8 
         WHERE id = $9`,
        [depart, destination, date_depart, heure_depart, frais, places_disponibles, vehicule_id, statut, id]
    );
    return result.rowCount;
};

const deleteTrajet = async (id) => {
    const pool = getPool();
    const result = await pool.query('DELETE FROM trajets WHERE id = $1', [id]);
    return result.rowCount;
};

const updatePlacesDisponibles = async (id, nombre) => {
    const pool = getPool();
    const result = await pool.query(
        'UPDATE trajets SET places_disponibles = places_disponibles - $1 WHERE id = $2',
        [nombre, id]
    );
    return result.rowCount;
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
const getPool = require('../config/db');
const fs = require('fs');
const path = require('path');

const getAllVehicules = async () => {
    const pool = getPool();
    const result = await pool.query('SELECT * FROM vehicules ORDER BY marque_modele');
    return result.rows;
};

const getVehiculeById = async (id) => {
    const pool = getPool();
    const result = await pool.query('SELECT * FROM vehicules WHERE id = $1', [id]);
    return result.rows[0];
};

const createVehicule = async (marque_modele, immatriculations, places, chauffeur, etat, photo_voiture, description) => {
    const pool = getPool();
    const result = await pool.query(
        `INSERT INTO vehicules (marque_modele, immatriculations, places, chauffeur, etat, photo_voiture, description) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
        [marque_modele, immatriculations, places, chauffeur || null, etat || 'disponible', photo_voiture || null, description || null]
    );
    return result.rows[0].id;
};

const updateVehicule = async (id, marque_modele, immatriculations, places, chauffeur, etat, photo_voiture, description) => {
    const pool = getPool();
    let query = 'UPDATE vehicules SET marque_modele = $1, immatriculations = $2, places = $3, chauffeur = $4, etat = $5';
    const params = [marque_modele, immatriculations, places, chauffeur, etat];
    let paramIndex = 6;
    
    if (photo_voiture !== undefined && photo_voiture !== null) {
        query += `, photo_voiture = $${paramIndex}`;
        params.push(photo_voiture);
        paramIndex++;
    }
    
    if (description !== undefined) {
        query += `, description = $${paramIndex}`;
        params.push(description);
        paramIndex++;
    }
    
    query += ` WHERE id = $${paramIndex}`;
    params.push(id);
    
    const result = await pool.query(query, params);
    return result.rowCount;
};

const deleteVehicule = async (id) => {
    const pool = getPool();
    const photoResult = await pool.query('SELECT photo_voiture FROM vehicules WHERE id = $1', [id]);
    
    if (photoResult.rows[0] && photoResult.rows[0].photo_voiture) {
        try {
            const photoPath = path.join(__dirname, '../../public', photoResult.rows[0].photo_voiture);
            if (fs.existsSync(photoPath)) {
                fs.unlinkSync(photoPath);
                console.log('Photo supprimée:', photoPath);
            }
        } catch (err) {
            console.error('Erreur suppression photo:', err);
        }
    }
    
    const trajetsResult = await pool.query('SELECT id FROM trajets WHERE vehicule_id = $1', [id]);
    
    for (const trajet of trajetsResult.rows) {
        await pool.query('DELETE FROM reservations WHERE trajet_id = $1', [trajet.id]);
        console.log('Réservations supprimées pour le trajet ID:', trajet.id);
    }
    
    await pool.query('DELETE FROM trajets WHERE vehicule_id = $1', [id]);
    console.log('Trajets supprimés pour le véhicule ID:', id);

    const result = await pool.query('DELETE FROM vehicules WHERE id = $1', [id]);
    return result.rowCount;
};

module.exports = {
    getAllVehicules,
    getVehiculeById,
    createVehicule,
    updateVehicule,
    deleteVehicule
};
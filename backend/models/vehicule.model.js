const pool = require('../config/db');
const fs = require('fs');
const path = require('path');

const getAllVehicules = async () => {
    const [rows] = await pool.query('SELECT * FROM vehicules ORDER BY marque_modele');
    return rows;
};

const getVehiculeById = async (id) => {
    const [rows] = await pool.query('SELECT * FROM vehicules WHERE id = ?', [id]);
    return rows[0];
};

const createVehicule = async (marque_modele, immatriculations, places, chauffeur, etat, photo_voiture, description) => {
    const [result] = await pool.query(
        `INSERT INTO vehicules (marque_modele, immatriculations, places, chauffeur, etat, photo_voiture, description) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [marque_modele, immatriculations, places, chauffeur || null, etat || 'disponible', photo_voiture || null, description || null]
    );
    return result.insertId;
};

const updateVehicule = async (id, marque_modele, immatriculations, places, chauffeur, etat, photo_voiture, description) => {
    let query = 'UPDATE vehicules SET marque_modele = ?, immatriculations = ?, places = ?, chauffeur = ?, etat = ?';
    const params = [marque_modele, immatriculations, places, chauffeur, etat];
    
    if (photo_voiture !== undefined && photo_voiture !== null) {
        query += ', photo_voiture = ?';
        params.push(photo_voiture);
    }
    
    if (description !== undefined) {
        query += ', description = ?';
        params.push(description);
    }
    
    query += ' WHERE id = ?';
    params.push(id);
    
    const [result] = await pool.query(query, params);
    return result.affectedRows;
};

const deleteVehicule = async (id) => {
    const [rows] = await pool.query('SELECT photo_voiture FROM vehicules WHERE id = ?', [id]);
    
    if (rows[0] && rows[0].photo_voiture) {
        try {
            const photoPath = path.join(__dirname, '../../public', rows[0].photo_voiture);
            if (fs.existsSync(photoPath)) {
                fs.unlinkSync(photoPath);
                console.log('Photo supprimée:', photoPath);
            }
        } catch (err) {
            console.error('Erreur suppression photo:', err);
        }
    }
    
    const [trajets] = await pool.query('SELECT id FROM trajets WHERE vehicule_id = ?', [id]);
    
    for (const trajet of trajets) {
        await pool.query('DELETE FROM reservations WHERE trajet_id = ?', [trajet.id]);
        console.log('Réservations supprimées pour le trajet ID:', trajet.id);
    }
    
    await pool.query('DELETE FROM trajets WHERE vehicule_id = ?', [id]);
    console.log('Trajets supprimés pour le véhicule ID:', id);

    const [result] = await pool.query('DELETE FROM vehicules WHERE id = ?', [id]);
    return result.affectedRows;
};

module.exports = {
    getAllVehicules,
    getVehiculeById,
    createVehicule,
    updateVehicule,
    deleteVehicule
};
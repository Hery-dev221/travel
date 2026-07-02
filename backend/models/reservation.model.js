const pool = require('../config/db');

const generateNumeroReservation = () => {
    const date = new Date();
    const annee = date.getFullYear();
    const mois = String(date.getMonth() + 1).padStart(2, '0');
    const jour = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000);
    return `TR-${annee}${mois}${jour}-${random}`;
};

const createReservation = async (user_id, trajet_id, nombre_passagers, sieges, frais_total, operateur, nom_payeur, telephone_payeur, reference_paiement, preuve_paiement) => {
    const numreo_reservation = generateNumeroReservation();
    const [result] = await pool.query(
        'INSERT INTO reservations (numreo_reservation, user_id, trajet_id, nombre_passagers, sieges, frais_total, operateur, nom_payeur, telephone_payeur, references_paiement, preuve_paiement, statut_reservation) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, "en_attente")',
        [numreo_reservation, user_id, trajet_id, nombre_passagers, sieges, frais_total, operateur, nom_payeur, telephone_payeur, reference_paiement, preuve_paiement]
    );
    return { id: result.insertId, numreo_reservation };
};

const getReservationsByUser = async (user_id) => {
    const [rows] = await pool.query(
        `SELECT r.*, 
                t.depart, 
                t.destination, 
                t.date_depart, 
                t.heure_depart, 
                t.frais,
                t.vehicule_id,
                v.marque_modele AS vehicule_marque,
                v.photo_voiture AS vehicule_photo
         FROM reservations r 
         JOIN trajets t ON r.trajet_id = t.id 
         LEFT JOIN vehicules v ON t.vehicule_id = v.id
         WHERE r.user_id = ? 
         ORDER BY t.date_depart DESC`,
        [user_id]
    );
    return rows;
};

const getAllReservations = async () => {
    const [rows] = await pool.query(
        `SELECT r.*, 
                u.nom as client_nom, 
                u.email, 
                t.depart, 
                t.destination, 
                t.date_depart,
                t.heure_depart,
                t.vehicule_id,
                v.marque_modele AS vehicule_marque,
                v.photo_voiture AS vehicule_photo
         FROM reservations r 
         JOIN users u ON r.user_id = u.id 
         JOIN trajets t ON r.trajet_id = t.id 
         LEFT JOIN vehicules v ON t.vehicule_id = v.id
         ORDER BY r.date_reservation DESC`
    );
    return rows;
};

const getReservationById = async (id) => {
    const [rows] = await pool.query(
        `SELECT r.*, 
                u.nom as client_nom, 
                u.email, 
                t.depart, 
                t.destination, 
                t.date_depart, 
                t.heure_depart, 
                t.frais,
                t.vehicule_id,
                v.marque_modele AS vehicule_marque,
                v.photo_voiture AS vehicule_photo
         FROM reservations r 
         JOIN users u ON r.user_id = u.id 
         JOIN trajets t ON r.trajet_id = t.id 
         LEFT JOIN vehicules v ON t.vehicule_id = v.id
         WHERE r.id = ?`,
        [id]
    );
    return rows[0];
};

const updateReservationStatus = async (id, statut) => {
    const [result] = await pool.query('UPDATE reservations SET statut_reservation = ? WHERE id = ?', [statut, id]);
    return result.affectedRows;
};

const annulerReservation = async (id) => {
    const [result] = await pool.query('UPDATE reservations SET statut_reservation = "annulee" WHERE id = ?', [id]);
    return result.affectedRows;
};

const getReservationsEnAttente = async () => {
    const [rows] = await pool.query(
        `SELECT r.*, 
                u.nom as client_nom, 
                u.email,
                t.depart, 
                t.destination, 
                t.date_depart,
                t.heure_depart,
                t.vehicule_id,
                v.marque_modele AS vehicule_marque,
                v.photo_voiture AS vehicule_photo
         FROM reservations r 
         JOIN users u ON r.user_id = u.id 
         JOIN trajets t ON r.trajet_id = t.id 
         LEFT JOIN vehicules v ON t.vehicule_id = v.id
         WHERE r.statut_reservation = 'en_attente' AND t.date_depart > CURDATE() 
         ORDER BY t.date_depart ASC`
    );
    return rows;
};

const getOccupiedSeatsByTrajet = async (trajet_id) => {
    const [rows] = await pool.query(
        `SELECT sieges FROM reservations WHERE trajet_id = ? AND statut_reservation IN ('en_attente', 'confirmee')`,
        [trajet_id]
    );
    
    let occupiedSeats = [];
    rows.forEach(row => {
        if (row.sieges) {
            const seats = row.sieges.split(',');
            seats.forEach(seat => {
                const trimmedSeat = seat.trim();
                if (trimmedSeat) {
                    occupiedSeats.push(trimmedSeat);
                }
            });
        }
    });
    return occupiedSeats;
};

module.exports = {
    createReservation,
    getReservationsByUser,
    getAllReservations,
    getReservationById,
    updateReservationStatus,
    annulerReservation,
    getReservationsEnAttente,
    getOccupiedSeatsByTrajet
};
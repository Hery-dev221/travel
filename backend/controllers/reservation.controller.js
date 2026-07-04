const {
    createReservation,
    getReservationsByUser,
    getAllReservations,
    getReservationById,
    updateReservationStatus,
    annulerReservation,
    getReservationsEnAttente,
    getOccupiedSeatsByTrajet
} = require('../models/reservation.model');
const { getTrajetById, updatePlacesDisponibles } = require('../models/trajet.model');
const supabase = require('../config/supabase');

const isVercel = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';

const reserver = async (req, res) => {
    try {
        const { 
            trajet_id, 
            nombre_passagers, 
            sieges, 
            frais_total, 
            operateur, 
            nom_payeur,
            telephone_payeur,
            reference_paiement
        } = req.body;
        const user_id = req.user.id;

        let preuve_paiement = null;
        if (req.file) {
            if (isVercel) {
                // Sur Vercel : upload vers Supabase Storage
                const file = req.file;
                const fileName = `preuves/${Date.now()}-${file.originalname}`;
                
                const { data, error } = await supabase.storage
                    .from('travel')
                    .upload(fileName, file.buffer, {
                        contentType: file.mimetype
                    });
                
                if (error) {
                    console.error('Erreur upload preuve:', error);
                    return res.status(500).json({ message: 'Erreur lors de l\'upload de la preuve' });
                }
                
                const { data: urlData } = supabase.storage
                    .from('travel')
                    .getPublicUrl(fileName);
                
                preuve_paiement = urlData.publicUrl;
            } else {
                // En local : sauvegarde sur disque
                preuve_paiement = `/uploads/preuves/${req.file.filename}`;
                console.log('Fichier uploadé:', preuve_paiement);
            }
        }

        const trajet = await getTrajetById(trajet_id);
        if (!trajet) {
            return res.status(404).json({ message: 'Trajet non trouvé' });
        }

        if (trajet.places_disponibles < nombre_passagers) {
            return res.status(400).json({ message: 'Places insuffisantes' });
        }

        const { id, numreo_reservation } = await createReservation(
            user_id, trajet_id, nombre_passagers, sieges, frais_total, 
            operateur, nom_payeur, telephone_payeur, reference_paiement, preuve_paiement
        );
        await updatePlacesDisponibles(trajet_id, nombre_passagers);

        res.status(201).json({
            message: 'Réservation effectuée avec succès',
            reservation: { id, numreo_reservation, trajet, nombre_passagers, frais_total }
        });
    } catch (error) {
        console.error('Erreur reserver:', error);
        res.status(500).json({ message: 'Erreur lors de la réservation: ' + error.message });
    }
};

const getMesReservations = async (req, res) => {
    try {
        const reservations = await getReservationsByUser(req.user.id);
        res.json(reservations);
    } catch (error) {
        console.error('Erreur getMesReservations:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des réservations' });
    }
};

const getAllReservationsAdmin = async (req, res) => {
    try {
        const reservations = await getAllReservations();
        res.json(reservations);
    } catch (error) {
        console.error('Erreur getAllReservationsAdmin:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des réservations' });
    }
};

const getReservationDetails = async (req, res) => {
    try {
        const reservation = await getReservationById(req.params.id);
        if (!reservation) {
            return res.status(404).json({ message: 'Réservation non trouvée' });
        }
        res.json(reservation);
    } catch (error) {
        console.error('Erreur getReservationDetails:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des détails' });
    }
};

const confirmerReservation = async (req, res) => {
    try {
        const affected = await updateReservationStatus(req.params.id, 'confirmee');
        if (affected === 0) {
            return res.status(404).json({ message: 'Réservation non trouvée' });
        }
        res.json({ message: 'Réservation confirmée avec succès' });
    } catch (error) {
        console.error('Erreur confirmerReservation:', error);
        res.status(500).json({ message: 'Erreur lors de la confirmation' });
    }
};

const annulerReservationController = async (req, res) => {
    try {
        const affected = await annulerReservation(req.params.id);
        if (affected === 0) {
            return res.status(404).json({ message: 'Réservation non trouvée' });
        }
        res.json({ message: 'Réservation annulée avec succès' });
    } catch (error) {
        console.error('Erreur annulerReservationController:', error);
        res.status(500).json({ message: 'Erreur lors de l\'annulation' });
    }
};

const getReservationsEnAttenteController = async (req, res) => {
    try {
        const reservations = await getReservationsEnAttente();
        res.json(reservations);
    } catch (error) {
        console.error('Erreur getReservationsEnAttenteController:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des réservations en attente' });
    }
};

const getOccupiedSeats = async (req, res) => {
    try {
        const trajet_id = req.params.trajet_id;
        const occupiedSeats = await getOccupiedSeatsByTrajet(trajet_id);
        res.json(occupiedSeats);
    } catch (error) {
        console.error('Erreur getOccupiedSeats:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des sièges occupés' });
    }
};

module.exports = {
    reserver,
    getMesReservations,
    getAllReservationsAdmin,
    getReservationDetails,
    confirmerReservation,
    annulerReservationController,
    getReservationsEnAttenteController,
    getOccupiedSeats
};
const express = require('express');
const router = express.Router();
const {
    reserver,
    getMesReservations,
    getAllReservationsAdmin,
    getReservationDetails,
    confirmerReservation,
    annulerReservationController,
    getReservationsEnAttenteController,
    getOccupiedSeats
} = require('../controllers/reservation.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');

// IMPORTANT : Importer uploadPreuve SEULEMENT quand nécessaire
const { uploadPreuve } = require('../middlewares/upload.middleware');

router.post('/', authMiddleware, uploadPreuve.single('preuve_paiement'), reserver);
router.get('/mes-reservations', authMiddleware, getMesReservations);
router.get('/admin/all', authMiddleware, adminMiddleware, getAllReservationsAdmin);
router.get('/admin/en-attente', authMiddleware, adminMiddleware, getReservationsEnAttenteController);
router.get('/trajet/:trajet_id/sieges', authMiddleware, getOccupiedSeats);
router.get('/:id', authMiddleware, getReservationDetails);
router.put('/:id/confirmer', authMiddleware, adminMiddleware, confirmerReservation);
router.put('/:id/annuler', authMiddleware, annulerReservationController);

module.exports = router;
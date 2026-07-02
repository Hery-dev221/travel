const express = require('express');
const router = express.Router();
const {
    getTrajets,
    getTrajetsAVenirController,
    getTrajetsDans2JoursController,
    getTrajetsPassesController,
    getTrajet,
    addTrajet,
    modifyTrajet,
    removeTrajet
} = require('../controllers/trajet.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');

router.get('/', getTrajets);
router.get('/a-venir', getTrajetsAVenirController);
router.get('/dans-2-jours', getTrajetsDans2JoursController);
router.get('/passes', getTrajetsPassesController);
router.get('/:id', getTrajet);

router.post('/', authMiddleware, adminMiddleware, addTrajet);
router.put('/:id', authMiddleware, adminMiddleware, modifyTrajet);
router.delete('/:id', authMiddleware, adminMiddleware, removeTrajet);

module.exports = router;
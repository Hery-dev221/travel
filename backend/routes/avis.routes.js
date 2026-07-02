const express = require('express');
const router = express.Router();
const {
    laisserAvis,
    getAvisEnAttenteController,
    getAvisPubliesController,
    getAvisRejetesController,
    publierAvisController,
    rejeterAvisController
} = require('../controllers/avis.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');

router.post('/', authMiddleware, laisserAvis);
router.get('/publies', getAvisPubliesController);
router.get('/admin/en-attente', authMiddleware, adminMiddleware, getAvisEnAttenteController);
router.get('/admin/rejetes', authMiddleware, adminMiddleware, getAvisRejetesController);
router.put('/admin/:id/publier', authMiddleware, adminMiddleware, publierAvisController);
router.put('/admin/:id/rejeter', authMiddleware, adminMiddleware, rejeterAvisController);

module.exports = router;
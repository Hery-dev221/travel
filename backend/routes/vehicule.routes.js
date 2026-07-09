const express = require('express');
const router = express.Router();
const {
    getVehicules,
    getVehicule,
    addVehicule,
    modifyVehicule,
    removeVehicule
} = require('../controllers/vehicule.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');
const { uploadVehicule } = require('../middlewares/upload.middleware');

router.get('/', getVehicules);
router.get('/:id', getVehicule);
router.post('/', authMiddleware, adminMiddleware, uploadVehicule.single('photo_voiture'), addVehicule);
router.put('/:id', authMiddleware, adminMiddleware, uploadVehicule.single('photo_voiture'), modifyVehicule);
router.delete('/:id', authMiddleware, adminMiddleware, removeVehicule);

module.exports = router;
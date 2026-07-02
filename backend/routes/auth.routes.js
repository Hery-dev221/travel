const express = require('express');
const router = express.Router();
const { 
    register, 
    login, 
    getProfile, 
    getAllUsers, 
    deleteUser,
    getComptesEnAttente,
    activerCompte,
    rejeterCompte
} = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');

// Routes publiques
router.post('/register', register);
router.post('/login', login);

// Routes protégées
router.get('/profile', authMiddleware, getProfile);

// Routes Admin
router.get('/users', authMiddleware, adminMiddleware, getAllUsers);
router.delete('/users/:id', authMiddleware, adminMiddleware, deleteUser);

// ===== NOUVELLES ROUTES : Gestion des comptes en attente =====
router.get('/users/en-attente', authMiddleware, adminMiddleware, getComptesEnAttente);
router.put('/users/:id/activer', authMiddleware, adminMiddleware, activerCompte);
router.put('/users/:id/rejeter', authMiddleware, adminMiddleware, rejeterCompte);

module.exports = router;
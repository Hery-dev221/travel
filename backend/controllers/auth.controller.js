const { findUserByEmail, createUser, findUserById, getAllUsers: getAllUsersModel, deleteUserById } = require('../models/user.model');
const { comparePassword } = require('../utils/hashPassword');
const generateToken = require('../utils/generateToken');

const register = async (req, res) => {
    try {
        const { nom, email, telephone, password } = req.body;

        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'Cet email est déjà utilisé' });
        }

        const userId = await createUser(nom, email, telephone, password);
        const user = await findUserById(userId);
        const token = generateToken(user.id, user.email, 'client');

        res.status(201).json({
            message: 'Inscription réussie ! Votre compte est en attente de validation par un administrateur.',
            token,
            user
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de l\'inscription' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }

        if (user.statut === 'en_attente') {
            return res.status(403).json({ 
                message: 'Votre compte est en attente de validation par un administrateur.',
                code: 'COMPTE_EN_ATTENTE'
            });
        }

        if (user.statut === 'rejete') {
            return res.status(403).json({ 
                message: 'Votre compte a été rejeté par un administrateur. Contactez le support.',
                code: 'COMPTE_REJETE'
            });
        }

        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }

        const token = generateToken(user.id, user.email, user.role);

        res.json({
            message: 'Connexion réussie',
            token,
            user: {
                id: user.id,
                nom: user.nom,
                email: user.email,
                role: user.role,
                statut: user.statut
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la connexion' });
    }
};

const getProfile = async (req, res) => {
    try {
        const user = await findUserById(req.user.id);
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération du profil' });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await getAllUsersModel();
        res.json(users);
    } catch (error) {
        console.error('Erreur getAllUsers:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs' });
    }
};

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        
        if (parseInt(userId) === req.user.id) {
            return res.status(403).json({ message: 'Vous ne pouvez pas supprimer votre propre compte' });
        }
        
        const affected = await deleteUserById(userId);
        if (affected === 0) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        res.json({ message: 'Utilisateur supprimé avec succès' });
    } catch (error) {
        console.error('Erreur deleteUser:', error);
        res.status(500).json({ message: 'Erreur lors de la suppression' });
    }
};

const getComptesEnAttente = async (req, res) => {
    try {
        const { getUsersEnAttente } = require('../models/user.model');
        const users = await getUsersEnAttente();
        res.json(users);
    } catch (error) {
        console.error('Erreur getComptesEnAttente:', error);
        res.status(500).json({ message: 'Erreur lors du chargement' });
    }
};

const activerCompte = async (req, res) => {
    try {
        const { activerUser } = require('../models/user.model');
        const { id } = req.params;
        const result = await activerUser(id);
        if (result === 0) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        res.json({ message: 'Compte activé avec succès' });
    } catch (error) {
        console.error('Erreur activerCompte:', error);
        res.status(500).json({ message: 'Erreur lors de l\'activation' });
    }
};

const rejeterCompte = async (req, res) => {
    try {
        const { rejeterUser } = require('../models/user.model');
        const { id } = req.params;
        const result = await rejeterUser(id);
        if (result === 0) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        res.json({ message: 'Compte rejeté' });
    } catch (error) {
        console.error('Erreur rejeterCompte:', error);
        res.status(500).json({ message: 'Erreur lors du rejet' });
    }
};

module.exports = { 
    register, 
    login, 
    getProfile, 
    getAllUsers, 
    deleteUser,
    getComptesEnAttente,
    activerCompte,
    rejeterCompte
};
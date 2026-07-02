const {
    createAvis,
    getAvisEnAttente,
    getAvisPublies,
    getAvisRejetes,
    publierAvis,
    rejeterAvis
} = require('../models/avis.model');

const laisserAvis = async (req, res) => {
    try {
        const { note, commentaire } = req.body;
        const user_id = req.user.id;

        if (!note || note < 1 || note > 5) {
            return res.status(400).json({ message: 'Note invalide (1-5)' });
        }
        if (!commentaire || commentaire.trim() === '') {
            return res.status(400).json({ message: 'Commentaire requis' });
        }

        const id = await createAvis(user_id, note, commentaire);
        res.status(201).json({ message: 'Avis envoyé avec succès, en attente de validation', id });
    } catch (error) {
        console.error('Erreur laisserAvis:', error);
        res.status(500).json({ message: 'Erreur lors de l\'envoi de l\'avis: ' + error.message });
    }
};

const getAvisEnAttenteController = async (req, res) => {
    try {
        const avis = await getAvisEnAttente();
        res.json(avis);
    } catch (error) {
        console.error('Erreur getAvisEnAttenteController:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des avis' });
    }
};

const getAvisPubliesController = async (req, res) => {
    try {
        const avis = await getAvisPublies();
        res.json(avis);
    } catch (error) {
        console.error('Erreur getAvisPubliesController:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des avis' });
    }
};

const getAvisRejetesController = async (req, res) => {
    try {
        const avis = await getAvisRejetes();
        res.json(avis);
    } catch (error) {
        console.error('Erreur getAvisRejetesController:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des avis' });
    }
};

const publierAvisController = async (req, res) => {
    try {
        const affected = await publierAvis(req.params.id);
        if (affected === 0) {
            return res.status(404).json({ message: 'Avis non trouvé' });
        }
        res.json({ message: 'Avis publié avec succès' });
    } catch (error) {
        console.error('Erreur publierAvisController:', error);
        res.status(500).json({ message: 'Erreur lors de la publication' });
    }
};

const rejeterAvisController = async (req, res) => {
    try {
        const affected = await rejeterAvis(req.params.id);
        if (affected === 0) {
            return res.status(404).json({ message: 'Avis non trouvé' });
        }
        res.json({ message: 'Avis rejeté avec succès' });
    } catch (error) {
        console.error('Erreur rejeterAvisController:', error);
        res.status(500).json({ message: 'Erreur lors du rejet' });
    }
};

module.exports = {
    laisserAvis,
    getAvisEnAttenteController,
    getAvisPubliesController,
    getAvisRejetesController,
    publierAvisController,
    rejeterAvisController
};
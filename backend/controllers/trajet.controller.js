const {
    getAllTrajets,
    getTrajetsAVenir,
    getTrajetsDans2Jours,
    getTrajetsPasses,
    getTrajetById,
    createTrajet,
    updateTrajet,
    deleteTrajet
} = require('../models/trajet.model');

const getTrajets = async (req, res) => {
    try {
        const trajets = await getAllTrajets();
        res.json(trajets);
    } catch (error) {
        console.error('Erreur getTrajets:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des trajets' });
    }
};

const getTrajetsAVenirController = async (req, res) => {
    try {
        const trajets = await getTrajetsAVenir();
        res.json(trajets);
    } catch (error) {
        console.error('Erreur getTrajetsAVenirController:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des trajets à venir' });
    }
};

const getTrajetsDans2JoursController = async (req, res) => {
    try {
        const trajets = await getTrajetsDans2Jours();
        res.json(trajets);
    } catch (error) {
        console.error('Erreur getTrajetsDans2JoursController:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des trajets' });
    }
};

const getTrajetsPassesController = async (req, res) => {
    try {
        const trajets = await getTrajetsPasses();
        res.json(trajets);
    } catch (error) {
        console.error('Erreur getTrajetsPassesController:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des trajets passés' });
    }
};

const getTrajet = async (req, res) => {
    try {
        const trajet = await getTrajetById(req.params.id);
        if (!trajet) {
            return res.status(404).json({ message: 'Trajet non trouvé' });
        }
        res.json(trajet);
    } catch (error) {
        console.error('Erreur getTrajet:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération du trajet' });
    }
};

const addTrajet = async (req, res) => {
    try {
        const { depart, destination, date_depart, heure_depart, frais, places_disponibles, vehicule_id, statut } = req.body;
        const id = await createTrajet(depart, destination, date_depart, heure_depart, frais, places_disponibles, vehicule_id, statut);
        res.status(201).json({ message: 'Trajet ajouté avec succès', id });
    } catch (error) {
        console.error('Erreur addTrajet:', error);
        res.status(500).json({ message: 'Erreur lors de l\'ajout du trajet' });
    }
};

const modifyTrajet = async (req, res) => {
    try {
        const { depart, destination, date_depart, heure_depart, frais, places_disponibles, vehicule_id, statut } = req.body;
        const affected = await updateTrajet(req.params.id, depart, destination, date_depart, heure_depart, frais, places_disponibles, vehicule_id, statut);
        if (affected === 0) {
            return res.status(404).json({ message: 'Trajet non trouvé' });
        }
        res.json({ message: 'Trajet modifié avec succès' });
    } catch (error) {
        console.error('Erreur modifyTrajet:', error);
        res.status(500).json({ message: 'Erreur lors de la modification du trajet' });
    }
};

const removeTrajet = async (req, res) => {
    try {
        const affected = await deleteTrajet(req.params.id);
        if (affected === 0) {
            return res.status(404).json({ message: 'Trajet non trouvé' });
        }
        res.json({ message: 'Trajet supprimé avec succès' });
    } catch (error) {
        console.error('Erreur removeTrajet:', error);
        res.status(500).json({ message: 'Erreur lors de la suppression du trajet' });
    }
};

module.exports = {
    getTrajets,
    getTrajetsAVenirController,
    getTrajetsDans2JoursController,
    getTrajetsPassesController,
    getTrajet,
    addTrajet,
    modifyTrajet,
    removeTrajet
};
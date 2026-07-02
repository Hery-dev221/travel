const {
    getAllVehicules,
    getVehiculeById,
    createVehicule,
    updateVehicule,
    deleteVehicule
} = require('../models/vehicule.model');
const path = require('path');
const fs = require('fs');

const getVehicules = async (req, res) => {
    try {
        const vehicules = await getAllVehicules();
        res.json(vehicules);
    } catch (error) {
        console.error('Erreur getVehicules:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des véhicules' });
    }
};

const getVehicule = async (req, res) => {
    try {
        const vehicule = await getVehiculeById(req.params.id);
        if (!vehicule) {
            return res.status(404).json({ message: 'Véhicule non trouvé' });
        }
        res.json(vehicule);
    } catch (error) {
        console.error('Erreur getVehicule:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération du véhicule' });
    }
};

const addVehicule = async (req, res) => {
    try {
        const { marque_modele, immatriculations, places, chauffeur, etat, description } = req.body;
        
        console.log('Données reçues pour ajout:', { marque_modele, immatriculations, places, chauffeur, etat, description });
        
        if (!marque_modele || !immatriculations || !places) {
            return res.status(400).json({ message: 'Champs manquants: marque_modele, immatriculations, places' });
        }
        
        let photo_voiture = null;
        
        // Gestion de l'upload de photo
        if (req.file) {
            photo_voiture = `/uploads/vehicules/${req.file.filename}`;
        }
        
        const id = await createVehicule(marque_modele, immatriculations, places, chauffeur, etat, photo_voiture, description);
        res.status(201).json({ message: 'Véhicule ajouté avec succès', id, photo_voiture });
    } catch (error) {
        console.error('Erreur addVehicule:', error);
        res.status(500).json({ message: 'Erreur lors de l\'ajout du véhicule: ' + error.message });
    }
};

const modifyVehicule = async (req, res) => {
    try {
        const { marque_modele, immatriculations, places, chauffeur, etat, description } = req.body;
        
        let photo_voiture = undefined;
        
        // Récupérer l'ancien véhicule pour gérer la photo
        const oldVehicule = await getVehiculeById(req.params.id);
        if (!oldVehicule) {
            return res.status(404).json({ message: 'Véhicule non trouvé' });
        }
        
        // Gestion de l'upload de nouvelle photo
        if (req.file) {
            // Supprimer l'ancienne photo si elle existe
            if (oldVehicule.photo_voiture) {
                try {
                    const oldPhotoPath = path.join(__dirname, '../../public', oldVehicule.photo_voiture);
                    if (fs.existsSync(oldPhotoPath)) {
                        fs.unlinkSync(oldPhotoPath);
                        console.log('Ancienne photo supprimée:', oldPhotoPath);
                    }
                } catch (err) {
                    console.error('Erreur suppression ancienne photo:', err);
                }
            }
            photo_voiture = `/uploads/vehicules/${req.file.filename}`;
        } else {
            // Conserver l'ancienne photo
            photo_voiture = oldVehicule.photo_voiture;
        }
        
        const affected = await updateVehicule(
            req.params.id, 
            marque_modele, 
            immatriculations, 
            places, 
            chauffeur, 
            etat, 
            photo_voiture, 
            description
        );
        
        if (affected === 0) {
            return res.status(404).json({ message: 'Véhicule non trouvé' });
        }
        res.json({ message: 'Véhicule modifié avec succès' });
    } catch (error) {
        console.error('Erreur modifyVehicule:', error);
        res.status(500).json({ message: 'Erreur lors de la modification du véhicule: ' + error.message });
    }
};

const removeVehicule = async (req, res) => {
    try {
        const affected = await deleteVehicule(req.params.id);
        if (affected === 0) {
            return res.status(404).json({ message: 'Véhicule non trouvé' });
        }
        res.json({ message: 'Véhicule supprimé avec succès' });
    } catch (error) {
        console.error('Erreur removeVehicule:', error);
        res.status(500).json({ message: 'Erreur lors de la suppression du véhicule: ' + error.message });
    }
};

module.exports = {
    getVehicules,
    getVehicule,
    addVehicule,
    modifyVehicule,
    removeVehicule
};
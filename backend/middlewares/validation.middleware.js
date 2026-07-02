const { body, validationResult } = require('express-validator');

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

const registerValidation = [
    body('nom').notEmpty().withMessage('Le nom est requis'),
    body('email').isEmail().withMessage('Email invalide'),
    body('password').isLength({ min: 6 }).withMessage('Mot de passe min 6 caractères'),
    validate
];

const loginValidation = [
    body('email').isEmail().withMessage('Email invalide'),
    body('password').notEmpty().withMessage('Mot de passe requis'),
    validate
];

const reservationValidation = [
    body('trajet_id').isInt().withMessage('Trajet invalide'),
    body('nombre_passagers').isInt({ min: 1 }).withMessage('Nombre passagers invalide'),
    body('siege_selectionne').optional(),
    validate
];

module.exports = {
    registerValidation,
    loginValidation,
    reservationValidation
};
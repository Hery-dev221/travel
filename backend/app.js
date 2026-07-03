const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Timeout plus long
app.use((req, res, next) => {
    res.setTimeout(30000, () => {
        res.status(408).json({ message: 'Timeout' });
    });
    next();
});

app.use(cors({
    origin: '*',
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/vehicules', require('./routes/vehicule.routes'));
app.use('/api/trajets', require('./routes/trajet.routes'));
app.use('/api/reservations', require('./routes/reservation.routes'));
app.use('/api/avis', require('./routes/avis.routes'));

app.get('/api/test', (req, res) => {
    res.json({
        status: 'OK',
        message: 'API TRAVEL fonctionne !',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

app.use((err, req, res, next) => {
    console.error('Erreur:', err.message);
    res.status(500).json({
        message: 'Erreur interne du serveur',
        error: err.message
    });
});

module.exports = app;
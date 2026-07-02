require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`✅ Serveur TRAVEL démarré sur http://localhost:${PORT}`);
        console.log(`✅ API test : http://localhost:${PORT}/api/test`);
    });
}

module.exports = app;
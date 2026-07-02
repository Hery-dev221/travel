const multer = require('multer');
const path = require('path');
const fs = require('fs');

const isVercel = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';

let storagePreuves;
let storageVehicules;

if (isVercel) {
    storagePreuves = multer.memoryStorage();
    storageVehicules = multer.memoryStorage();
} else {
    const uploadDir = path.join(__dirname, '../../uploads');
    const preuvesDir = path.join(__dirname, '../../uploads/preuves');
    const vehiculesDir = path.join(__dirname, '../../public/uploads/vehicules');

    const ensureDirExists = (dir) => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    };

    ensureDirExists(uploadDir);
    ensureDirExists(preuvesDir);
    ensureDirExists(vehiculesDir);

    storagePreuves = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, preuvesDir);
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const ext = path.extname(file.originalname);
            cb(null, `preuve-${uniqueSuffix}${ext}`);
        }
    });

    storageVehicules = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, vehiculesDir);
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const ext = path.extname(file.originalname);
            cb(null, `vehicule-${uniqueSuffix}${ext}`);
        }
    });
}

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
        cb(null, true);
    } else {
        cb(new Error('Seules les images sont autorisées (jpeg, jpg, png, gif, webp)'));
    }
};

const uploadPreuve = multer({
    storage: storagePreuves,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: fileFilter
});

const uploadVehicule = multer({
    storage: storageVehicules,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: fileFilter
});

module.exports = {
    uploadPreuve,
    uploadVehicule,
    upload: uploadPreuve,
    single: (fieldName) => uploadPreuve.single(fieldName)
};
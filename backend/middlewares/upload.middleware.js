const multer = require('multer');
const path = require('path');
const fs = require('fs');

const isVercel = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';

let storage;

if (isVercel) {
    storage = multer.memoryStorage();
} else {
    const preuvesDir = path.join(__dirname, '../../uploads/preuves');
    const vehiculesDir = path.join(__dirname, '../../public/uploads/vehicules');

    const ensureDirExists = (dir) => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    };

    ensureDirExists(preuvesDir);
    ensureDirExists(vehiculesDir);

    storage = multer.diskStorage({
        destination: (req, file, cb) => {
            if (file.fieldname === 'photo_voiture') {
                cb(null, vehiculesDir);
            } else {
                cb(null, preuvesDir);
            }
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const ext = path.extname(file.originalname);
            const prefix = file.fieldname === 'photo_voiture' ? 'vehicule' : 'preuve';
            cb(null, `${prefix}-${uniqueSuffix}${ext}`);
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

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: fileFilter
});

module.exports = {
    uploadPreuve: upload,
    uploadVehicule: upload,
    upload: upload,
    single: (fieldName) => upload.single(fieldName)
};
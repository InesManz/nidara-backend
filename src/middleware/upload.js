const multer = require("multer");

// Guarda el fichero en memoria (buffer) para reenviarlo a Cloudinary.
// Acepta solo imágenes y limita el tamaño a 5 MB.
module.exports = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Solo se permiten imágenes"));
  },
});

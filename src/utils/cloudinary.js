const { v2: cloudinary } = require("cloudinary");

// Se configura desde variables de entorno. Si faltan, la subida se omite
// silenciosamente (la app sigue funcionando sin fotos).
const configurado = Boolean(process.env.CLOUDINARY_CLOUD_NAME);
if (configurado) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

/**
 * Sube el buffer de una imagen (recibida vía form-data con multer) a Cloudinary
 * y devuelve su URL segura. Si no hay fichero o no está configurado, devuelve undefined.
 */
function subirImagen(file, carpeta = "nidara") {
  return new Promise((resolve, reject) => {
    if (!file || !configurado) return resolve(undefined);
    const stream = cloudinary.uploader.upload_stream(
      { folder: carpeta, resource_type: "image" },
      (err, result) => (err ? reject(err) : resolve(result.secure_url))
    );
    stream.end(file.buffer);
  });
}

module.exports = { subirImagen };

/** Manejador de errores centralizado. */
function notFound(req, res) {
  res.status(404).json({ message: "Ruta no encontrada" });
}

function errorHandler(err, req, res, next) {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ message: err.message || "Error del servidor" });
}

module.exports = { notFound, errorHandler };

const mongoose = require("mongoose");

/**
 * Conexión única a MongoDB. Lanza el proceso si falla, porque sin BBDD
 * la API no puede funcionar.
 */
async function connectDB(uri) {
  try {
    await mongoose.connect(uri);
    console.log("✅ MongoDB conectado");
  } catch (err) {
    console.error("❌ Error conectando a MongoDB:", err.message);
    process.exit(1);
  }
}

module.exports = connectDB;

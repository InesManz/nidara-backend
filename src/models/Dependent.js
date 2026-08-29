const mongoose = require("mongoose");

/** Persona cuidada (padre/madre mayor). Colección relacionada con User. */
const dependentSchema = new mongoose.Schema(
  {
    codigo: { type: String, required: true, unique: true, trim: true },
    nombre: { type: String, required: true, trim: true },
    edad: { type: Number, min: 0 },
    ciudad: { type: String, trim: true },
    notas: { type: String, trim: true },
    foto: { type: String, trim: true },
    // Cuidador coordinador responsable → relación con la colección de usuarios.
    cuidador: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Dependent", dependentSchema);

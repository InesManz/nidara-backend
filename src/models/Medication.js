const mongoose = require("mongoose");

/** Medicamento de un dependiente. Relación con Dependent. */
const medicationSchema = new mongoose.Schema(
  {
    codigo: { type: String, required: true, unique: true, trim: true },
    dependiente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dependent",
      required: true,
    },
    nombre: { type: String, required: true, trim: true },
    dosis: { type: String, trim: true },
    frecuencia: { type: String, trim: true },
    horario: { type: String, trim: true },
    critico: { type: Boolean, default: false },
    // Registro de confirmaciones de toma (necesidad N2 del documento de usuario).
    ultimaConfirmacion: { type: Date },
    registros: [{ type: Date }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Medication", medicationSchema);

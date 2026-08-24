const mongoose = require("mongoose");

/** Cita médica de un dependiente. Relación con Dependent. */
const appointmentSchema = new mongoose.Schema(
  {
    codigo: { type: String, required: true, unique: true, trim: true },
    dependiente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dependent",
      required: true,
    },
    titulo: { type: String, required: true, trim: true },
    especialidad: { type: String, trim: true },
    fecha: { type: String, trim: true },
    hora: { type: String, trim: true },
    lugar: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", appointmentSchema);

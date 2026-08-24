const mongoose = require("mongoose");

/** Tarea de cuidado. Relación con Dependent y con User (asignado). */
const taskSchema = new mongoose.Schema(
  {
    codigo: { type: String, required: true, unique: true, trim: true },
    dependiente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dependent",
      required: true,
    },
    titulo: { type: String, required: true, trim: true },
    prioridad: {
      type: String,
      enum: ["baja", "media", "alta"],
      default: "media",
    },
    asignado: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    estado: {
      type: String,
      enum: ["pendiente", "en_progreso", "hecha"],
      default: "pendiente",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);

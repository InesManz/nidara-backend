const Medication = require("../models/Medication");

exports.list = async (req, res, next) => {
  try {
    const filter = req.query.dependiente ? { dependiente: req.query.dependiente } : {};
    const meds = await Medication.find(filter).populate("dependiente", "nombre codigo").sort("nombre");
    res.json(meds);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const med = await Medication.create(req.body);
    res.status(201).json(med);
  } catch (err) { next(err); }
};

// Necesidad N2: confirmar que la toma se ha realizado hoy.
exports.confirm = async (req, res, next) => {
  try {
    const med = await Medication.findById(req.params.id);
    if (!med) return res.status(404).json({ message: "Medicamento no encontrado" });
    const now = new Date();
    med.ultimaConfirmacion = now;
    med.registros.push(now);
    await med.save();
    res.json(med);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    await Medication.findByIdAndDelete(req.params.id);
    res.json({ message: "Medicamento eliminado" });
  } catch (err) { next(err); }
};

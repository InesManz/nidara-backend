const Medication = require("../models/Medication");
const { misDependientes } = require("../utils/ownership");

exports.list = async (req, res, next) => {
  try {
    // Solo la medicación de los dependientes del usuario en sesión.
    let ids = await misDependientes(req.user._id);
    if (req.query.dependiente) ids = ids.filter((id) => String(id) === req.query.dependiente);
    const meds = await Medication.find({ dependiente: { $in: ids } }).populate("dependiente", "nombre codigo").sort("nombre");
    res.json(meds);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const ids = await misDependientes(req.user._id);
    if (!ids.some((id) => String(id) === String(req.body.dependiente))) {
      return res.status(403).json({ message: "No puedes añadir medicación a ese dependiente" });
    }
    const med = await Medication.create(req.body);
    res.status(201).json(med);
  } catch (err) { next(err); }
};

// Necesidad N2: confirmar que la toma se ha realizado hoy (solo medicación propia).
exports.confirm = async (req, res, next) => {
  try {
    const ids = await misDependientes(req.user._id);
    const med = await Medication.findOne({ _id: req.params.id, dependiente: { $in: ids } });
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
    const ids = await misDependientes(req.user._id);
    const med = await Medication.findOneAndDelete({ _id: req.params.id, dependiente: { $in: ids } });
    if (!med) return res.status(404).json({ message: "Medicamento no encontrado" });
    res.json({ message: "Medicamento eliminado" });
  } catch (err) { next(err); }
};

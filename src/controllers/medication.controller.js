const Medication = require("../models/Medication");
const Dependent = require("../models/Dependent");

exports.list = async (req, res, next) => {
  try {
    // Solo la medicación de los dependientes del usuario en sesión.
    const misDeps = await Dependent.find({ cuidador: req.user._id }).select("_id");
    let ids = misDeps.map((d) => d._id);
    if (req.query.dependiente) ids = ids.filter((id) => String(id) === req.query.dependiente);
    const meds = await Medication.find({ dependiente: { $in: ids } }).populate("dependiente", "nombre codigo").sort("nombre");
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

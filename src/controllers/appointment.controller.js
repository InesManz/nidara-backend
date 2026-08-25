const Appointment = require("../models/Appointment");
const { misDependientes } = require("../utils/ownership");

exports.list = async (req, res, next) => {
  try {
    // Solo las citas de los dependientes del usuario en sesión.
    let ids = await misDependientes(req.user._id);
    if (req.query.dependiente) ids = ids.filter((id) => String(id) === req.query.dependiente);
    const citas = await Appointment.find({ dependiente: { $in: ids } })
      .populate("dependiente", "nombre codigo")
      .sort("fecha");
    res.json(citas);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const ids = await misDependientes(req.user._id);
    if (!ids.some((id) => String(id) === String(req.body.dependiente))) {
      return res.status(403).json({ message: "No puedes crear citas para ese dependiente" });
    }
    const cita = await Appointment.create(req.body);
    res.status(201).json(cita);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const ids = await misDependientes(req.user._id);
    const cita = await Appointment.findOneAndDelete({ _id: req.params.id, dependiente: { $in: ids } });
    if (!cita) return res.status(404).json({ message: "Cita no encontrada" });
    res.json({ message: "Cita eliminada" });
  } catch (err) { next(err); }
};

const Appointment = require("../models/Appointment");

exports.list = async (req, res, next) => {
  try {
    const filter = req.query.dependiente ? { dependiente: req.query.dependiente } : {};
    const citas = await Appointment.find(filter)
      .populate("dependiente", "nombre codigo")
      .sort("fecha");
    res.json(citas);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const cita = await Appointment.create(req.body);
    res.status(201).json(cita);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ message: "Cita eliminada" });
  } catch (err) { next(err); }
};

const Task = require("../models/Task");
const Dependent = require("../models/Dependent");

exports.list = async (req, res, next) => {
  try {
    // Solo las tareas de los dependientes del usuario en sesión.
    const misDeps = await Dependent.find({ cuidador: req.user._id }).select("_id");
    let ids = misDeps.map((d) => d._id);
    if (req.query.dependiente) ids = ids.filter((id) => String(id) === req.query.dependiente);
    const tasks = await Task.find({ dependiente: { $in: ids } })
      .populate("dependiente", "nombre codigo")
      .populate("asignado", "nombre email")
      .sort("estado");
    res.json(tasks);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json(task);
  } catch (err) { next(err); }
};

// Necesidad N3: actualizar estado o reasignar la tarea entre cuidadores.
exports.update = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate("asignado", "nombre email");
    if (!task) return res.status(404).json({ message: "Tarea no encontrada" });
    res.json(task);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Tarea eliminada" });
  } catch (err) { next(err); }
};

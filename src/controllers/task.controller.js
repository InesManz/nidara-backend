const Task = require("../models/Task");
const { misDependientes } = require("../utils/ownership");

exports.list = async (req, res, next) => {
  try {
    // Solo las tareas de los dependientes del usuario en sesión.
    let ids = await misDependientes(req.user._id);
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
    const ids = await misDependientes(req.user._id);
    if (!ids.some((id) => String(id) === String(req.body.dependiente))) {
      return res.status(403).json({ message: "No puedes crear tareas para ese dependiente" });
    }
    const task = await Task.create(req.body);
    res.status(201).json(task);
  } catch (err) { next(err); }
};

// Necesidad N3: actualizar estado o reasignar la tarea (solo tareas propias).
exports.update = async (req, res, next) => {
  try {
    const ids = await misDependientes(req.user._id);
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, dependiente: { $in: ids } },
      req.body,
      { new: true }
    ).populate("asignado", "nombre email");
    if (!task) return res.status(404).json({ message: "Tarea no encontrada" });
    res.json(task);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const ids = await misDependientes(req.user._id);
    const task = await Task.findOneAndDelete({ _id: req.params.id, dependiente: { $in: ids } });
    if (!task) return res.status(404).json({ message: "Tarea no encontrada" });
    res.json({ message: "Tarea eliminada" });
  } catch (err) { next(err); }
};

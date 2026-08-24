const Dependent = require("../models/Dependent");

exports.list = async (req, res, next) => {
  try {
    const deps = await Dependent.find().populate("cuidador", "nombre email").sort("nombre");
    res.json(deps);
  } catch (err) { next(err); }
};

exports.getOne = async (req, res, next) => {
  try {
    const dep = await Dependent.findById(req.params.id).populate("cuidador", "nombre email");
    if (!dep) return res.status(404).json({ message: "Dependiente no encontrado" });
    res.json(dep);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const dep = await Dependent.create({ ...req.body, cuidador: req.user._id });
    res.status(201).json(dep);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const dep = await Dependent.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!dep) return res.status(404).json({ message: "Dependiente no encontrado" });
    res.json(dep);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    await Dependent.findByIdAndDelete(req.params.id);
    res.json({ message: "Dependiente eliminado" });
  } catch (err) { next(err); }
};

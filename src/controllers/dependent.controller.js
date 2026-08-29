const Dependent = require("../models/Dependent");
const { subirImagen } = require("../utils/cloudinary");

exports.list = async (req, res, next) => {
  try {
    const deps = await Dependent.find({ cuidador: req.user._id }).populate("cuidador", "nombre email").sort("nombre");
    res.json(deps);
  } catch (err) { next(err); }
};

exports.getOne = async (req, res, next) => {
  try {
    const dep = await Dependent.findOne({ _id: req.params.id, cuidador: req.user._id }).populate("cuidador", "nombre email");
    if (!dep) return res.status(404).json({ message: "Dependiente no encontrado" });
    res.json(dep);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const foto = await subirImagen(req.file, "nidara/dependientes");
    const dep = await Dependent.create({ ...req.body, ...(foto && { foto }), cuidador: req.user._id });
    res.status(201).json(dep);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    // No se permite reasignar el dueño desde el body.
    const { cuidador, ...cambios } = req.body;
    const foto = await subirImagen(req.file, "nidara/dependientes");
    if (foto) cambios.foto = foto;
    const dep = await Dependent.findOneAndUpdate(
      { _id: req.params.id, cuidador: req.user._id },
      cambios,
      { new: true }
    );
    if (!dep) return res.status(404).json({ message: "Dependiente no encontrado" });
    res.json(dep);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const dep = await Dependent.findOneAndDelete({ _id: req.params.id, cuidador: req.user._id });
    if (!dep) return res.status(404).json({ message: "Dependiente no encontrado" });
    res.json({ message: "Dependiente eliminado" });
  } catch (err) { next(err); }
};

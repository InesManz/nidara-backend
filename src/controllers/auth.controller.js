const jwt = require("jsonwebtoken");
const User = require("../models/User");

function signToken(user) {
  return jwt.sign({ id: user._id, rol: user.rol }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

const publicUser = (u) => ({ id: u._id, nombre: u.nombre, email: u.email, rol: u.rol });

exports.register = async (req, res, next) => {
  try {
    const { nombre, email, password, rol } = req.body;
    if (!nombre || !email || !password) {
      return res.status(400).json({ message: "Nombre, email y contraseña son obligatorios" });
    }
    // Política de contraseña: mínimo 8 caracteres, con al menos una letra y un número.
    if (password.length < 8 || !/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
      return res.status(400).json({
        message: "La contraseña debe tener al menos 8 caracteres, incluyendo una letra y un número",
      });
    }
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: "Ese email ya está registrado" });

    const user = await User.create({ nombre, email, password, rol });
    res.status(201).json({ token: signToken(user), user: publicUser(user) });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }
    res.json({ token: signToken(user), user: publicUser(user) });
  } catch (err) {
    next(err);
  }
};

exports.me = async (req, res) => {
  res.json({ user: publicUser(req.user) });
};

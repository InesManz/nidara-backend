const jwt = require("jsonwebtoken");
const User = require("../models/User");

/** Verifica el JWT del header Authorization y adjunta el usuario a req.user. */
async function protect(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    if (!header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No autenticado" });
    }
    const token = header.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id);
    if (!user) return res.status(401).json({ message: "Usuario no válido" });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
}

/** Autoriza solo a ciertos roles. Uso: authorize("coordinador"). */
function authorize(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.rol)) {
      return res.status(403).json({ message: "No tienes permisos para esta acción" });
    }
    next();
  };
}

module.exports = { protect, authorize };

const router = require("express").Router();
const rateLimit = require("express-rate-limit");
const ctrl = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth");

// Límite anti fuerza bruta en registro y login: 20 intentos por IP cada 15 min.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Demasiados intentos. Inténtalo de nuevo en unos minutos." },
});

router.post("/register", authLimiter, ctrl.register);
router.post("/login", authLimiter, ctrl.login);
router.get("/me", protect, ctrl.me);

module.exports = router;

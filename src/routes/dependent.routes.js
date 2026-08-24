const router = require("express").Router();
const ctrl = require("../controllers/dependent.controller");
const { protect, authorize } = require("../middleware/auth");

// Todas las rutas requieren sesión iniciada.
router.use(protect);

router.get("/", ctrl.list);
router.get("/:id", ctrl.getOne);
router.post("/", ctrl.create);
router.put("/:id", ctrl.update);
// Borrar solo lo puede hacer un coordinador (autorización por rol).
router.delete("/:id", authorize("coordinador"), ctrl.remove);

module.exports = router;

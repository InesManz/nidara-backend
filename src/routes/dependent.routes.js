const router = require("express").Router();
const ctrl = require("../controllers/dependent.controller");
const upload = require("../middleware/upload");
const { protect, authorize } = require("../middleware/auth");

// Todas las rutas requieren sesión iniciada.
router.use(protect);

router.get("/", ctrl.list);
router.get("/:id", ctrl.getOne);
router.post("/", upload.single("foto"), ctrl.create);
router.put("/:id", upload.single("foto"), ctrl.update);
// Borrar solo lo puede hacer un coordinador (autorización por rol).
router.delete("/:id", authorize("coordinador"), ctrl.remove);

module.exports = router;

const router = require("express").Router();
const ctrl = require("../controllers/medication.controller");
const { protect, authorize } = require("../middleware/auth");

router.use(protect);

router.get("/", ctrl.list);
router.post("/", ctrl.create);
router.patch("/:id/confirmar", ctrl.confirm);
router.delete("/:id", authorize("coordinador"), ctrl.remove);

module.exports = router;

const router = require("express").Router();
const ctrl = require("../controllers/appointment.controller");
const { protect } = require("../middleware/auth");

router.use(protect);

router.get("/", ctrl.list);
router.post("/", ctrl.create);
router.delete("/:id", ctrl.remove);

module.exports = router;

const router = require("express").Router();
const ctrl = require("../controllers/task.controller");
const { protect } = require("../middleware/auth");

router.use(protect);

router.get("/", ctrl.list);
router.post("/", ctrl.create);
router.patch("/:id", ctrl.update);
router.delete("/:id", ctrl.remove);

module.exports = router;

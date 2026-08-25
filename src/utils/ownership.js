const Dependent = require("../models/Dependent");

/**
 * Devuelve los _id de los dependientes que pertenecen al usuario en sesión.
 * Sirve para restringir medicación, tareas y citas a la propia familia.
 */
async function misDependientes(userId) {
  const deps = await Dependent.find({ cuidador: userId }).select("_id");
  return deps.map((d) => d._id);
}

module.exports = { misDependientes };

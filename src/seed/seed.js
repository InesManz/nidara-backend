/**
 * Semilla de la base de datos.
 *
 * Lee los CSV de /data con el módulo `fs` (ver utils/csv.js) e inserta los
 * documentos resolviendo las relaciones entre colecciones:
 *   dependientes.cuidadorEmail  -> User._id
 *   medicamentos.dependienteCodigo -> Dependent._id
 *   tareas.dependienteCodigo / asignadoEmail -> Dependent._id / User._id
 *   citas.dependienteCodigo -> Dependent._id
 *
 *   node src/seed/seed.js
 */
require("dotenv").config();
const path = require("path");
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const { readCsv } = require("../utils/csv");

const User = require("../models/User");
const Dependent = require("../models/Dependent");
const Medication = require("../models/Medication");
const Task = require("../models/Task");
const Appointment = require("../models/Appointment");

const DATA = path.join(__dirname, "..", "..", "data");

async function run() {
  await connectDB(process.env.MONGODB_URI);

  // 1. Limpiar
  await Promise.all([
    User.deleteMany({}),
    Dependent.deleteMany({}),
    Medication.deleteMany({}),
    Task.deleteMany({}),
    Appointment.deleteMany({}),
  ]);
  console.log("🧹 Colecciones vaciadas");

  // 2. Usuarios (create() dispara el hook que hashea la contraseña)
  const usuariosCsv = readCsv(path.join(DATA, "usuarios.csv"));
  const usuarios = await User.create(usuariosCsv);
  const userByEmail = Object.fromEntries(usuarios.map((u) => [u.email, u._id]));
  console.log(`👤 Usuarios: ${usuarios.length}`);

  // 3. Dependientes (resuelve cuidadorEmail -> User._id)
  const depsCsv = readCsv(path.join(DATA, "dependientes.csv"));
  const deps = await Dependent.create(
    depsCsv.map((d) => ({
      codigo: d.codigo,
      nombre: d.nombre,
      edad: Number(d.edad),
      ciudad: d.ciudad,
      notas: d.notas,
      cuidador: userByEmail[d.cuidadorEmail],
    }))
  );
  const depByCode = Object.fromEntries(deps.map((d) => [d.codigo, d._id]));
  console.log(`🧓 Dependientes: ${deps.length}`);

  // 4. Medicamentos
  const medsCsv = readCsv(path.join(DATA, "medicamentos.csv"));
  const meds = await Medication.create(
    medsCsv.map((m) => ({
      codigo: m.codigo,
      dependiente: depByCode[m.dependienteCodigo],
      nombre: m.nombre,
      dosis: m.dosis,
      frecuencia: m.frecuencia,
      horario: m.horario,
      critico: m.critico === true,
    }))
  );
  console.log(`💊 Medicamentos: ${meds.length}`);

  // 5. Tareas (resuelve dependiente y asignado)
  const tareasCsv = readCsv(path.join(DATA, "tareas.csv"));
  const tareas = await Task.create(
    tareasCsv.map((t) => ({
      codigo: t.codigo,
      dependiente: depByCode[t.dependienteCodigo],
      titulo: t.titulo,
      prioridad: t.prioridad,
      asignado: userByEmail[t.asignadoEmail],
      estado: t.estado,
    }))
  );
  console.log(`✅ Tareas: ${tareas.length}`);

  // 6. Citas
  const citasCsv = readCsv(path.join(DATA, "citas.csv"));
  const citas = await Appointment.create(
    citasCsv.map((c) => ({
      codigo: c.codigo,
      dependiente: depByCode[c.dependienteCodigo],
      titulo: c.titulo,
      especialidad: c.especialidad,
      fecha: c.fecha,
      hora: c.hora,
      lugar: c.lugar,
    }))
  );
  console.log(`📅 Citas: ${citas.length}`);

  console.log("\n🌱 Semilla completada. Usuario demo: marta@nidara.app / password123");
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error("Error en la semilla:", err);
  process.exit(1);
});

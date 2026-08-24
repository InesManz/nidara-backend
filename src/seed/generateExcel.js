/**
 * Genera el Excel de datos iniciales (data/cuidanet_seed.xlsx) y exporta
 * cada hoja a CSV en data/. La BBDD se construye después leyendo estos CSV
 * con el módulo `fs` (ver seed.js), tal y como pide el enunciado.
 *
 *   node src/seed/generateExcel.js
 */
const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");

const DATA_DIR = path.join(__dirname, "..", "..", "data");
fs.mkdirSync(DATA_DIR, { recursive: true });

// ---------------------------------------------------------------- USUARIOS
const usuarios = [
  { nombre: "Marta Ruiz", email: "marta@nidara.app", password: "password123", rol: "coordinador" },
  { nombre: "Javier Ruiz", email: "javier@nidara.app", password: "password123", rol: "cuidador" },
  { nombre: "Lucía Ruiz", email: "lucia@nidara.app", password: "password123", rol: "cuidador" },
  { nombre: "Carlos Vega", email: "carlos@nidara.app", password: "password123", rol: "coordinador" },
  { nombre: "Ana Vega", email: "ana@nidara.app", password: "password123", rol: "cuidador" },
  { nombre: "Pablo Soler", email: "pablo@nidara.app", password: "password123", rol: "coordinador" },
  { nombre: "Elena Soler", email: "elena@nidara.app", password: "password123", rol: "cuidador" },
  { nombre: "Nuria Gil", email: "nuria@nidara.app", password: "password123", rol: "coordinador" },
  { nombre: "Diego Gil", email: "diego@nidara.app", password: "password123", rol: "cuidador" },
  { nombre: "Sara Mora", email: "sara@nidara.app", password: "password123", rol: "coordinador" },
  { nombre: "Hugo Mora", email: "hugo@nidara.app", password: "password123", rol: "cuidador" },
  { nombre: "Admin Nidara", email: "admin@nidara.app", password: "admin1234", rol: "coordinador" },
];
const coordinadores = usuarios.filter((u) => u.rol === "coordinador");

// ------------------------------------------------------------- DEPENDIENTES
const nombresDep = [
  "Dolores Ruiz", "Antonio Vega", "Carmen Soler", "Manuel Gil", "Josefa Mora",
  "Francisco Díaz", "Isabel León", "Rafael Prieto", "Pilar Navarro", "Ramón Ortega",
  "Encarna Ibáñez", "Tomás Cano",
];
const dependientes = nombresDep.map((nombre, i) => ({
  codigo: `D${String(i + 1).padStart(2, "0")}`,
  nombre,
  edad: 75 + (i % 15),
  ciudad: ["León", "Madrid", "Sevilla", "Valencia", "Zaragoza"][i % 5],
  notas: ["Vive sola", "Movilidad reducida", "Diabetes tipo 2", "Hipertensión", "Principio de demencia"][i % 5],
  cuidadorEmail: coordinadores[i % coordinadores.length].email,
}));

// -------------------------------------------------------------- MEDICAMENTOS
const meds = [
  ["Enalapril", "10 mg", "1 vez/día", "08:00", true],
  ["Metformina", "850 mg", "2 veces/día", "08:00,20:00", true],
  ["Sintrom", "según pauta", "1 vez/día", "18:00", true],
  ["Omeprazol", "20 mg", "1 vez/día", "08:00", false],
  ["Paracetamol", "1 g", "si dolor", "—", false],
  ["Atorvastatina", "20 mg", "1 vez/día", "22:00", false],
  ["Lorazepam", "1 mg", "noche", "23:00", true],
  ["Furosemida", "40 mg", "1 vez/día", "09:00", true],
];
let medicamentos = [];
let mCount = 1;
dependientes.forEach((d, di) => {
  const n = 3 + (di % 3); // 3-5 medicamentos por dependiente
  for (let k = 0; k < n; k++) {
    const m = meds[(di + k) % meds.length];
    medicamentos.push({
      codigo: `M${String(mCount++).padStart(3, "0")}`,
      dependienteCodigo: d.codigo,
      nombre: m[0],
      dosis: m[1],
      frecuencia: m[2],
      horario: m[3],
      critico: m[4],
    });
  }
});

// -------------------------------------------------------------------- TAREAS
const tareasBase = [
  ["Comprar medicación en la farmacia", "media"],
  ["Llevar a revisión médica", "alta"],
  ["Hacer la compra semanal", "media"],
  ["Llamar para acompañar por la tarde", "baja"],
  ["Revisar la tensión arterial", "alta"],
  ["Preparar comidas para la semana", "media"],
  ["Pagar recibos pendientes", "baja"],
  ["Acompañar al fisioterapeuta", "media"],
];
const estados = ["pendiente", "en_progreso", "hecha"];
let tareas = [];
let tCount = 1;
dependientes.forEach((d, di) => {
  const n = 3 + (di % 2); // 3-4 tareas
  for (let k = 0; k < n; k++) {
    const t = tareasBase[(di + k) % tareasBase.length];
    const asignado = usuarios[(di + k) % (usuarios.length - 1)];
    tareas.push({
      codigo: `T${String(tCount++).padStart(3, "0")}`,
      dependienteCodigo: d.codigo,
      titulo: t[0],
      prioridad: t[1],
      asignadoEmail: asignado.email,
      estado: estados[(di + k) % estados.length],
    });
  }
});

// --------------------------------------------------------------------- CITAS
const especialidades = ["Cardiología", "Medicina general", "Traumatología", "Neurología", "Endocrino"];
let citas = [];
let cCount = 1;
dependientes.forEach((d, di) => {
  const n = 1 + (di % 2); // 1-2 citas
  for (let k = 0; k < n; k++) {
    const dia = 10 + ((di + k) % 18);
    citas.push({
      codigo: `C${String(cCount++).padStart(3, "0")}`,
      dependienteCodigo: d.codigo,
      titulo: `Revisión de ${especialidades[(di + k) % especialidades.length]}`,
      especialidad: especialidades[(di + k) % especialidades.length],
      fecha: `2026-09-${String(dia).padStart(2, "0")}`,
      hora: ["09:30", "11:00", "12:15", "16:45"][(di + k) % 4],
      lugar: `Centro de Salud ${d.ciudad}`,
    });
  }
});

// ---------------------------------------------------------- ESCRIBIR SALIDAS
const sheets = { usuarios, dependientes, medicamentos, tareas, citas };
const wb = XLSX.utils.book_new();
for (const [name, rows] of Object.entries(sheets)) {
  const ws = XLSX.utils.json_to_sheet(rows);
  XLSX.utils.book_append_sheet(wb, ws, name);
  const csv = XLSX.utils.sheet_to_csv(ws);
  fs.writeFileSync(path.join(DATA_DIR, `${name}.csv`), csv, "utf8");
}
XLSX.writeFile(wb, path.join(DATA_DIR, "nidara_seed.xlsx"));

const total = medicamentos.length + tareas.length + citas.length + dependientes.length;
console.log("Excel y CSV generados en /data");
console.log(
  `Registros -> usuarios:${usuarios.length} dependientes:${dependientes.length} ` +
  `medicamentos:${medicamentos.length} tareas:${tareas.length} citas:${citas.length}`
);
console.log(`Total registros de colecciones relacionadas (sin usuarios): ${total}`);

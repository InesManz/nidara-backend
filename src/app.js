const express = require("express");
const cors = require("cors");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(express.json());

// Salud del servicio (útil para el despliegue).
app.get("/", (req, res) => res.json({ ok: true, service: "Nidara API" }));
app.get("/api/health", (req, res) => res.json({ status: "up" }));

// Rutas
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/dependientes", require("./routes/dependent.routes"));
app.use("/api/medicamentos", require("./routes/medication.routes"));
app.use("/api/tareas", require("./routes/task.routes"));
app.use("/api/citas", require("./routes/appointment.routes"));

app.use(notFound);
app.use(errorHandler);

module.exports = app;

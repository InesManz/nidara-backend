const fs = require("fs");

/**
 * Parser CSV mínimo pero correcto (soporta comillas y comas dentro de campos).
 * Lee el fichero con el módulo `fs` y devuelve un array de objetos usando la
 * primera fila como cabecera. Convierte "TRUE"/"FALSE" a booleano.
 */
function readCsv(filePath) {
  const content = fs.readFileSync(filePath, "utf8").replace(/\r\n/g, "\n").trim();
  const rows = parseRows(content);
  const headers = rows.shift();
  return rows.map((cells) => {
    const obj = {};
    headers.forEach((h, i) => {
      let v = cells[i] ?? "";
      if (v === "TRUE") v = true;
      else if (v === "FALSE") v = false;
      obj[h] = v;
    });
    return obj;
  });
}

function parseRows(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') inQuotes = false;
      else field += c;
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(field); field = "";
    } else if (c === "\n") {
      row.push(field); rows.push(row); row = []; field = "";
    } else {
      field += c;
    }
  }
  if (field.length > 0 || row.length > 0) { row.push(field); rows.push(row); }
  return rows;
}

module.exports = { readCsv };

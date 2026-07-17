import { existsSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { PRODUCTS } from "../assets/data/products.js";

const htmlFiles = ["index.html", "carrito.html", "marcas.html", "guia-tallas.html", "envios.html"];
const jsFiles = [
  "assets/data/products.js",
  "assets/js/store.js",
  "assets/js/shoe-viewer.js",
  "assets/js/checkout.js",
  "scripts/dev-server.js",
  "scripts/validate.js"
];
const requiredFiles = [
  ...htmlFiles,
  ...jsFiles,
  "assets/css/home.css",
  "assets/css/checkout.css",
  "assets/css/pages.css",
  "package.json",
  ".vscode/settings.json",
  ".vscode/tasks.json",
  ".vscode/extensions.json"
];

function fail(message) {
  console.error(message);
  process.exitCode = 1;
}

for (const file of requiredFiles) {
  if (!existsSync(file)) fail(`Falta archivo requerido: ${file}`);
}

for (const file of jsFiles) {
  const result = spawnSync(process.execPath, ["--check", file], { encoding: "utf8" });
  if (result.status !== 0) fail(`Error de sintaxis en ${file}\n${result.stderr}`);
}

const brands = new Set(PRODUCTS.map((product) => product.brand));
const ids = new Set(PRODUCTS.map((product) => product.id));
for (const brand of ["Nike", "Adidas", "Puma", "New Balance", "Salomon"]) {
  if (!brands.has(brand)) fail(`Falta marca en catalogo: ${brand}`);
}
if (PRODUCTS.length !== 15) fail(`Catalogo esperado: 15 productos. Actual: ${PRODUCTS.length}`);
if (ids.size !== PRODUCTS.length) fail("Hay IDs duplicados en assets/data/products.js");

for (const file of htmlFiles) {
  const html = readFileSync(file, "utf8");
  const refs = html.matchAll(/(?:href|src)="([^"]+)"/g);

  for (const [, ref] of refs) {
    if (/^(https?:|mailto:|tel:|#)/.test(ref)) continue;
    const cleanRef = ref.split("#")[0];
    if (cleanRef && !existsSync(cleanRef)) fail(`${file} enlaza a un archivo inexistente: ${cleanRef}`);
  }
}

const source = [...htmlFiles, "assets/css/home.css", "assets/css/pages.css", "README.md"]
  .map((file) => readFileSync(file, "utf8"))
  .join("\n");

if (/images\.unsplash|tcrunningco/.test(source)) {
  fail("Quedan referencias a imagenes genericas o retailer antiguo.");
}

if (!process.exitCode) console.log("Validacion completada correctamente.");

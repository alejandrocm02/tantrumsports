import { createServer } from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import { extname, join, normalize, resolve } from "node:path";

const root = resolve(".");
const port = Number(process.env.PORT || 5173);

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml"
};

function resolveRequest(url) {
  const cleanUrl = decodeURIComponent(url.split("?")[0]);
  const relative = cleanUrl === "/" ? "index.html" : cleanUrl.replace(/^\/+/, "");
  const target = resolve(root, normalize(relative));

  if (!target.startsWith(root)) return null;
  if (existsSync(target) && statSync(target).isDirectory()) return join(target, "index.html");
  return target;
}

const server = createServer((request, response) => {
  const file = resolveRequest(request.url || "/");

  if (!file || !existsSync(file)) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("404 - Archivo no encontrado");
    return;
  }

  response.writeHead(200, { "Content-Type": types[extname(file)] || "application/octet-stream" });
  createReadStream(file).pipe(response);
});

server.listen(port, "127.0.0.1", () => {
  console.log(`TantrumSports listo en http://127.0.0.1:${port}`);
});

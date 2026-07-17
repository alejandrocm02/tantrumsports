# TantrumSports

Tienda web estatica de zapatillas creada con HTML, CSS y JavaScript vanilla.

## Estado actual

- Catalogo de 15 zapatillas: Nike, Adidas, Puma, New Balance y Salomon.
- Buscador por modelo, marca, uso y descripcion.
- Filtros por marca, uso, talla EU, color, precio maximo y disponibilidad.
- Ordenacion por destacados, precio y stock.
- Tarjetas con seleccion de talla, unidades y estado visual.
- Ficha de producto modal con descripcion, imagen grande, tallas, unidades y acceso a vista 360.
- Vista 360 generativa con Three.js.
- Imagenes de producto reales y revisadas para evitar fotos genericas.
- Inicio mas limpio con accesos rapidos a paginas internas.
- Proyecto organizado para VS Code con carpetas `assets/`, `scripts/` y `.vscode/`.
- Mini-carrito lateral editable sin salir del catalogo.
- Checkout completo en `carrito.html` con envio, pago simulado y confirmacion de pedido.
- Persistencia del carrito y del historial local de pedidos con `localStorage`.

## Paginas

- `index.html`: inicio, catalogo, fichas de producto, vista 360 y mini-carrito.
- `marcas.html`: pagina de marcas con modelos destacados e imagenes reales.
- `guia-tallas.html`: tabla de tallas EU, US, UK y consejos de ajuste.
- `envios.html`: informacion de envio, cambios y flujo de pedido.
- `carrito.html`: checkout completo con resumen editable, confirmacion e historial local de pedidos.

## Estructura

```text
.
|-- index.html
|-- marcas.html
|-- guia-tallas.html
|-- envios.html
|-- carrito.html
|-- package.json
|-- assets
|   |-- css
|   |   |-- home.css
|   |   |-- checkout.css
|   |   `-- pages.css
|   |-- data
|   |   `-- products.js
|   `-- js
|       |-- store.js
|       |-- checkout.js
|       `-- shoe-viewer.js
|-- scripts
|   |-- dev-server.js
|   `-- validate.js
|-- .vscode
|   |-- settings.json
|   |-- tasks.json
|   `-- extensions.json
|-- README.md
|-- .nojekyll
`-- .gitignore
```

## Trabajo en VS Code

1. Abre la carpeta del proyecto en VS Code.
2. Ejecuta la tarea `TantrumSports: servidor local` o usa:

```text
npm.cmd run dev
```

3. Abre `http://127.0.0.1:5173`.
4. Si la pagina estaba abierta y el catalogo no aparece, recarga la pestana despues de levantar el servidor.
5. Antes de publicar cambios, ejecuta:

```text
npm.cmd run validate
```

Si usas una terminal que no sea PowerShell, tambien puedes usar `npm run dev` y `npm run validate`.

## Publicacion

El proyecto esta preparado para GitHub Pages desde la rama `main` y carpeta `/root`.

URL esperada:

```text
https://alejandrocm02.github.io/tantrumsports/
```

## Historial de mejoras

- Version actual: tareas de VS Code ajustadas para arrancar Node en Windows y servir el catalogo correctamente.
- `6e8f12b`: proyecto preparado para VS Code con CSS, JavaScript y datos separados.
- `d4122e7`: inicio mas limpio, paginas internas nuevas, scrolls mejorados e imagenes reales revisadas.
- `8a3b068`: imagenes revisadas e historial local de pedidos.
- `e190b5f`: filtros avanzados por color, precio y disponibilidad.
- `279bd72`: buscador integrado en el catalogo.
- `41d30f5`: README actualizado con estado e historial del proyecto.
- `2f62282`: checkout con formulario de envio, pago simulado y confirmacion.
- `e6a562c`: mini-carrito lateral editable.
- `f88aa29`: ficha de producto modal.
- `df79a2d`: mejora de presentacion e imagenes de producto.
- `b6714b5`: version inicial de la tienda estatica.

## Proximas mejoras sugeridas

- Mejorar la vista 360 con modelos `.glb`.
- Documentar fuentes de imagen por proveedor.
- Anadir estados simulados de envio al historial.
- Crear paginas de detalle individuales por zapatilla.
- Separar componentes de interfaz en modulos mas pequenos si el proyecto crece.

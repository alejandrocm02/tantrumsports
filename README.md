# TantrumSports

Tienda web estatica de zapatillas creada con HTML, CSS y JavaScript vanilla.

## Estado actual

- Catalogo de 15 zapatillas: Nike, Adidas, Puma, New Balance y Salomon.
- Filtros por marca, uso y talla EU.
- Ordenacion por destacados, precio y stock.
- Tarjetas con seleccion de talla, unidades y estado visual.
- Ficha de producto modal con descripcion, imagen grande, tallas, unidades y acceso a vista 360.
- Vista 360 generativa con Three.js.
- Mini-carrito lateral editable sin salir del catalogo.
- Checkout completo en `carrito.html` con envio, pago simulado y confirmacion de pedido.
- Persistencia del carrito con `localStorage`.

## Paginas

- `index.html`: tienda principal, catalogo, fichas de producto, vista 360 y mini-carrito.
- `carrito.html`: checkout completo con resumen editable y confirmacion.

## Estructura

```text
.
|-- index.html
|-- carrito.html
|-- README.md
|-- .nojekyll
`-- .gitignore
```

## Publicacion

El proyecto esta preparado para GitHub Pages desde la rama `main` y carpeta `/root`.

URL esperada:

```text
https://alejandrocm02.github.io/tantrumsports/
```

## Historial de mejoras

- `2f62282`: checkout con formulario de envio, pago simulado y confirmacion.
- `e6a562c`: mini-carrito lateral editable.
- `f88aa29`: ficha de producto modal.
- `df79a2d`: mejora de presentacion e imagenes de producto.
- `b6714b5`: version inicial de la tienda estatica.

## Proximas mejoras sugeridas

- Buscador por modelo, marca y categoria.
- Filtros avanzados por color, precio y disponibilidad.
- Imagenes oficiales consistentes para todos los modelos restantes.
- Mejorar la vista 360 con modelos `.glb`.
- Guardar pedidos simulados en historial local.

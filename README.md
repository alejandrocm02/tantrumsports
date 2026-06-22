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
- Imagenes de producto revisadas para evitar fotos genericas en los modelos Salomon y en la portada.
- Mini-carrito lateral editable sin salir del catalogo.
- Checkout completo en `carrito.html` con envio, pago simulado y confirmacion de pedido.
- Persistencia del carrito y del historial local de pedidos con `localStorage`.

## Paginas

- `index.html`: tienda principal, catalogo, fichas de producto, vista 360 y mini-carrito.
- `carrito.html`: checkout completo con resumen editable, confirmacion e historial local de pedidos.

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

- Version actual: imagenes revisadas e historial local de pedidos.
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

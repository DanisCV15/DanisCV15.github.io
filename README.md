# Portfolio de Daniel Escolar

Ciberseguridad, desarrollo web, proyectos propios y laboratorios explicados paso a paso, con capturas propias.

https://daniscv15.github.io/

Hecho con [Astro](https://astro.build). Cada laboratorio y cada proyecto es un archivo Markdown; la portada, los contadores y las tarjetas se generan a partir de ellos. GitHub Actions compila la web y la publica en GitHub Pages con cada cambio en `main`.

## Qué se genera al compilar

- Una página por laboratorio y proyecto, y una por etiqueta (`etiqueta-suid.html`) con los laboratorios que la usan.
- Una miniatura de 640×320 por laboratorio (`thumbs/`), recortada de su primera captura.
- Una imagen de vista previa de 1200×630 por laboratorio y para la portada (`og/`), para cuando se comparte un enlace en LinkedIn. Se dibuja con satori y resvg a partir del título, el resumen y las etiquetas.
- El índice del buscador con [Pagefind](https://pagefind.app): busca en el texto completo de los laboratorios, no solo en el título.
- `sitemap-index.xml`, `robots.txt`, la página 404 y datos estructurados (JSON-LD) para buscadores.

Las capturas se abren en un visor dentro de la página (flechas para pasar, Escape para cerrar). Sin JavaScript, el enlace abre la imagen en una pestaña nueva.

## Probar en local

Requiere Node.js 22.23 o posterior.

```sh
npm install
npm run dev      # servidor de desarrollo en http://localhost:4321
npm run build    # genera la web y el índice del buscador en dist/
npm run preview  # sirve dist/ para probarla como en producción (el buscador solo funciona tras build)
```

## Comprobaciones

```sh
npm test                  # tipos, compilación, enlaces y pruebas en navegador
npm run test:lighthouse   # rendimiento, accesibilidad, buenas prácticas y SEO
```

- `tests/links.mjs` revisa `dist/` sin navegador: enlaces y anclas rotos, recursos que faltan, imágenes sin `alt` o sin dimensiones, un único `h1`, títulos y descripciones duplicados.
- `tests/browser.mjs` abre un Chrome real (usa `CHROME_PATH` si Chrome no está en la ruta habitual): pasa axe (WCAG 2.2 AA) por todas las páginas y prueba el buscador, el filtro, el visor con teclado, el diseño a 390 px y la 404.
- `lighthouserc.cjs` exige 90 en rendimiento, 95 en buenas prácticas y 100 en accesibilidad y SEO.

GitHub Actions ejecuta todo esto en cada cambio y en cada pull request. Solo publica si todo pasa.

## Añadir un laboratorio

1. Copia las capturas en `public/` con el nombre `shot-<laboratorio>-<número>.webp`.
2. Crea `src/content/labs/<laboratorio>.md`. El nombre del archivo da la URL: `nibbles.md` se publica como `lab-nibbles.html`.
3. Escribe la ficha y el recorrido:

```md
---
title: "Nibbles"
system: "Linux"          # Linux o Windows
number: 14               # número que aparece en la tarjeta
order: 15                # posición en la portada
summary: "Acceso a Nibbleblog, subida de archivos y escalada mediante un script."
tags: ["Web", "Subida de archivos", "Sudo"]
keywords: "palabras extra para el buscador"
---

## Reconocimiento

Empezamos con Nmap y vemos los puertos `22` y `80`...

![Nibbles: reconocimiento, captura 1](/shot-nibbles-01.webp)
```

Cada imagen que va sola en un párrafo se convierte en una captura ampliable, con sus dimensiones calculadas al compilar. Si añades un texto entre comillas tras la ruta, sale como pie de foto: `![alt](/captura.webp "Pie de foto")`.

### Cadena de ataque (MITRE ATT&CK)

Cada laboratorio puede indicar qué técnicas usa en cada sección. Salen como línea de tiempo al principio de la página y alimentan la matriz de la portada:

```yaml
cadena:
  - seccion: "Reconocimiento"        # texto exacto de un título ## del writeup
    tecnicas: ["T1595", "T1595.003"]
  - seccion: "Acceso inicial"
    tecnicas: ["T1190", "T1505.003"]
```

Las técnicas tienen que estar en `src/lib/attack.ts` (ID, nombre oficial y táctica). Si falta una o el título de sección no existe, la compilación falla y dice cuál es.

Campos opcionales: `plataforma` (sale como insignia en la miniatura), `cardTitle` y `cardSummary` (si la tarjeta lleva un texto distinto al de la página), `kind` (por defecto «Laboratorio»), `eyebrow`, `pageTitle`, `description`, `tagLine` y `readLabel`. El esquema completo está en `src/content.config.ts`.

## Añadir un proyecto

Igual que un laboratorio, en `src/content/proyectos/`. Se publica como `proyecto-<nombre>.html` y aparece en la sección «Proyectos» de la portada. Mira `observatorio.md` como ejemplo.

## Estructura

```text
src/content/labs/        laboratorios en Markdown
src/content/proyectos/   proyectos en Markdown
src/pages/index.astro    portada
src/pages/[page].astro   plantilla de laboratorios y proyectos
src/layouts/Base.astro   cabecera, pie y metadatos comunes
src/pages/etiqueta-[tag].astro   páginas por etiqueta
src/pages/og/            imágenes de vista previa
src/components/          tarjeta de laboratorio
src/lib/                 plugin de capturas y utilidades comunes
public/                  capturas, estilos, favicon, buscador (script.js) y visor (visor.js)
```

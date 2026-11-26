# Portfolio de Daniel Escolar

Ciberseguridad, desarrollo web, proyectos propios y laboratorios explicados paso a paso, con capturas propias.

https://daniscv15.github.io/

Hecho con [Astro](https://astro.build). Cada laboratorio y cada proyecto es un archivo Markdown; la portada, los contadores y las tarjetas se generan a partir de ellos. GitHub Actions compila la web y la publica en GitHub Pages con cada cambio en `main`.

## Probar en local

Requiere Node.js 22.23 o posterior.

```sh
npm install
npm run dev      # servidor de desarrollo en http://localhost:4321
npm run build    # genera la web en dist/
```

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

Campos opcionales: `cardTitle` y `cardSummary` (si la tarjeta lleva un texto distinto al de la página), `kind` (por defecto «Laboratorio»), `eyebrow`, `pageTitle`, `description`, `tagLine` y `readLabel`. El esquema completo está en `src/content.config.ts`.

## Añadir un proyecto

Igual que un laboratorio, en `src/content/proyectos/`. Se publica como `proyecto-<nombre>.html` y aparece en la sección «Proyectos» de la portada. Mira `observatorio.md` como ejemplo.

## Estructura

```text
src/content/labs/        laboratorios en Markdown
src/content/proyectos/   proyectos en Markdown
src/pages/index.astro    portada
src/pages/[page].astro   plantilla de laboratorios y proyectos
src/layouts/Base.astro   cabecera, pie y metadatos comunes
src/lib/                 plugin que convierte imágenes en capturas ampliables
public/                  capturas, estilos, favicon y script del buscador
```

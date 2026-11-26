---
title: "Paper"
system: "Linux"
kind: "Laboratorio"
number: 17
order: 18
summary: "Enumeración web, lectura de información mediante un bot y escalada con Polkit."
tags: ["Web", "Bot", "Polkit"]
keywords: "paper paper web · bot · polkit enumeración web, lectura de información mediante un bot y escalada con polkit."
---

## La pista estaba en las cabeceras

Empezamos enumerando los servicios y revisando la web. Solo aparece una página por defecto de Apache, pero al consultar las cabeceras del puerto `80` encontramos una referencia a `office.paper`. Añadimos el dominio a `/etc/hosts` y llegamos a un blog de WordPress. Uno de los comentarios menciona borradores, así que revisamos la versión con WPScan y buscamos información sobre la exposición de ese contenido.

![Paper: la pista estaba en las cabeceras, captura 1](/shot-paper-01.webp)

![Paper: la pista estaba en las cabeceras, captura 2](/shot-paper-02.webp)

![Paper: la pista estaba en las cabeceras, captura 3](/shot-paper-03.webp)

La prueba nos permite leer borradores que no deberían ser públicos. En ellos aparece un enlace de invitación a un chat interno. Añadimos el nuevo dominio a `/etc/hosts` y nos registramos.

![Paper: la pista estaba en las cabeceras, captura 5](/shot-paper-05.webp)

## Hablando con Recyclops

En el chat encontramos un bot llamado `Recyclops` que puede listar archivos. En la conversación general solo tenemos lectura, pero podemos abrirle un mensaje privado y probar ahí sus funciones.

![Paper: hablando con recyclops, captura 8](/shot-paper-08.webp)

![Paper: hablando con recyclops, captura 9](/shot-paper-09.webp)

Le pedimos que liste su directorio de trabajo y después probamos a salir de la ruta esperada. Además de listar, puede mostrar el contenido de archivos con su función `file`.

## Credenciales en el entorno del bot

Revisando el proyecto de Hubot encontramos `.env`. Pedimos al bot que lo lea y aparecen credenciales. Las probamos por SSH y podemos entrar en el sistema.

![Paper: credenciales en el entorno del bot, captura 11](/shot-paper-11.webp)

![Paper: credenciales en el entorno del bot, captura 12](/shot-paper-12.webp)

## Escalada con Polkit

Después de revisar el sistema sin encontrar una vía clara, utilizo LinPEAS. Entre sus resultados aparece una versión de Polkit que investigamos para la escalada. El script que utilizamos crea un usuario con permisos de sudo. Cambiamos a ese usuario y, desde ahí, elevamos la sesión a root.

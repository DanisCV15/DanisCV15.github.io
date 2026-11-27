---
title: "Symfonos 6 · Hack4u"
system: "Linux"
kind: "Laboratorio"
number: 22
order: 23
summary: "Laboratorio guiado con aplicación web, API y escalada mediante Go con sudo."
tags: ["Web", "API", "Go"]
keywords: "symfono hack4u symfonos 6 · hack4u web · api · go laboratorio guiado con aplicación web, api y escalada mediante go con sudo."
cadena:
  - seccion: "Enumerando los servicios"
    tecnicas: ["T1595", "T1595.003"]
  - seccion: "XSS en Flyspray"
    tecnicas: ["T1059.007", "T1552"]
  - seccion: "Revisando el código del blog"
    tecnicas: ["T1078"]
  - seccion: "La API como puente"
    tecnicas: ["T1190"]
  - seccion: "Acceso como achilles"
    tecnicas: ["T1078", "T1098.004"]
  - seccion: "Go con sudo"
    tecnicas: ["T1548.003", "T1548.001"]
---

## Enumerando los servicios

En este laboratorio del curso de Hack4u encontramos SSH, MariaDB y servicios HTTP en los puertos `80`, `3000` y `5000`. La web principal no da mucha información, así que enumeramos rutas hasta llegar a `/posts`. En el contenido aparece `achilles`, que comprobamos como posible usuario. También revisamos el servicio Git del puerto `3000` y la aplicación del `5000`, aunque todavía no podemos aprovecharlos.

## XSS en Flyspray

Cambiando el diccionario de enumeración encontramos Flyspray. Buscamos información sobre la versión y localizamos un problema en el campo `real name`. El primer `alert` no funciona. Revisando la prueba de concepto veo que hay que cerrar primero el contexto HTML con `">`. Repetimos la prueba y esta vez se ejecuta el JavaScript.

![Symfono Hack4u: xss en flyspray, captura 6](/shot-symfono-hack4u-06.webp)

![Symfono Hack4u: xss en flyspray, captura 7](/shot-symfono-hack4u-07.webp)

En una tarea aparece un comentario del administrador indicando que revisa los reportes. Aprovechamos ese recorrido para cargar un JavaScript desde nuestro equipo y hacer que su sesión cree un usuario administrador. Comprobamos que el usuario se ha creado y entramos. Ahora podemos leer un hilo que antes no veíamos; contiene las credenciales de Git.

![Symfono Hack4u: xss en flyspray, captura 9](/shot-symfono-hack4u-09.webp)

![Symfono Hack4u: xss en flyspray, captura 10](/shot-symfono-hack4u-10.webp)

![Symfono Hack4u: xss en flyspray, captura 11](/shot-symfono-hack4u-11.webp)

## Revisando el código del blog

Con acceso a los repositorios empezamos por el blog. En `index.php` encontramos un `preg_replace` con el modificador `/e`, que evalúa el resultado de la sustitución como PHP. La pregunta ahora es cómo controlar el texto que llega hasta ahí.

![Symfono Hack4u: revisando el código del blog, captura 14](/shot-symfono-hack4u-14.webp)

También aparecen credenciales de MariaDB, pero el servidor no acepta nuestra conexión remota. Seguimos con el repositorio de la API.

## La API como puente

Leyendo el código Go reconstruimos las rutas y comprobamos primero el endpoint `/ping`. Después revisamos la autenticación: espera usuario y contraseña en JSON y devuelve un token.

![Symfono Hack4u: la api como puente, captura 19](/shot-symfono-hack4u-19.webp)

![Symfono Hack4u: la api como puente, captura 20](/shot-symfono-hack4u-20.webp)

![Symfono Hack4u: la api como puente, captura 21](/shot-symfono-hack4u-21.webp)

![Symfono Hack4u: la api como puente, captura 22](/shot-symfono-hack4u-22.webp)

Con ese token podemos consultar `/posts` y modificar el campo `text` mediante `PATCH`. Hacemos primero una prueba con un texto sencillo y comprobamos el cambio en la web.

![Symfono Hack4u: la api como puente, captura 26](/shot-symfono-hack4u-26.webp)

Ya podemos unir las dos piezas: la API escribe el contenido y el blog lo procesa con el `preg_replace` vulnerable. Preparamos el PHP para crear un archivo desde el que ejecutar comandos y, después, nos mandamos una reverse shell.

![Symfono Hack4u: la api como puente, captura 27](/shot-symfono-hack4u-27.webp)

![Symfono Hack4u: la api como puente, captura 28](/shot-symfono-hack4u-28.webp)

## Acceso como achilles

Dentro del sistema probamos las credenciales que ya teníamos y podemos cambiar al usuario `achilles`. Para trabajar por SSH generamos un par de claves y añadimos la pública a `authorized_keys`, con los permisos correspondientes.

![Symfono Hack4u: acceso como achilles, captura 29](/shot-symfono-hack4u-29.webp)

## Go con sudo

Revisamos `sudo -l` y vemos que podemos ejecutar Go como root. Con `go run` podemos lanzar nuestro propio programa, así que lo preparamos en `/tmp` para dar a Bash el permiso SUID.

![Symfono Hack4u: go con sudo, captura 30](/shot-symfono-hack4u-30.webp)

Ejecutamos el programa mediante sudo y después abrimos Bash con `bash -p`.

![Symfono Hack4u: go con sudo, captura 33](/shot-symfono-hack4u-33.webp)

Ya tenemos una shell privilegiada.

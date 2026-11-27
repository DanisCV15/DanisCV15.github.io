---
title: "Nunchucks"
system: "Linux"
kind: "Laboratorio"
number: 15
order: 16
summary: "De una plantilla Nunjucks a ejecutar comandos como root con Perl."
tags: ["SSTI", "Perl", "Capabilities"]
keywords: "nunchucks nunchucks ssti · perl · capabilities de una plantilla nunjucks a ejecutar comandos como root con perl."
cadena:
  - seccion: "Buscando otra entrada en la web"
    tecnicas: ["T1595.003"]
  - seccion: "Inyección en Nunjucks"
    tecnicas: ["T1190", "T1059.004"]
  - seccion: "La capability de Perl"
    tecnicas: ["T1548"]
  - seccion: "Revisando AppArmor"
    tecnicas: ["T1518.001"]
---

## Buscando otra entrada en la web

Nmap nos muestra los puertos `22`, `80` y `443`. Añadimos el dominio a `/etc/hosts` y revisamos la web. Como no encuentro nada claro, sigo enumerando directorios y subdominios. Llegamos a una página con un formulario para dejar un correo. Al enviar una dirección de prueba vemos que la aplicación la devuelve dentro del mensaje de respuesta.

![Nunchucks: buscando otra entrada en la web, captura 1](/shot-nunchucks-01.webp)

![Nunchucks: buscando otra entrada en la web, captura 2](/shot-nunchucks-02.webp)

## Inyección en Nunjucks

La entrada se está reflejando, así que probamos una expresión de plantilla. La aplicación la evalúa: tenemos una SSTI.

![Nunchucks: inyección en nunjucks, captura 3](/shot-nunchucks-03.webp)

Revisamos las tecnologías y buscamos una forma de ejecutar comandos a través de Nunjucks. Llevamos la petición a Burp Suite y preparamos el payload.

![Nunchucks: inyección en nunjucks, captura 4](/shot-nunchucks-04.webp)

Pruebo varias reverse shells. En mi caso, la que funciona es la que utiliza `mkfifo`. Recibimos la conexión como `david` y empezamos a enumerar el sistema.

## La capability de Perl

Encontramos una capability interesante en Perl. Consultando GTFOBins vemos cómo utilizarla para cambiar el UID y ejecutar un comando con privilegios elevados.

![Nunchucks: la capability de perl, captura 5](/shot-nunchucks-05.webp)

![Nunchucks: la capability de perl, captura 6](/shot-nunchucks-06.webp)

Al intentar abrir una shell no conseguimos el resultado esperado. Para separar el cambio de usuario del problema de la shell, probamos a ejecutar solo `whoami`.

![Nunchucks: la capability de perl, captura 7](/shot-nunchucks-07.webp)

Esta vez la salida es `root`. La capability permite ejecutar comandos con UID 0, aunque la shell interactiva no llega por esa misma vía.

## Revisando AppArmor

Buscamos qué puede estar limitando la ejecución y encontramos una configuración de AppArmor relacionada con Perl.

![Nunchucks: revisando apparmor, captura 8](/shot-nunchucks-08.webp)

El siguiente camino que investigamos es invocar un script mediante su shebang para estudiar esa restricción. Hasta aquí hemos confirmado lo esencial de la prueba: podemos ejecutar un comando como root a través de Perl.

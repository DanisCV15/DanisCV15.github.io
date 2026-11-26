---
title: "Perfection"
system: "Linux"
kind: "Laboratorio"
number: 18
order: 19
summary: "Inyección en una plantilla Ruby y escalada tras el acceso inicial."
tags: ["SSTI", "Ruby", "Sudo"]
keywords: "perfection perfection ssti · ruby · sudo inyección en una plantilla ruby y escalada tras el acceso inicial."
---

## Una calculadora hecha en Ruby

Nmap muestra los puertos `22` y `80`. Revisando la web encontramos información sobre el framework y vemos que la aplicación está hecha en Ruby.

![Perfection: una calculadora hecha en ruby, captura 1](/shot-perfection-01.webp)

La parte que más me interesa es una calculadora de notas con varios campos de entrada. Llevo la petición a Burp Suite y pruebo una inyección de plantilla.

## Saltando la validación

El primer intento se bloquea. Seguimos probando hasta encontrar una forma de introducir un salto de línea que permite superar la comprobación. Esta vez la aplicación evalúa la multiplicación que enviamos.

![Perfection: saltando la validación, captura 2](/shot-perfection-02.webp)

![Perfection: saltando la validación, captura 3](/shot-perfection-03.webp)

Con la ejecución de Ruby confirmada, probamos a leer `/etc/passwd`. La salida aparece en la respuesta, así que ya tenemos una vía para ejecutar código.

![Perfection: saltando la validación, captura 5](/shot-perfection-05.webp)

## Reverse shell

Preparamos un payload con una función de Ruby para ejecutar el comando de conexión y nos ponemos en escucha en el puerto `443`.

![Perfection: reverse shell, captura 7](/shot-perfection-07.webp)

Recibimos la shell y tratamos la terminal. A partir de aquí seguimos revisando los archivos del sistema para encontrar información que nos permita avanzar.

## Acceso a root

Durante esa revisión encontramos información útil para obtener la contraseña de `susan`.

![Perfection: acceso a root, captura 8](/shot-perfection-08.webp)

Comprobamos sus permisos y vemos que pertenece al grupo `sudo`. Con la contraseña podemos elevar la sesión y entrar como root.

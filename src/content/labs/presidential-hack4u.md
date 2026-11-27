---
title: "Presidential · Hack4u"
system: "Linux"
kind: "Laboratorio"
number: 20
order: 21
summary: "Enumeración web, acceso inicial y abuso de una capability de lectura."
tags: ["Web", "Capabilities", "SSH"]
keywords: "presidential hack4u presidential · hack4u web · capabilities · ssh enumeración web, acceso inicial y abuso de una capability de lectura."
cadena:
  - seccion: "Reconocimiento y virtual hosts"
    tecnicas: ["T1595", "T1595.003"]
  - seccion: "Un archivo de copia accesible"
    tecnicas: ["T1552.001"]
  - seccion: "De phpMyAdmin a una shell"
    tecnicas: ["T1190", "T1110.002"]
  - seccion: "El usuario admin y las capabilities"
    tecnicas: ["T1548", "T1552.004", "T1021.004"]
---

## Reconocimiento y virtual hosts

Localizamos la máquina con `arp-scan` y hacemos el escaneo de puertos. Encontramos HTTP en el `80` y otro servicio en el `2082`.

![Presidential Hack4u: reconocimiento y virtual hosts, captura 1](/shot-presidential-hack4u-01.webp)

WhatWeb nos da una pista sobre un dominio `.local`. Lo añadimos a `/etc/hosts` y seguimos enumerando. Aparece `/cgi-bin`, pero las pruebas por esa vía no nos permiten avanzar. Probamos también virtual hosts. Tras cambiar de diccionario encontramos `datasafe.votenow.local`, que nos lleva a phpMyAdmin. Las credenciales habituales no funcionan.

![Presidential Hack4u: reconocimiento y virtual hosts, captura 5](/shot-presidential-hack4u-05.webp)

## Un archivo de copia accesible

Volvemos a enumerar la web, esta vez incluyendo extensiones como `php`, `txt` y `bak`. Aparecen `config.php` y `config.php.bak`. El primero no muestra contenido porque el servidor interpreta el PHP. La copia, en cambio, nos deja leer el código y encontrar unas credenciales.

![Presidential Hack4u: un archivo de copia accesible, captura 7](/shot-presidential-hack4u-07.webp)

![Presidential Hack4u: un archivo de copia accesible, captura 8](/shot-presidential-hack4u-08.webp)

![Presidential Hack4u: un archivo de copia accesible, captura 9](/shot-presidential-hack4u-09.webp)

## De phpMyAdmin a una shell

Las credenciales funcionan en phpMyAdmin. Revisamos la versión y encontramos una combinación de inclusión de archivos y ejecución de PHP. Antes de lanzar la reverse shell hago una prueba sencilla: envío un `SELECT` con una cadena y compruebo que puedo verla a través de la inclusión del archivo de sesión. Después sustituyo la cadena por código PHP.

![Presidential Hack4u: de phpmyadmin a una shell, captura 12](/shot-presidential-hack4u-12.webp)

![Presidential Hack4u: de phpmyadmin a una shell, captura 13](/shot-presidential-hack4u-13.webp)

Recibimos la shell. También revisamos la base de datos y encontramos un hash de contraseña. Lo pasamos a John mientras tratamos la terminal y seguimos enumerando.

## El usuario admin y las capabilities

Cuando recuperamos la contraseña podemos cambiar al usuario `admin`. Revisamos sus grupos, permisos SUID y sudo, pero por ahí no aparece nada útil.

![Presidential Hack4u: el usuario admin y las capabilities, captura 15](/shot-presidential-hack4u-15.webp)

Seguimos con las capabilities y encontramos `cap_dac_read_search` en un binario de `tar`. Ese permiso nos permite leer archivos saltándonos las restricciones habituales.

![Presidential Hack4u: el usuario admin y las capabilities, captura 16](/shot-presidential-hack4u-16.webp)

Lo utilizamos para crear un archivo comprimido con la clave privada de root, lo extraemos y restringimos los permisos de la clave. Después probamos la conexión SSH local por el puerto `2082`:

```bash
ssh -i id_rsa root@localhost -p 2082
```

![Presidential Hack4u: el usuario admin y las capabilities, captura 17](/shot-presidential-hack4u-17.webp)

El acceso funciona. Ya somos root.

---
title: "Bank"
system: "Linux"
kind: "Laboratorio"
number: 2
order: 3
summary: "Enumeración web, subida de archivos y abuso de un binario SUID."
tags: ["Web", "SUID"]
keywords: "bank bank web · suid enumeración web, subida de archivos y abuso de un binario suid."
cadena:
  - seccion: "Reconocimiento de la web"
    tecnicas: ["T1595", "T1590.002", "T1595.003"]
  - seccion: "Una redirección que deja contenido detrás"
    tecnicas: ["T1190"]
  - seccion: "Acceso inicial"
    tecnicas: ["T1505.003", "T1552.001"]
  - seccion: "Escalada de privilegios"
    tecnicas: ["T1548.001"]
---

## Reconocimiento de la web

Empezamos con Nmap y vemos los puertos `22`, `53` y `80`. Por la IP solo aparece la página por defecto de Apache. Como también tenemos DNS, probamos una transferencia de zona usando `bank.htb` como dominio y encontramos varios nombres que añadimos a `/etc/hosts`.

![Bank: reconocimiento de la web, captura 1](/shot-bank-01.webp)

Al acceder por el dominio ya vemos la aplicación del banco. Probamos credenciales habituales, pero no conseguimos entrar, así que pasamos a enumerar directorios y extensiones.

## Una redirección que deja contenido detrás

Me llama la atención `support.php`: devuelve una redirección al login, pero la respuesta también contiene información de la página. La interceptamos con Burp Suite y cambiamos el estado `302` por `200` para poder verla en el navegador.

![Bank: una redirección que deja contenido detrás, captura 4](/shot-bank-04.webp)

![Bank: una redirección que deja contenido detrás, captura 5](/shot-bank-05.webp)

La aplicación ya estaba enviando ese contenido antes de redirigirnos. Revisándolo encontramos que acepta archivos `.htb` y los interpreta como PHP.

![Bank: una redirección que deja contenido detrás, captura 6](/shot-bank-06.webp)

## Acceso inicial

Subimos una web shell con esa extensión. Aunque `/uploads` devuelve un `403` al intentar listar el directorio, podemos abrir el archivo si conocemos su nombre. Probamos con `id` y vemos que hay ejecución de comandos; a partir de ahí nos mandamos una reverse shell.

![Bank: acceso inicial, captura 7](/shot-bank-07.webp)

![Bank: acceso inicial, captura 8](/shot-bank-08.webp)

También encontramos otra entrada al panel: en un directorio de cuentas bancarias, uno de los archivos conserva las credenciales en claro. Esa vía nos lleva a la misma funcionalidad de subida de archivos.

## Escalada de privilegios

Ya dentro del sistema, buscamos binarios SUID. Aparece uno que pertenece a root y no encaja con los habituales. Lo ejecutamos para comprobar qué hace y nos devuelve una shell privilegiada.

![Bank: escalada de privilegios, captura 10](/shot-bank-10.webp)

![Bank: escalada de privilegios, captura 11](/shot-bank-11.webp)

Ya somos root.

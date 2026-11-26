---
title: "Nibbles"
system: "Linux"
kind: "Laboratorio"
number: 14
order: 15
summary: "Acceso a Nibbleblog, subida de archivos y escalada mediante un script."
tags: ["Web", "Subida de archivos", "Sudo"]
keywords: "nibbles nibbles web · subida de archivos · sudo acceso a nibbleblog, subida de archivos y escalada mediante un script."
---

## Un comentario en el código fuente

El escaneo muestra los puertos `22` y `80`. La página parece no tener nada más que un “Hello world”, pero en el código fuente aparece una referencia a `/nibbleblog/`. Vamos a esa ruta y encontramos el blog. Enumerando con Gobuster llegamos al panel `admin.php`. Encontramos el usuario `admin` durante la revisión y probamos `nibbles` como contraseña. Podemos entrar.

## Subida de archivos

Con acceso al panel identificamos la versión de Nibbleblog y revisamos una vulnerabilidad de subida de archivos. Consulto una prueba de concepto para entender qué rutas utiliza y hago el proceso de forma manual. Una vez subido el archivo PHP, comprobamos que se interpreta y nos permite ejecutar comandos. Lo usamos para recibir una reverse shell.

## El script permitido en sudo

Dentro de la máquina revisamos `sudo -l`. Tenemos permiso para ejecutar un script situado en una ruta que podemos preparar con nuestro usuario. Creamos el directorio y el script necesarios. En el script incluimos el cambio de permisos para dejar Bash con SUID y lo ejecutamos mediante sudo. Después abrimos Bash con `-p` para mantener los privilegios. Con esto completamos la escalada.

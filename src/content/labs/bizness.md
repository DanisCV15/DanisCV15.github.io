---
title: "Bizness"
system: "Linux"
kind: "Laboratorio"
number: 3
order: 4
summary: "Explotación web y análisis de datos de Apache Derby para alcanzar root."
tags: ["Web", "Hashes"]
keywords: "bizness bizness web · hashes explotación web y análisis de datos de apache derby para alcanzar root."
cadena:
  - seccion: "Encontrando la aplicación"
    tecnicas: ["T1595", "T1595.003"]
  - seccion: "Acceso inicial"
    tecnicas: ["T1190"]
  - seccion: "Los datos de Derby"
    tecnicas: ["T1083", "T1552.001"]
  - seccion: "Recuperando la contraseña"
    tecnicas: ["T1110.002"]
---

## Encontrando la aplicación

El escaneo nos muestra los puertos `22`, `80` y `443`. La web utiliza un nombre de dominio, así que lo añadimos a `/etc/hosts`. Después nos redirige a HTTPS. Como a simple vista no encuentro nada interesante, empiezo a enumerar rutas. Hay bastantes respuestas `302`; siguiendo las redirecciones con `wfuzz` termino llegando a `content`, donde aparece el panel de Apache OFBiz.

## Acceso inicial

Primero pruebo las credenciales por defecto, sin éxito. Después busco vulnerabilidades de autenticación y encuentro una prueba de concepto que permite llegar a una ruta vulnerable e inyectar comandos. En ese momento aún no había identificado la versión exacta de OFBiz. La prueba sobre el laboratorio funciona y consigo una reverse shell.

## Los datos de Derby

Una vez dentro, reviso sudo, SUID, capabilities y archivos que puedan tener información útil. Como no veo una vía clara, utilizo LinPEAS para ampliar la enumeración. En su salida aparecen archivos de una base de datos Derby. Voy a esas rutas y me encuentro con bastantes ficheros. Al principio no tengo claro qué buscar, hasta que centro la búsqueda en las referencias a `SHA`. Con `cat * | grep SHA` localizo una entrada que contiene un hash SHA-1 con salt.

## Recuperando la contraseña

Uso un script que encontré para comprobar candidatos del diccionario `rockyou` contra ese formato de hash. Aquí no estamos descifrando el hash: estamos buscando una contraseña que produzca el mismo resultado. El script encuentra una coincidencia. Pruebo la contraseña para cambiar a root y funciona; ya puedo acceder a la flag.

---
title: "Casino Royale · Hack4u"
system: "Linux"
kind: "Laboratorio"
number: 6
order: 7
summary: "Recorrido de enumeración, acceso web y escalada mediante un ejecutable privilegiado."
tags: ["Web", "SUID", "Rutas relativas"]
keywords: "casino royale hack4u casino royale · hack4u web · suid · rutas relativas recorrido de enumeración, acceso web y escalada mediante un ejecutable privilegiado."
cadena:
  - seccion: "Reconocimiento"
    tecnicas: ["T1595", "T1595.003"]
  - seccion: "El panel de PokerMax"
    tecnicas: ["T1190"]
  - seccion: "De PokerMax a Snowfox"
    tecnicas: ["T1566.002"]
  - seccion: "Lectura de archivos con XXE"
    tecnicas: ["T1190"]
  - seccion: "Del FTP a una shell"
    tecnicas: ["T1078", "T1505.003", "T1552.001"]
  - seccion: "El ejecutable SUID"
    tecnicas: ["T1548.001", "T1574"]
---

## Reconocimiento

En este laboratorio del curso de Hack4u empezamos localizando la máquina con `arp-scan` y comprobando la conectividad. Después hacemos un escaneo completo de puertos y otro de servicios con Nmap.

![Casino Royale Hack4u: reconocimiento, captura 4](/shot-casino-royale-hack4u-04.webp)

Encontramos FTP, SMTP y dos servicios web. El FTP no permite acceso anónimo. En la web del puerto `80` revisamos `robots.txt` y las rutas que señala; en el `8081` aparece una función de recogida de datos. Todavía no tenemos una entrada clara, así que seguimos enumerando.

## El panel de PokerMax

La enumeración web nos lleva a phpMyAdmin y a varias rutas de la aplicación. Las credenciales habituales no funcionan en phpMyAdmin. En `/install`, en cambio, encontramos la versión `0.13` de PokerMax.

![Casino Royale Hack4u: el panel de pokermax, captura 13](/shot-casino-royale-hack4u-13.webp)

Buscando esa versión en Searchsploit encontramos una forma de saltar la autenticación del panel. La aplicación confía en una cookie que podemos establecer desde el navegador:

```js
javascript:document.cookie = "ValidUserAdmin=admin";
```

Después accedemos a `/pokeradmin/configure.php` y podemos entrar como administrador.

![Casino Royale Hack4u: el panel de pokermax, captura 17](/shot-casino-royale-hack4u-17.webp)

## De PokerMax a Snowfox

Revisando los jugadores encontramos información en el perfil de `valenka`: un dominio y una pista sobre su correo. Añadimos el nombre a `/etc/hosts` y llegamos a una instalación de Snowfox CMS.

![Casino Royale Hack4u: de pokermax a snowfox, captura 18](/shot-casino-royale-hack4u-18.webp)

![Casino Royale Hack4u: de pokermax a snowfox, captura 19](/shot-casino-royale-hack4u-19.webp)

Encontramos una vulnerabilidad CSRF que permite crear un usuario administrador si conseguimos que un usuario autenticado visite nuestra página. Preparamos el HTML, lo servimos desde nuestro equipo y enviamos el enlace a `valenka` a través del SMTP del laboratorio. Vemos la petición en nuestro servidor HTTP y comprobamos que se ha creado el usuario. Ya podemos entrar a Snowfox.

![Casino Royale Hack4u: de pokermax a snowfox, captura 21](/shot-casino-royale-hack4u-21.webp)

## Lectura de archivos con XXE

En otro perfil aparece una ruta que, a simple vista, no muestra nada. El código fuente nos da la pista: acepta una estructura XML con credenciales. Llevamos la petición a Burp Suite y probamos una entidad externa que apunte a `/etc/passwd`.

![Casino Royale Hack4u: lectura de archivos con xxe, captura 27](/shot-casino-royale-hack4u-27.webp)

![Casino Royale Hack4u: lectura de archivos con xxe, captura 28](/shot-casino-royale-hack4u-28.webp)

La respuesta devuelve el archivo. Entre los usuarios aparece `ftpUserULTRA`, así que volvemos al FTP. En esta parte del curso se proporciona la contraseña para evitar esperar a una búsqueda larga con Hydra.

## Del FTP a una shell

Con acceso al FTP subimos un archivo PHP usando la extensión `.php3`, porque `.php` no está permitida. El archivo aparece en `/ultra-access-view`, pero al principio no conseguimos ver la salida. Revisamos sus permisos, los ajustamos y ya podemos ejecutar `id` desde la web.

![Casino Royale Hack4u: del ftp a una shell, captura 33](/shot-casino-royale-hack4u-33.webp)

Desde esa ejecución nos mandamos una reverse shell y tratamos la terminal. Revisando los archivos de configuración encontramos unas credenciales de base de datos que también sirven para cambiar al usuario `valenka`.

## El ejecutable SUID

El historial del usuario nos hace revisar tareas programadas y temporizadores, pero no encontramos nada aprovechable. Seguimos con los binarios SUID y aparece un ejecutable que pertenece a root.

![Casino Royale Hack4u: el ejecutable suid, captura 35](/shot-casino-royale-hack4u-35.webp)

Al ejecutarlo intenta llamar a `run.sh`. Con `strings` vemos que usa una ruta relativa, así que podemos preparar nuestro propio archivo en `/tmp` y hacer que abra una Bash privilegiada.

![Casino Royale Hack4u: el ejecutable suid, captura 38](/shot-casino-royale-hack4u-38.webp)

![Casino Royale Hack4u: el ejecutable suid, captura 39](/shot-casino-royale-hack4u-39.webp)

Con esa shell podemos acceder a `/root/flag`. Máquina lista.

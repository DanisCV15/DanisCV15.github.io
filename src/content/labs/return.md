---
title: "Return"
system: "Windows"
kind: "Laboratorio"
number: 21
order: 22
summary: "Obtención de acceso WinRM y abuso de permisos sobre servicios."
tags: ["WinRM", "Server Operators"]
keywords: "return return winrm · server operators obtención de acceso winrm y abuso de permisos sobre servicios."
cadena:
  - seccion: "La configuración de la impresora"
    tecnicas: ["T1595", "T1552"]
  - seccion: "Acceso por WinRM"
    tecnicas: ["T1078", "T1021.006"]
  - seccion: "Los permisos de Server Operators"
    tecnicas: ["T1543.003", "T1105"]
---

## La configuración de la impresora

Nmap nos muestra varios servicios de Windows. Primero intento enumerar SMB con NetExec, SMBMap y SMBClient, pero no consigo avanzar sin credenciales. Paso a la web y encuentro un panel de impresora. En `Settings` podemos cambiar la dirección del servidor al que se conecta.

![Return: la configuración de la impresora, captura 1](/shot-return-01.webp)

![Return: la configuración de la impresora, captura 2](/shot-return-02.webp)

Reviso el campo de contraseña, pero los asteriscos son texto y no esconden el valor real. La otra opción es hacer que la impresora se conecte a nuestro equipo. Cambio la dirección, abro un listener y recibo una petición con usuario y contraseña.

## Acceso por WinRM

Pruebo las credenciales contra los servicios disponibles. La validación de WinRM funciona, así que entro con Evil-WinRM:

```bash
evil-winrm -i IP_OBJETIVO -u USUARIO -p CONTRASEÑA
```

![Return: acceso por winrm, captura 4](/shot-return-04.webp)

## Los permisos de Server Operators

Dentro reviso los privilegios y los grupos del usuario. Además de poder administrar la máquina por WinRM, pertenece a `Server Operators`.

![Return: los permisos de server operators, captura 5](/shot-return-05.webp)

Intento crear un servicio, pero no tengo permiso. Pruebo entonces a modificar uno existente. Subo `nc.exe` y cambio el `binPath` de `VMTools` para que ejecute Netcat y nos mande una consola.

![Return: los permisos de server operators, captura 6](/shot-return-06.webp)

Con el listener preparado, detengo y arranco el servicio. Recibo la conexión y compruebo la identidad de la nueva shell.

![Return: los permisos de server operators, captura 9](/shot-return-09.webp)

Ahora estamos ejecutando comandos como `NT AUTHORITY\SYSTEM`.

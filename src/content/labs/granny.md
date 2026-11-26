---
title: "Granny"
system: "Windows"
kind: "Laboratorio"
number: 9
order: 10
summary: "Acceso por WebDAV y escalada en un Windows Server antiguo."
tags: ["WebDAV", "Privilegios"]
keywords: "granny granny webdav · privilegios acceso por webdav y escalada en un windows server antiguo."
---

## Subida de archivos mediante WebDAV

El escaneo solo nos muestra el puerto `80`. Nmap detecta WebDAV y nos indica varios métodos disponibles. Lo revisamos también con `davtest` para comprobar qué podemos subir. No podemos cargar directamente el archivo con la extensión que queremos, pero sí tenemos habilitados `PUT` y `MOVE`. Aprovechamos eso para subir una web shell como texto y renombrarla después:

```
curl -X PUT http://IP_OBJETIVO/cmdasp.txt -T cmdasp.aspx
curl -X MOVE http://IP_OBJETIVO/cmdasp.txt -H 'Destination: http://IP_OBJETIVO/cmdasp.aspx'
```

Al visitar la nueva ruta comprobamos que el servidor interpreta el archivo y podemos ejecutar comandos.

## Acceso a una shell

Compartimos `nc.exe` desde nuestro equipo con Impacket SMB Server. Lo ejecutamos en el destino para recibir una consola y poder enumerar el sistema con más comodidad.

## Aprovechando SeImpersonatePrivilege

Con `whoami /priv` encontramos `SeImpersonatePrivilege`. Investigo JuicyPotato, pero el sistema es demasiado antiguo para esa opción. En este Windows Server 2003 utilizamos `churrasco.exe`. Transferimos el ejecutable mediante el mismo recurso SMB y lo lanzamos para que ejecute Netcat y nos envíe otra shell. Al recibirla comprobamos que ya tiene privilegios de administrador. Una cosa a tener en cuenta al movernos por esta máquina es la antigüedad del sistema: la organización de los perfiles de usuario difiere de la que solemos ver en versiones actuales de Windows.

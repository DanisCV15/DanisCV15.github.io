---
title: "Keeper"
system: "Linux"
kind: "Laboratorio"
number: 12
order: 13
summary: "Análisis de un volcado de KeePass y recuperación de acceso SSH privilegiado."
tags: ["KeePass", "SSH"]
keywords: "keeper keeper keepass · ssh análisis de un volcado de keepass y recuperación de acceso ssh privilegiado."
cadena:
  - seccion: "De Request Tracker a SSH"
    tecnicas: ["T1078.001", "T1552", "T1021.004"]
  - seccion: "Un volcado de KeePass"
    tecnicas: ["T1555.005"]
  - seccion: "La clave de root"
    tecnicas: ["T1552.004"]
---

## De Request Tracker a SSH

Empezamos con Nmap y vemos los puertos `22` y `80`. La web muestra un login de Request Tracker. Busco las credenciales por defecto y consigo entrar. Dentro reviso la administración de usuarios. En uno de los perfiles encuentro una contraseña escrita en los comentarios. La pruebo por SSH con ese usuario y funciona.

![Keeper: de request tracker a ssh, captura 3](/shot-keeper-03.webp)

![Keeper: de request tracker a ssh, captura 4](/shot-keeper-04.webp)

## Un volcado de KeePass

En el sistema encontramos un ZIP con dos archivos interesantes: una base de datos `.kdbx` y un volcado de memoria `.dmp` de KeePass. Utilizo `keepass_dump` para recuperar pistas sobre la contraseña maestra. La salida no es completa: faltan caracteres y algunos símbolos no se representan bien.

![Keeper: un volcado de keepass, captura 5](/shot-keeper-05.webp)

Buscando la expresión que se alcanza a leer encuentro una referencia que ayuda a reconstruir la contraseña. La pruebo con `kpcli` y puedo abrir la base de datos.

![Keeper: un volcado de keepass, captura 6](/shot-keeper-06.webp)

## La clave de root

Dentro de KeePass recorremos las entradas hasta encontrar la información de acceso del servidor. En las notas hay una clave privada en formato PuTTY. La exportamos y la convertimos a formato OpenSSH con `puttygen`. Después restringimos sus permisos con `chmod 600` y la usamos para conectarnos:

```bash
ssh root@10.10.11.227 -i id_rsa
```

El acceso funciona y entramos directamente como root.

---
title: "Busqueda · HTB"
system: "Linux"
kind: "Laboratorio"
number: 5
order: 6
summary: "Inyección en una aplicación, revisión de Git y abuso de una ruta relativa."
tags: ["Inyección", "Git", "SUID"]
keywords: "busqueda htb busqueda · htb inyección · git · suid inyección en una aplicación, revisión de git y abuso de una ruta relativa."
---

## La función del buscador

La web es un buscador y muestra la versión `2.4.0`. Buscando cómo funciona encuentro que utiliza `eval()` de una forma que permite introducir código Python. Pruebo primero una inyección sencilla para ejecutar `id`:

```
')+ str(__import__('os').system('id'))#
```

La prueba funciona. Para mandarme la reverse shell codifico el comando en Base64, lo decodifico en el destino y lo paso a Bash. De esta forma evito los problemas de comillas que me estaba dando la entrada.

## Credenciales en Git

Entramos como `svc`. Revisando el proyecto en `/var/www/app`, encontramos el directorio oculto `.git`. Su configuración contiene credenciales y una referencia a un subdominio de Gitea. Las probamos en la aplicación y podemos entrar. El repositorio del administrador sigue siendo privado, así que seguimos mirando. También pruebo la contraseña encontrada con `svc` por SSH y funciona.

## Revisando el script de sudo

Ahora que tenemos la contraseña, podemos revisar los permisos de sudo. Hay un script que permite consultar información de contenedores. Una de sus opciones acepta un formato de salida, lo que nos permite inspeccionar la configuración de uno de ellos y encontrar más credenciales. Con esas credenciales entramos en Gitea como administrador. Esta vez sí podemos leer su proyecto y revisar el código del script que estamos ejecutando con sudo.

## Una ruta relativa

Entre sus opciones vemos una llamada a un archivo `.sh` sin ruta absoluta. Ese es el detalle que necesitábamos: podemos colocar nuestro propio archivo en el directorio desde el que se hace la llamada. Lo aprovechamos para dar a Bash el permiso SUID y después la ejecutamos con `bash -p`. Con esto obtenemos una Bash privilegiada.

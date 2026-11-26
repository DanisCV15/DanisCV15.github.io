---
title: "TwoMillion"
system: "Linux"
kind: "Laboratorio"
number: 23
order: 24
summary: "Análisis de API, inyección de comandos y escalada tras revisar el entorno."
tags: ["API", "Inyección", "Kernel"]
keywords: "twomillion twomillion api · inyección · kernel análisis de api, inyección de comandos y escalada tras revisar el entorno."
---

## Consiguiendo la invitación

Nmap nos muestra SSH y HTTP. La web recrea una versión antigua de Hack The Box y pide un código de invitación para registrarnos. Revisamos el código fuente y encontramos `inviteapi.min.js`. Dentro aparece la función `makeInviteCode()`. La llamamos desde la consola y seguimos las pistas codificadas en ROT13 y Base64 hasta obtener el código.

![TwoMillion: consiguiendo la invitación, captura 4](/shot-twomillion-04.webp)

![TwoMillion: consiguiendo la invitación, captura 5](/shot-twomillion-05.webp)

![TwoMillion: consiguiendo la invitación, captura 6](/shot-twomillion-06.webp)

Vamos a `/register`. El campo de invitación está marcado como solo lectura, así que quitamos ese atributo en el inspector y completamos el registro.

## Enumeración de la API

Una vez dentro vemos que la descarga y la regeneración de la VPN utilizan una API. Empezamos a consultar sus rutas y comprobamos que debemos enviar la cookie de nuestra sesión.

![TwoMillion: enumeración de la api, captura 11](/shot-twomillion-11.webp)

Nuestro usuario no es administrador y los endpoints reservados nos rechazan. Sin embargo, una ruta de actualización responde indicando qué datos le faltan. Vamos completando la petición con JSON hasta que pide `is_admin`. Probamos a enviar ese valor como `1` y después consultamos de nuevo el estado de la cuenta. La API confirma que ahora somos administradores.

![TwoMillion: enumeración de la api, captura 17](/shot-twomillion-17.webp)

![TwoMillion: enumeración de la api, captura 18](/shot-twomillion-18.webp)

![TwoMillion: enumeración de la api, captura 19](/shot-twomillion-19.webp)

## Inyección en la generación de VPN

Con los nuevos permisos volvemos a la generación de la VPN. El nombre de usuario parece acabar dentro de un comando del sistema, así que lo probamos con una inyección sencilla.

![TwoMillion: inyección en la generación de vpn, captura 21](/shot-twomillion-21.webp)

La ejecución funciona. Preparamos la reverse shell, abrimos el listener y conseguimos entrar en la máquina.

## Credenciales en .env

Dentro revisamos el proyecto. `Database.php` no contiene la contraseña directamente, sino que la obtiene de variables de entorno. Buscamos archivos ocultos y encontramos `.env` con las credenciales de la base de datos.

![TwoMillion: credenciales en .env, captura 24](/shot-twomillion-24.webp)

![TwoMillion: credenciales en .env, captura 25](/shot-twomillion-25.webp)

![TwoMillion: credenciales en .env, captura 26](/shot-twomillion-26.webp)

Antes de seguir con MySQL pruebo si la contraseña está reutilizada para SSH. Funciona y podemos entrar con el usuario del sistema.

## La pista del correo

El mensaje de inicio avisa de correo pendiente. Al leerlo encontramos una advertencia sobre la necesidad de actualizar el kernel y una referencia a una vulnerabilidad que podría comprometer root.

![TwoMillion: la pista del correo, captura 28](/shot-twomillion-28.webp)

![TwoMillion: la pista del correo, captura 29](/shot-twomillion-29.webp)

Buscamos la prueba de concepto, la preparamos en nuestro equipo y la transferimos comprimida al destino. Después de descomprimirla seguimos los pasos necesarios para ejecutarla.

![TwoMillion: la pista del correo, captura 31](/shot-twomillion-31.webp)

La escalada funciona y obtenemos acceso como root.

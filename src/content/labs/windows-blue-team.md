---
title: "Laboratorio Windows: del evento a la respuesta"
cardTitle: "Laboratorio Windows"
system: "Windows"
kind: "Blue Team"
number: 24
order: 1
summary: "En un equipo Windows de casa comprobé qué ocurre desde que se ejecuta un proceso hasta que aparece una alerta. Después probé un análisis desde la consola y verifiqué el resultado de una tarea de parcheo."
cardSummary: "Del evento a la respuesta: detección de procesos, telemetría antivirus y verificación del parcheo."
tags: ["LimaCharlie", "Defender", "Endpoint Central"]
tagLine: "LimaCharlie · Microsoft Defender · Endpoint Central"
eyebrow: "Proyecto personal · Blue Team · Noviembre de 2026"
pageTitle: "Laboratorio Windows · Daniel Escolar"
description: "Laboratorio doméstico de Blue Team en Windows con LimaCharlie, Microsoft Defender y Endpoint Central."
readLabel: "Leer el caso"
keywords: "windows blue team soc limacharlie defender eicar edr endpoint central parcheo detección respuesta whoami"
---

## Qué quería comprobar

El objetivo del laboratorio era seguir el ciclo completo de una operación de seguridad sobre un equipo Windows propio. Quería poder señalar en qué pantalla y con qué dato se verificaba cada paso. Para eso separé la generación de actividad, su observación, una acción de respuesta y una tarea de mantenimiento.

- **LimaCharlie** fue el punto de observación de procesos y eventos de Defender, y la consola desde la que lancé el análisis.
- **Microsoft Defender** fue la fuente del evento antivirus generado durante la prueba EICAR.
- **Endpoint Central** aportó el resultado de despliegue por equipo de una tarea de actualización.
- **Xcitium EXDR** se revisó por separado, a través de su matriz de compatibilidad y su historial de instalación.

## Cómo se conectaban las piezas

```
Windows → ejecución de whoami → sensor y regla → alerta en LimaCharlie
Windows → archivo EICAR → Microsoft Defender → evento en LimaCharlie
Consola de LimaCharlie → solicitud de análisis → respuesta del sensor
Endpoint Central → tarea de actualización → resultado por equipo
```

Estas son cuatro rutas de comprobación sobre el mismo laboratorio. El parcheo fue una tarea independiente, no una acción disparada por la alerta de proceso.

## 01 · Detectar un proceso

Ejecuté `whoami` para generar una señal controlada. La regla de LimaCharlie produjo una alerta con la ruta del ejecutable y la línea de comandos. Esto permitió comprobar el recorrido del evento hasta la consola con una actividad legítima y fácil de repetir.

En la vista de detecciones revisé que la alerta correspondiera al equipo de prueba y que la ruta y la línea de comandos apuntaran a `whoami.exe`. El evento también incluía información de firma y hash. Para el objetivo de esta prueba, la evidencia decisiva era la relación entre una ejecución conocida y la alerta generada.

El contexto importa: `whoami` puede aparecer en administración normal. Para convertir esta prueba en una detección operativa, revisaría el proceso padre, el usuario y la actividad próxima en el tiempo antes de decidir qué merece escalarse.

## 02 · Verificar la telemetría de Defender

Usé EICAR como archivo de prueba. En LimaCharlie apareció un evento de actividad de Microsoft Defender cuyo detalle identificaba EICAR. La evidencia confirmaba que el evento del antivirus llegaba a la consola.

En el detalle del evento comprobé que el producto era Microsoft Defender y que la referencia de la detección correspondía a EICAR. Separé dos preguntas: si Defender produjo una señal y si esa señal llegó a la consola donde podía investigarla. La captura permite confirmar ambas para esa prueba concreta.

## 03 · Ejecutar un análisis desde la consola

El primer análisis de una carpeta devolvió un error porque el comando no aceptaba el argumento que había usado para indicar la ruta. Volví a enviarlo con la ruta como argumento posicional y la consola devolvió éxito con código de error `0`. La respuesta permitió distinguir un fallo de sintaxis de un problema de conexión con el sensor.

La primera respuesta fue un error `400` con `TASK_PARSING_FAILED` y un argumento desconocido. El sensor figuraba conectado, así que centré la comprobación en la forma del comando. El segundo intento devolvió `ERROR: 0` y la ruta objetivo. La respuesta acredita que la solicitud se procesó con éxito. La consola no aportó en esa captura un informe detallado de archivos examinados.

```
epp_scan --file_path "<carpeta de prueba>"  → argumento desconocido
epp_scan "<carpeta de prueba>"              → ERROR: 0
```

## 04 · Comprobar el parcheo por equipo

En Endpoint Central revisé la tarea de actualización automática en la vista por sistema. Para el equipo del laboratorio, esa tarea mostraba **un parche instalado, cero fallidos y cero pendientes**. Ese resultado corresponde al alcance de la tarea revisada.

Miré la fila del equipo en la vista por sistema, no solo el gráfico de resumen. Ahí estaban los contadores de instalados, fallidos y pendientes y el estado de implementación. Para cerrar un cambio de producción añadiría la identificación del parche, la comprobación local de la versión y el estado de reinicio cuando procediera.

## Evaluación adicional de Xcitium EXDR

Revisé la compatibilidad con Windows y el historial de instalación del agente. El historial mostraba una instalación completada y una entrada posterior en cola. Quedó pendiente validar las detecciones en esa plataforma.

Las entradas del historial mostraban las etapas de cola, descarga e instalación y otra entrada posterior en cola. Registré esas observaciones por separado. Para verificar la protección operativa quedaría por comprobar la versión activa, el estado del agente y la recepción de un evento de prueba.

## Una incidencia que dejé abierta

También probé una plantilla relacionada con el cierre de Bloc de notas. La consola mostró eventos de cierre, pero el registro de plataforma devolvió un error al interpretar la acción de respuesta. Eso permite separar la parte de detección de la ejecución de la acción. No di esa respuesta por validada.

## Resultados y límites de la evidencia

- **Detección:** una ejecución controlada de `whoami` apareció como alerta con campos de proceso.
- **Antivirus:** un evento de Defender asociado a EICAR se pudo inspeccionar en LimaCharlie.
- **Respuesta:** un análisis de carpeta devolvió éxito tras corregir la sintaxis. La acción de la plantilla de cierre quedó abierta.
- **Mantenimiento:** el panel confirmó un parche instalado para un equipo en la tarea observada.
- **EXDR:** se revisaron compatibilidad y estados de despliegue. La detección quedó pendiente.

## Qué me llevo del laboratorio

La alerta de `whoami` sirvió para verificar la telemetría. Para evaluar una regla destinada a un entorno real, probaría también casos legítimos y sospechosos y ajustaría el contexto de la detección. En respuesta y parcheo, buscaría siempre la confirmación de la acción y su alcance en el equipo.

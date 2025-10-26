# Prompt inicial para el desarrollo de la web

``` text
Analiza los requerimientos planteados en el fichero README.md (adjuntado en el multimodal)
Quiero que generes un prompt estructurado con los requerimientos necesarios para desarrollar una web donde se pueda seleccionar un cronometro o cuenta regresiva.
Debes definir el rol, el objetivo, delinear instrucciones sobre que ficheros editar, que lenguaje, ejemplo o formato, y la salida esperada.
Incluye placeholders para colocar el nombre del folder de destino y las imagenes de referencia que se utilizaran para el estilo visual.

Pideme detalles que necesites antes de generar el prompt.
```

_Este prompt lo utilice apoyado en la tecnica de meta prompting, donde el LLM me asiste en la creacion de un PRD o Promtp refinado con instrucciones adecuadas qeu me permitan obtener el objetivo con menor numero de iteraciones._

El LLM me solicito mas detalles, los cuales fueron enviados.

``` text
Respuestas:
1. Solo 2 ficheros. index.html y script.js vanilla. El css sera embebido.
2. stopwatch-HESM. la generare yo mismo en el proyecto.
3. Incluire 3 imágenes con el estilo visual de inicio, cronometro y cuenta regresiva. Se cargaran con el multimodal del chat. Deberan respetarse el look&feel de los ejemplos visuales.
4.Opcion A, no necesitan persistencia.
5. HH:MM:SS al llegar a 0 se detiene, muestra la notificación con el sonido.
6. Usar un beep, resuelvelo, no hay archivos externos. Mensaje de tiempo cumplido. Nada de APIs
7. Español, sin atajos, formato completo como en las imagenes.
8. Modo unico. Sin animaciones. No responsivo. Botón extra timer. Sin confirmación para borrar un timer.
9. Nada de esto.
10. Codigo del index y coding del script.js de los prompts me ocupo yo.
11. Solo para las imagenes.
```

Prompt desarrollado por el LLM, se adjuntaron 3 capturas de la web de referencias para que el llm tuviera ejemplos visuales.

``` text
Eres un experto en desarrollo frontend con foco en HTML + JavaScript vanilla y excelente criterio de UI/UX accesible.

Objetivo

Desarrollar una web de temporizadores que permita seleccionar entre cronómetro (cuenta hacia arriba) o cuenta regresiva (HH:MM:SS), con múltiples timers simultáneos en formato de tarjetas, y que al finalizar una cuenta regresiva se detenga, muestre un aviso en pantalla y reproduzca un beep sin usar archivos externos ni APIs del navegador.

El diseño debe respetar el look & feel de las imágenes de referencia provistas (estilo de inicio, cronómetro y cuenta regresiva).


⸻

Alcance y entregables
	1.	Archivos a entregar (solo 2):
	•	index.html — HTML con CSS embebido (sin styles.css separado).
	•	script.js — Lógica en JavaScript vanilla (sin TypeScript ni frameworks).
	2.	Sin librerías externas. No usar frameworks, bundlers ni CDNs.
	3.	Sin APIs del navegador para notificaciones, vibración o sonido (no Notification, no Vibration, no Web Audio API).
	•	El beep debe implementarse con un <audio> embebido mediante Data URI Base64 (WAV/MP3 mínimo) incluido en el propio HTML.
	•	La notificación al finalizar debe ser visual dentro de la página (banner/label en la tarjeta del timer), no del sistema.
	4.	Idioma de interfaz: Español.
	5.	No responsive, sin animaciones, un solo tema (no dark/light).
	6.	Sin persistencia (no LocalStorage, no URL params).
	7.	Botón “+ Añadir timer” para crear nuevas tarjetas. Sin confirmación al borrar.

⸻

Requisitos funcionales

A. Vista general
	•	Encabezado con título (ej. “Temporizadores”).
	•	Botón “+ Añadir timer”: crea una nueva tarjeta de timer.
	•	Contenedor de tarjetas: cada tarjeta representa un timer independiente.

B. Tarjeta de Timer

Cada tarjeta debe incluir:
	1.	Selector de modo:
	•	“Cronómetro” (cuenta ascendente desde 00:00:00).
	•	“Cuenta regresiva” (campo de entrada HH:MM:SS).
	2.	Visualización de tiempo en formato HH:MM:SS (con ceros a la izquierda).
	3.	Controles:
	•	Iniciar / Pausar (toggle).
	•	Reiniciar (vuelve a 00:00:00 en cronómetro; en regresiva vuelve al valor inicial ingresado).
	•	Borrar (elimina la tarjeta sin confirmación).
	4.	Cuenta regresiva:
	•	Campo de texto HH:MM:SS validado (admite 00 en horas/min/seg).
	•	Al llegar a 00:00:00:
	•	El timer se detiene.
	•	Se muestra un aviso visual en la tarjeta (ej. “Tiempo cumplido”).
	•	Se reproduce un beep por <audio> con Data URI Base64 embebido (sin archivos externos ni APIs).
	•	El estado visual debe ser claro (ej. borde o etiqueta de “Finalizado”).
	5.	Cronómetro:
	•	Inicia en 00:00:00 y cuenta hacia arriba.
	•	Reiniciar vuelve a 00:00:00.

C. Estados y validaciones
	•	Validar formato HH:MM:SS (rechazar entradas inválidas; mostrar micro-mensaje de error bajo el campo).
	•	Deshabilitar Iniciar en regresiva si el input está vacío o inválido.
	•	Manejar correctamente pausas y reinicios sin drift de tiempo (usar Date.now() para compensar).

⸻

Requisitos de UI/UX
	1.	Estilo visual: replicar el look & feel de las referencias
	•	Tipografías del sistema.
	•	Paleta y espaciados consistentes con las imágenes.
	•	Botones claros y agrupados; layout no responsive orientado a escritorio.
	2.	Accesibilidad básica:
	•	Texto de botones y labels descriptivos en español.
	•	Contraste suficiente según las imágenes de referencia.
	3.	Mensajería:
	•	Aviso en tarjeta al finalizar: “Tiempo cumplido”.
	•	Mensajes de error cortos bajo inputs (ej. “Usa formato HH:MM:SS”).

⸻

Detalles técnicos
	•	Temporización precisa:
	•	Evitar setInterval con deriva acumulada; usar una mezcla de requestAnimationFrame / setTimeout y cálculos con Date.now() para mostrar tiempo exacto.
	•	Estructura JS clara: funciones puras para formateo (formatHHMMSS), parseo (parseHHMMSS), y una pequeña “clase”/factory para cada tarjeta de timer.
	•	Audio:
	•	Incluir en index.html un <audio id="beep" preload="auto" src="data:audio/wav;base64,{{AUDIO_DATA_URI}}"></audio>.
	•	Reproducirlo al finalizar solo en cuenta regresiva (manejar errores de reproducción silenciosamente si el navegador requiere interacción previa).
	•	No usar Web Audio API.

⸻

Estructura de los archivos

1) index.html
	•	Estructura semántica básica.
	•	CSS embebido en <style> con:
	•	Layout de cabecera, contenedor de tarjetas y estilos de tarjeta.
	•	Estados (corriendo/pausado/finalizado con una clase CSS).
	•	Estilos de inputs y botones.
	•	<audio id="beep" ...> con Data URI inline.
	•	Marcadores para contenedor de tarjetas y botón global “+ Añadir timer”.

Ejemplo:
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Timer and Countdown</title>
<link rel="stylesheet" href="styles.css">
</head>
<body>
<h1>Timer and Countdown</h1>
<script src="script.js"></script>
</body>
</html>

2) script.js
	•	Utilidades:
	•	parseHHMMSS(str) -> {h,m,s} | null
	•	formatHHMMSS(totalSeconds) -> "HH:MM:SS"
	•	Factory de TimerCard (clausuras o clase):
	•	Estado: modo, tiempoInicial (regresiva), tiempoActual, running, timestamps de referencia.
	•	Métodos: start(), pause(), reset(), remove(), tick(), render()
	•	Listeners: cambio de modo, input de HH:MM:SS, clicks en botones.
	•	Lógica de fin de regresiva: setear estado finalizado, actualizar UI, reproducir beep, mostrar “Tiempo cumplido”.
	•	Gestor:
	•	Maneja el botón global “+ Añadir timer” y el contenedor donde se agregan tarjetas.
	•	Cada tarjeta se actualiza sin bloquear a las demás.

⸻

Criterios de aceptación
	1.	Puedo crear N timers con el botón “+ Añadir timer”.
	2.	Cada tarjeta permite seleccionar Cronómetro o Cuenta regresiva (con campo HH:MM:SS).
	3.	Cronómetro: inicia en 00:00:00, cuenta hacia arriba, pausa/reanuda y se reinicia a 00:00:00.
	4.	Regresiva: valida HH:MM:SS, inicia solo si válido; al llegar a 00:00:00 se detiene, muestra “Tiempo cumplido” en la tarjeta y suena un beep vía <audio> embebido.
	5.	Borrar elimina la tarjeta al instante (sin confirmación).
	6.	Sin APIs de notificación, vibración o Web Audio; sin archivos externos de audio; sin librerías/frameworks; CSS embebido; no responsive.
	7.	UI en español, con labels y mensajes claros; formato HH:MM:SS en todo momento.

⸻

Formato de salida requerido

Responde únicamente con dos bloques de código en este orden y estos nombres:
	1.	Bloque index.html (con HTML completo y <style> embebido + <audio> con Data URI).
	2.	Bloque script.js (con toda la lógica).

No incluyas texto fuera de esos dos bloques. No adjuntes capturas ni comentarios adicionales.

⸻

Ajusta tipografías, tamaños, espaciados, bordes y colores para que la UI final coincida visualmente con las imágenes provistas.

⸻

Ejemplos de textos en español (usa exactamente estas etiquetas)
	•	Botón global: “+ Añadir timer”
	•	Selector de modo: “Modo”, opciones “Cronómetro”, “Cuenta regresiva”
	•	Placeholder input: “HH:MM:SS”
	•	Botones por tarjeta: “Iniciar” / “Pausar”, “Reiniciar”, “Borrar”
	•	Aviso al finalizar: “Tiempo cumplido”
	•	Error input: “Usa formato HH:MM:SS”

```

El resultado parcial, diferia mucho de las imagenes de referencia, por ello agregue indicaciones de las primeras correcciones a realizar.

``` text
Puedes revisar las imagenes de referencia como guía de los cambios a aplicar.
La web debe tener una primera pantalla donde se elige entre cronometro y timer.
Según la elección, pasa al formato de la imagen de cronometro, solo hay botones para iniciar/detener y otro para reset.
Si se selecciona el timer, usar la ultima imagen. Los números se ingresan por medio de botones, no por campo de texto.
Tienes alguna duda?
```

Ya con el funcionamiento y el estilo visual adquirido, le pedi incluir el uso de multiples timers y cronometros.

``` text
Tambiénn se debe incorporar el feature de multiples timers y cronometros,.
 Talcual se describe en los objetivos.
Permite **crear y gestionar múltiples cronómetros o cuentas regresivas simultáneamente**
```
### FIN DE LAS ITERACIONES
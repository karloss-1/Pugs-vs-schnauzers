# QA de la entrega

## Verificado el 3 de octubre de 2026

Entorno: macOS, Node 24.21.0. Las 23 pruebas pasaron sin errores.

- Motor: tutorial seguro, posiciones y costes, ocupación, cooldowns, disparos en los cinco carriles, producción/recolección única, bloqueo, daño de área, ralentización, ruptura de armadura, salto único, avisos y habilidades del jefe, cambio de fase, vulnerabilidad, victoria y derrota.
- Ciclo de vida del motor: pausa congela todos los timers; un delta de 600 segundos se limita a 50 ms; reinicio borra entidades, timers, recursos y estado.
- Interfaz con DOM y Canvas simulados: arranque y precarga, cinco tarjetas, mapeo táctil, colocaciones del tutorial, ocultar página, giro vertical, reanudación explícita, ayuda, pausa, pantallas de victoria/derrota y reinicio.
- PWA: todos los archivos esenciales del precaché existen; iconos PNG con dimensiones correctas; manifest standalone; handlers del service worker simulados precargan, toman control, limpian únicamente caches anteriores del juego y devuelven el shell durante un fallo offline de navegación.
- Partidas completas: 15 simulaciones (cinco semillas y tres estrategias), diez victorias y cinco derrotas; victoria aproximadamente a 375 segundos y derrota por pasividad a 146 segundos.
- Arte: rigs vectoriales y campo revisados mediante render PNG de sus formas. Se corrigió el encuadre de retratos y la posición de la corona del jefe en la fila superior.
- Sintaxis: módulos y JavaScript integrado de `play.html` comprobados con Node.

## Limitaciones de verificación

El entorno impidió escuchar puertos locales y lanzar Chrome headless. El navegador conectado bloqueó navegación a archivos locales. La escritura en GitHub fue rechazada por aprobación requerida y política `never`. No se intentó eludir esos controles.

**No se realizaron partidas humanas completas, pruebas de layout en navegador real, mediciones de FPS, instalaciones reales en Safari/iPhone, ejecución standalone real, ni apertura offline real de la PWA.** Las pruebas con mocks no verifican el comportamiento de Safari ni reemplazan playtesting humano. La entrega no debe describirse como validada físicamente en iPhone ni como ya publicada.

## Lista de aceptación posterior en dispositivo

Usar una URL HTTPS y probar un iPhone pequeño, otro con Dynamic Island/notch y una tablet.

1. Primera carga: todos los retratos aparecen, el botón se habilita y no hay errores en consola.
2. Tocar las cinco tarjetas y las casillas de cada fila. Comprobar legibilidad de nombres, costes y cooldowns, así como ausencia de scroll/zoom involuntario.
3. Confirmar que botones y casillas no quedan bajo safe areas, notch ni indicador de inicio. Probar Safari landscape con barras visibles y PWA standalone.
4. Completar una partida sin acelerar el reloj. Evaluar economía, dificultad, legibilidad de avisos, fase del jefe y celebración final. Probar también derrota y reinicio.
5. Cambiar a portrait, bloquear, cambiar de app y volver. El tiempo debe estar detenido y reanudarse solo desde el botón.
6. Activar/desactivar sonido tras un toque. Comprobar desbloqueo de Web Audio en Safari y reanudación del contexto después del bloqueo.
7. Agregar a inicio, abrir desde el icono y comprobar que solicita horizontal si es necesario.
8. Esperar «Jardín listo», cerrar la PWA, activar modo avión y volver a abrir. Deben cargar el juego, las tarjetas, las oleadas y los efectos.
9. Observar fluidez durante la oleada final. Medir FPS y memoria con herramientas de Safari; el objetivo de 60 FPS aún no está medido.
10. Confirmar que una persona nueva entiende los dos pasos del tutorial y puede ganar con decisiones razonables. Ajustar `config.js` según esa observación.

## Actualizaciones

Al cambiar recursos esenciales o código, actualizar el nombre de caché en `sw.js`. El cache-first mantiene estable una versión offline y el precaché nuevo debe completarse antes de activarse. Abrir de nuevo la app después de la actualización para comprobar que tomó la versión esperada.

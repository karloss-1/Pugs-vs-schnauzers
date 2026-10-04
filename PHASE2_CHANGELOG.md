# Phase 2 — Changelog

Baseline: `karloss-1/Pugs-vs-schnauzers`, `main`, commit `65c896673c40279b19af725c626493cafe358510`.
Entrega local completa para subida manual. **GitHub no fue actualizado.**

## Cambios principales

- Atlas original de 12 diseños/poses: cinco Pugs orientados a la derecha, cinco variantes de Schnauzer a la izquierda y dos poses del Barón. Nuevo escenario ilustrado. Se conserva el tablero de 5 × 9, economía, oleadas, selección y controles.
- Respiración desfasada por unidad, movimiento segmentado de patas ligado a la distancia recorrida, preparación, lanzamiento, recuperación, retroceso visual al recibir golpes y desvanecimiento de derrota. El casco desaparece al romper la armadura.
- Capitán: huesos giratorios, estela e impacto. Chef: preparación, aparición con rebote y recogida con feedback. Don Cojín: desgaste visual del escudo y descarga encadenada de corto alcance. Brasa sustituye visualmente a DJ Croqueta (conserva el ID `splash`). Polar: proyectil de hielo, cristales, escarcha y ruptura al expirar.
- Fuego de área: 34 de daño directo, radio 90 dentro del carril, quemadura de 3 s a 3 puntos cada 0.5 s. La quemadura se refresca pero no se acumula.
- Escudo eléctrico: hasta 3 objetivos, daño 16 / 10.4 / 6.76, cooldown 4.5 s, aturdimiento 0.18 s, inmunidad 2.5 s. Jefe: aturdimiento 0.06 s; hielo reduce su velocidad 25% frente al 50% normal. Sin bloqueo eléctrico permanente.
- Estados visuales: hit/recoil, fuego, hielo, electricidad, derrota. El contorno prioriza hielo → electricidad → fuego; brasas menores pueden coexistir. Viento en el ladrido del jefe; no añade otra carta ni desplaza casillas.
- Jefe: atlas y pose de ataque propios, entrada con partículas y sonido, ambiente más oscuro, aviso de habilidades, reacción de fase, onda de viento y celebración de derrota de 2.3 s antes del resultado. Vida y daño base conservados.
- Sonidos originales sintetizados de hueso, fuego, hielo, ruptura, electricidad, recursos, daño, viento/jefe, oleadas y resultados; variación leve de tono/volumen, compresor y máximo 16 voces. Se detienen al pausar, silenciar o reiniciar. No requieren archivos de audio ni conexión.
- Corregido el evento original `{type,...data}`: el tipo de unidad ya no sobrescribe el nombre de la acción. Esto permite feedback y sonidos diferenciados.
- UI: nuevas imágenes en cartas y retratos, selección y pulsación más claras, barra del jefe y banners. Se respeta reduced motion para sacudidas y efectos intensos.
- PWA: caché v2 con todos los nuevos assets, actualización de la caché anterior. `play.html` vuelve a generarse con arte embebido. Sin dependencias externas de ejecución.

## Balance

Velocidad base, unidades del mundo/s:

| Enemigo | Antes | Ahora |
|---|---:|---:|
| Bigotes | 11 | 12.7 (+15.5%) |
| Turbo | 27 | 29 (+7.4%) |
| Grandote | 7 | 7.6 (+8.6%) |
| Armadura | 10 | 11.2 (+12%) |
| Saltimbanqui | 14 | 15.4 (+10%) |
| Barón | 3.8 | 3.8 |

Costes, economía y calendario de oleadas conservados. La simulación equilibrada ganó a los 381 s, con 3 vidas; inacción perdió a los 134 s. Son simulaciones, no partidas humanas ni prueba de dificultad definitiva.

## Instalación / build

Desde la carpeta: `python3 -m http.server 8000`, abrir `http://localhost:8000`.
Build: `npm run build` (Node 22+) o `python3 tools/build.py`. No requiere `npm install`.
Pruebas reproducibles con Node: `npm test`. Para PWA instalar desde HTTPS. `play.html` permite apertura directa donde el navegador lo admita, sin instalación PWA.

## Pruebas realizadas

- JavaScript de producción ejecutado/comprobado con JavaScriptCore: 16 verificaciones existentes de motor, incluidos tutorial, recursos, cinco Pugs, filas, armadura, salto, jefe/fase, pausa, reinicio, victoria y derrota; 3 comprobaciones dirigidas de fuego, electricidad y eventos.
- 5 verificaciones de UI con DOM simulado: inicio, selección/colocación por pointer, pausa/background/orientación, ayuda, resultados y restart. Ejercicio adicional del renderer con Canvas simulado y los nuevos sprites/estados.
- Build Python ejecutado; algoritmo del build Node ejecutado con adaptadores de archivos en JavaScriptCore y comparado byte por byte. Node/npm no están instalados en este entorno; no se afirma haber ejecutado `npm test` aquí.
- Verificación de referencias locales, lista de precache, manifest e iconos. Build y arranque lógico repetidos desde una copia limpia de entrega; sin rutas temporales ni recursos externos.

## Limitaciones importantes

El entorno impidió iniciar un servidor local y el navegador rechazó `file://`. **No se pudo ejecutar una partida visual final ni comprobar audio audible, consola de navegador, FPS o instalación/offline reales.** Las pruebas de UI/Canvas son simuladas. No se probó Safari ni hardware iPhone. Conviene revisar una partida y la instalación tras subir el paquete. No se afirma que esa validación esté completada.

Animación híbrida de sprites, segmentos y transforms; no hay ciclos completos dibujados cuadro por cuadro. El arte vectorial anterior se conserva como fallback ante un fallo de carga. No se hizo profiling ni QA exhaustivo.

## Archivos

### Añadidos

- `PHASE2_CHANGELOG.md`
- `assets/art/characters.png`
- `assets/art/garden.png`
- `src/art.js`
- `tests/phase2.test.js`
- `tools/build.py`

### Modificados

- `.github/workflows/ci.yml`
- `README.md`
- `docs/QA.md`
- `index.html`
- `package.json`
- `play.html`
- `src/app.js`
- `src/audio.js`
- `src/config.js`
- `src/engine.js`
- `src/renderer.js`
- `style.css`
- `sw.js`
- `tests/app-ui.test.js`
- `tests/engine.test.js`
- `tools/build-standalone.mjs`

### Eliminados

Ninguno.

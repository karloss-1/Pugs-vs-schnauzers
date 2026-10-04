# PUGS vs. SCHNAUZERS — Phase 2

Un jardín, cinco Pugs y nueve oleadas. Juego de defensa para iPhone horizontal, en español, con arte original, animación y audio procedural.

Basado en `karloss-1/Pugs-vs-schnauzers`, commit `65c896673c40279b19af725c626493cafe358510`. Este paquete es una copia completa para subida manual. No incluye cambios publicados en GitHub ni carpeta `.git`.

## Ejecutar

No hay dependencias de producción ni paquetes que instalar.

```sh
cd Pugs-vs-schnauzers-phase-2
python3 -m http.server 8000
```

Abre `http://localhost:8000`. También puedes abrir `play.html` directamente en un navegador que permita archivos locales; incluye imágenes, scripts y estilos, pero ese modo no instala la PWA.

## Build y pruebas

Con Node.js 22 o posterior:

```sh
npm run build
npm test
```

Alternativa de build con Python 3, sin Node:

```sh
python3 tools/build.py
```

Ambos generan `play.html` desde las fuentes. Para publicar la PWA sirve la carpeta completa por HTTPS, usando `index.html`. Se conserva compatibilidad con subcarpetas de GitHub Pages. No es necesario subir `node_modules` ni instalar dependencias.

## Jugar

Selecciona una carta y toca una casilla. El tutorial comienza con Chef y Capitán; después se activa el reloj de invasión. Recoge premios dorados; también se recogen solos tras 9 s. Retirar devuelve la mitad del coste. Tres enemigos que crucen, o el jefe, causan derrota. Derrota al Barón y a los enemigos restantes para ganar.

| Pug | Coste | Habilidad |
|---|---:|---|
| Capitán Guau | 100 | Huesos giratorios, ataque económico |
| Chef Migajas | 75 | Produce 25 premios cada 12 s después de la primera producción |
| Don Cojín | 125 | 850 PV y descarga cercana hasta 3 enemigos cada 4.5 s |
| Brasa | 200 | Fuego de área en su carril y quemadura de 3 s |
| Pug Polar | 150 | Escarcha: ralentización de 4 s |

La electricidad aturde solo brevemente y tiene inmunidad temporal; el jefe resiste mejor hielo y aturdimiento. El viento es parte del ladrido del Barón, sin añadir una sexta carta. Las teclas 1–5 seleccionan Pugs; Escape pausa/reanuda. Audio se activa con interacción y puede silenciarse. Al cambiar de aplicación o girar a vertical, la partida se pausa.

## PWA en iPhone

Abre la versión HTTPS en Safari, espera a que cargue, toca Compartir → Agregar a inicio. El mensaje «Jardín listo» confirma el control del service worker. Abre de nuevo sin conexión para comprobar la instalación. La caché Phase 2 incluye el atlas y escenario y reemplaza la caché anterior.

## Arte y código

- `src/engine.js`: lógica, economía, oleadas y estados.
- `src/art.js`: atlas, animación por segmentos y estados visuales.
- `src/renderer.js`: tablero, proyectiles y efectos.
- `src/audio.js`: efectos originales sintetizados, máximo 16 voces y compresor.
- `assets/art/characters.png`: 12 diseños/poses originales generados para este juego.
- `assets/art/garden.png`: escenario original generado para este juego.
- `tools/`: build autocontenido; `tests/`: comprobaciones lógicas y DOM simulado.

Los originales de Phase 1 en `docs/` se conservan como referencia histórica. El atlas se recorta en tiempo de ejecución; no necesita un editor ni servicio externo. Los sonidos se sintetizan localmente, por lo que no requieren archivos descargables de audio ni licencias de terceros.

## Validación y límites

Consulta `PHASE2_CHANGELOG.md`. Se comprobó la lógica con JavaScriptCore y una interfaz simulada. El entorno bloqueó el servidor local y el navegador bloqueó `file://`: no se pudo jugar visualmente la versión final, escucharla en navegador ni validar la instalación offline real. No se probó hardware iPhone. El objetivo de 60 FPS requiere comprobación en el dispositivo; no se afirma como medición.

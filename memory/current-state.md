# Estado actual — Modo Diablo (landing premium para vender)

Última sesión: 2026-10-09

## Qué es
Landing de marca para Modo Diablo Distribuidora (bebidas, C.A.B.A., Av. Sáenz 426, WhatsApp 11-6520-2310).
La tienda real corre en Plantheo Shops y NO deja comprar online a un visitante (registro/carrito ocultos con d-none):
todo termina en WhatsApp. La landing no cobra: lleva a "Pedir por WhatsApp" (mensaje armado) o a la tienda.

## Hecho
- Panel de agentes (3 direcciones + chequeo legal + 2 jueces + síntesis): ganó "Noche en cámara lenta" ("Que la noche no se apure"),
  con la conversión de "La Vitrina" y la marca de "Prendé tu modo". Propuesta completa en docs/propuesta-final.json.
- Código de la página escrito (Vite vanilla): index.html, src/style.css, src/main.js, src/destacados.json (6 productos reales + precios al 09/10/2026).
- Higgsfield: cuadro de partida aprobado (media/raw/brindis-still.jpg) + video brindis 5 s (media/raw/brindis.mp4, pedido 3ed8c465…).
  Codificado para scrub en public/video (brindis.mp4 1600w, brindis-mobile.mp4 720w, posters).
- 1 imagen + 1 clip de 5 s gastados. Quedan sin generar: vertido, brindis 9:16, niebla roja (opcionales).

## Estado al cierre (2026-10-10)
- Maqueta con la revisión del panel aplicada (P1 + P2), compilada y probada en Chrome (escritorio 1440 y celular emulado 390): clip vertical en celular, leyenda legal más grande, pie legal unificado, "Frená el tiempo" con botón, hoja +18 con foco, favicon propio, og.jpg 1200x630, noindex.
- Gastado en Higgsfield para este proyecto: 2 imágenes + 2 clips de 5 s (brindis 16:9 y 9:16).
- Commits locales listos (snapshot 83cb50c + revisión). NO pusheados: el repo https://github.com/LucasEzequielSilva/modo-diablo es PÚBLICO y tiene docs/ y memory/ con análisis legal. Primero hay que pasarlo a privado (Settings > Danger Zone) y recién ahí hacer push.
- Disco C: limpiado (0 → 19 GB libres: caché de npm 17 GB, pnpm, pip).

## Próximos pasos
1. Usuario: pasar el repo a privado y avisar; después git push y deploy en Vercel.
2. Mirar la maqueta en un celular real (scroll hasta "Ese.") y ajustar FREEZE_T si hace falta.
3. Mandar link + preguntas al cliente (open-questions.md). Cuando lleguen datos: ofertas con fechas, razón social/CUIT, botón de arrepentimiento, WhatsApp Business, fotos originales.
4. Opcional: clips "vertido" (título "Un poco de diablo") y "niebla roja"; vectorizar logo.

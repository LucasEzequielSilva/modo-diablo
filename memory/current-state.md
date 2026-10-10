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

## Estado al cierre (2026-10-09)
- Maqueta COMPILADA y probada en navegador (escritorio 1440 y celular 390): hero, "Frená el tiempo" (FREEZE_T = 3.9 s), vitrina, "Un poco de diablo",
  rubros, "Así de simple", cierre, pie legal, barra +18 fija, hoja +18 y apertura de WhatsApp (una sola llamada, con el pedido armado).
- Entregable: dist/ y modo-diablo-maqueta.zip (6,8 MB). Repo git local, sin remoto todavía.
- Bugs corregidos en QA: desborde horizontal en celular (recuadro sanitario del pie), sticky roto por overflow en html, anchos desparejos y fotos gigantes en la vitrina, relleno del título "Un poco de diablo".
- El disco C: llegó a 0 GB libres durante la sesión (caché de npm 17 GB, pnpm 9,7 GB): conviene limpiar.

## Próximos pasos
1. Crear repo en GitHub y conectar con Vercel (o soltar dist/ en Vercel Drop) para tener el link de la maqueta.
2. Mandar el link + las preguntas (open-questions.md) al cliente.
3. Clips pendientes (opcionales): brindis 9:16 para celular, vertido, niebla roja. Hoy el celular recorta el 16:9.
4. Vectorizar logo/frase y pedir fotos originales; catálogo vivo; medición.

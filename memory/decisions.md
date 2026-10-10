# Decisiones

## 2026-10-09 — Concepto: "Que la noche no se apure"
- Por qué: el pedido era el nivel de Vorágine pero "no tan abrumador". Un solo momento de scroll protagonista ("Frená el tiempo", unos 150vh) y el resto normal.
- Descartado: scroll de 900vh con muchas escenas (Vorágine); botellas generadas con IA.
- Revisable: sí.

## 2026-10-09 — La IA pone la atmósfera, nosotros lo que se compra
- Higgsfield: solo brindis, vertido y niebla, SIN botellas, etiquetas, logos, manos ni personas (la IA los deforma y hay riesgo de marca registrada).
- Producto: fotos reales del catálogo del cliente. Hoy copiadas en public/img/p (prototipo, 260–926 px, blandas en retina): pedir originales y autorización.

## 2026-10-09 — CTA principal: "Pedir por WhatsApp"
- Por qué: verificado renderizando la tienda — no hay carrito ni registro visibles ni botón de compra; solo WhatsApp. La tienda queda como respaldo.
- Riesgo abierto: la política de WhatsApp Business (23/09/2026) restringe alcohol en la Business App. Confirmar con el cliente y tener mail/teléfono como alternativa.

## 2026-10-09 — Legal integrado al diseño (validar con asesor del cliente)
- Barra fija "BEBER CON MODERACIÓN. PROHIBIDA SU VENTA A MENORES DE 18 AÑOS." (Ley 24.788 art. 6 e) + cartel de boca de expendio y mensaje sanitario CABA (Ley 5.708) en el pie.
- Hoja +18 de un toque al "Pedir" (fricción, no verificación; el control real es el DNI en la entrega).
- NADA de tabaco: ni categoría "Varios" entera ni cigarrillos (Ley 26.687). Rubros enlazan a categorías puntuales; hielo a /varios_151/hielo_806/.
- No prometer entrega nocturna ni zonas/costos/tiempos. No decir "distribuidor oficial". Rotular "Videos de ambiente generados con IA".
- Precios: con fecha y "según la web". El "antes" tachado solo si el ahorro es >= 5 %. José Cuervo Reposado queda afuera (la tienda lo publica "antes $26.000, ahora $30.000").

## 2026-10-09 — Dominio: no tocar nameservers
- La zona DNS y el mail del cliente viven en Plantheo (ns1/ns2.plantheo.cloud). Publicar en un subdominio con CNAME que cargue Plantheo, o dominio aparte. Nunca cambiar NS ni MX/SPF/TXT sin copiar la zona.

## 2026-10-10 — Revisión con panel (legal + diseño + técnico) aplicada
- El "antes" tachado queda APAGADO hasta tener fechas de oferta (Ley 24.240 art. 7): para encenderlo, agregar ofertaDesde y ofertaHasta (AAAA-MM-DD) a cada producto en src/destacados.json. Revisable cuando el cliente confirme vigencias.
- Celular usa un clip VERTICAL propio (brindis-v → public/video/brindis-mobile.mp4, pedido a5ab00a0…), con congelado en 3,1 s; escritorio congela en 3,9 s.
- Meta robots noindex mientras sea maqueta (sacarla al publicar en el dominio final). og:image absoluta vía vite.config.js (SITE_URL o VERCEL_PROJECT_PRODUCTION_URL).
- Leyenda legal fija: letra >= 2 % del alto de pantalla (17 px mín en escritorio, 15 px en celular) y --legal-h sigue la altura real. Pie con las dos leyendas juntas en un recuadro blanco + cartel con el texto exacto.
- "Frená el tiempo" termina con botón rojo ("Elegir mi botella") y atajo a WhatsApp. Enlaces a la tienda en pestaña nueva. Hoja +18: inert del resto, foco y "Todavía no" desactiva los botones.
- Descartado: prerender de tarjetas (con noindex no hay SEO que cuidar todavía), botón de pausa del video, fuentes autoalojadas, mensaje sanitario dentro de la barra fija (decisión del abogado).
- opener.jpg (foto del cliente, sin licencia confirmada) y 8 fotos sin uso salieron de public/ (quedan en media/raw/sin-uso, ignorado por git).

## 2026-10-10 — El repo en GitHub NO puede ser público
- Contiene análisis legal y señala incumplimientos del cliente (docs/ y memory/). Pasarlo a privado ANTES de seguir pusheando. Si estuvo público, el historial ya expuso opener.jpg y docs/propuesta-final.json: evaluar reescribir historial (requiere OK explícito).

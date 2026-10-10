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

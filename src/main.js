// Modo Diablo — "Que la noche no se apure"
// Un solo gesto de scroll ("Frená el tiempo"): el scroll frena el brindis hasta congelarlo.
// Todo lo demás se lee normal. La landing no cobra: lleva a pedir por WhatsApp o a la tienda.
import destacados from "./destacados.json";

const SITE = "https://www.mododiablodistribuidora.com.ar";
const UTM = "utm_source=landing&utm_medium=web&utm_campaign=noche";
const WHATSAPP = "5491165202310";
// segundo del clip donde se congela el brindis: splash en su punto más alto con las gotas en el aire
const FREEZE_T = matchMedia("(max-width: 760px)").matches ? 3.1 : 3.9; // celular: clip vertical (apogeo del splash ~3,1 s); escritorio: 3,9 s
const FECHA = destacados.fecha.split("-").reverse().join("/"); // AAAA-MM-DD a DD/MM/AAAA (sin new Date: en Argentina corre un día por UTC)

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ramp = (p, a, b) => clamp((p - a) / (b - a));
const ease = (t) => 1 - Math.pow(1 - t, 3);
const money = (n) => "$" + new Intl.NumberFormat("es-AR").format(n);
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const saveData = navigator.connection?.saveData === true;
const isMobile = matchMedia("(max-width: 760px)").matches;

document.documentElement.classList.add("js");
if (reduce || saveData) document.documentElement.classList.add("is-static");

// la barra legal fija mide lo que mide (2-3 líneas, safe-area de iPhone): el resto de la página sigue su altura real
const legalEl = $(".legal");
if (legalEl && "ResizeObserver" in window) {
  new ResizeObserver(() => document.documentElement.style.setProperty("--legal-h", Math.ceil(legalEl.getBoundingClientRect().height) + "px")).observe(legalEl);
}

// ─── Medición (conectar GA4 / Meta Pixel acá cuando estén) ───
function track(event, params = {}) {
  window.dataLayer?.push({ event, ...params });
  window.fbq?.("trackCustom", event, params);
}
document.addEventListener("click", (e) => {
  const el = e.target.closest("[data-cta]");
  if (el) track("cta_click", { cta: el.dataset.cta });
});

// ─── WhatsApp con el pedido ya escrito ───
const waUrl = (text) => `https://api.whatsapp.com/send?phone=${WHATSAPP}&text=${encodeURIComponent(text)}`;
const GENERIC = "Hola Modo Diablo! Quiero hacer un pedido. Soy mayor de 18 años. ¿Me confirman disponibilidad y entrega?";
const productMsg = (p) =>
  `Hola Modo Diablo! Quiero pedir: ${p.title} (${money(p.price)} según la web al ${FECHA}). Soy mayor de 18 años. ¿Me confirman disponibilidad y entrega?`;
// el enlace de contacto también pasa por la hoja +18 (sin JS sigue siendo un enlace normal a WhatsApp)
$$("[data-wa-link]").forEach((a) => {
  a.href = waUrl(GENERIC); a.target = "_blank"; a.rel = "noopener";
  a.addEventListener("click", (e) => { e.preventDefault(); order(GENERIC); });
});

// ─── Hoja +18 al tocar "Pedir" (fricción, no verificación; el control real es el DNI en la entrega) ───
const sheet = $("[data-sheet]");
const sheetText = $("[data-sheet-text]");
const sheetActions = $("[data-sheet-actions]");
const ADULT_KEY = "md_adult_until";
let pendingMessage = GENERIC;
let lastFocus = null;

const isAdultRemembered = () => {
  try { return Number(localStorage.getItem(ADULT_KEY)) > Date.now(); } catch { return false; }
};
const rememberAdult = () => {
  try { localStorage.setItem(ADULT_KEY, String(Date.now() + 30 * 864e5)); } catch { /* sin storage: no pasa nada */ }
};
function openWhatsApp(message) {
  track("order_whatsapp");
  window.open(waUrl(message), "_blank", "noopener");
}
let noTimer;
const inertTargets = () => $$("body > header, body > main, body > footer"); // con la hoja abierta, el resto de la página no recibe foco
function closeSheet() {
  clearTimeout(noTimer);
  sheet.hidden = true;
  inertTargets().forEach((el) => { el.inert = false; });
  lastFocus?.focus?.();
}
function order(message) {
  pendingMessage = message;
  if (isAdultRemembered()) return openWhatsApp(message);
  clearTimeout(noTimer);
  lastFocus = document.activeElement;
  sheetText.textContent = "Vendemos solo a mayores de 18 años. Te vamos a pedir el DNI al recibir tu pedido.";
  sheetActions.hidden = false;
  sheet.hidden = false;
  inertTargets().forEach((el) => { el.inert = true; });
  $("[data-sheet-yes]").focus();
}
$("[data-sheet-yes]").addEventListener("click", () => { rememberAdult(); closeSheet(); openWhatsApp(pendingMessage); });
$("[data-sheet-no]").addEventListener("click", () => {
  // sin enlaces ni redirecciones: solo un mensaje y cerrar
  sheetText.textContent = "Gracias por avisar. Volvé cuando cumplas 18.";
  sheetActions.hidden = true;
  sheetText.focus(); // el foco se queda dentro de la hoja y el lector anuncia el mensaje
  noTimer = setTimeout(closeSheet, 2600);
});
addEventListener("keydown", (e) => {
  if (sheet.hidden) return;
  if (e.key === "Escape") closeSheet();
  if (e.key === "Tab") { // foco atrapado dentro de la hoja
    const f = $$("button", sheet).filter((b) => !b.closest("[hidden]") && b.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
});
sheet.addEventListener("click", (e) => { if (e.target === sheet) closeSheet(); });
$$("[data-order]").forEach((b) => b.addEventListener("click", () => order(GENERIC)));

// ─── Vitrina: datos reales de la tienda ───
const cardsEl = $("[data-cards]");
const SAVING_MIN = 0.05; // el "antes" solo si el ahorro es de 5 % o más...
// ...y solo con la oferta vigente (Ley 24.240 art. 7: fecha precisa de comienzo y de finalización).
// Sin ofertaDesde y ofertaHasta (AAAA-MM-DD) en destacados.json no se muestra el "antes".
const dmy = (iso) => iso.split("-").reverse().join("/");
const enOferta = (p) => {
  if (!p.old || !p.ofertaDesde || !p.ofertaHasta) return false;
  const now = Date.now();
  return now >= new Date(`${p.ofertaDesde}T00:00:00-03:00`).getTime() && now <= new Date(`${p.ofertaHasta}T23:59:59-03:00`).getTime();
};
cardsEl.innerHTML = destacados.destacados.map((p, i) => {
  const showOld = enOferta(p) && (p.old - p.price) / p.old >= SAVING_MIN;
  const href = `${p.url}?${UTM}`;
  return `
    <li class="card" data-i="${i}" style="transition-delay:${i * 100}ms">
      <a class="card__photo" href="${href}" rel="noopener" data-cta="ficha-foto" tabindex="-1" aria-hidden="true">
        <img src="${p.file}" alt="${p.title}" loading="lazy" width="400" height="400" />
      </a>
      <div class="card__body">
        <p class="card__rubro">${p.rubro}</p>
        <h3 class="card__name">${p.title}</h3>
        <p class="card__price"><span class="card__now">${money(p.price)}</span>${showOld ? `<span class="card__old">Antes <s>${money(p.old)}</s></span>` : ""}</p>
        ${showOld ? `<p class="card__until">Oferta del ${dmy(p.ofertaDesde)} al ${dmy(p.ofertaHasta)}</p>` : ""}
        <div class="card__actions">
          <button type="button" class="btn btn--red" data-pedir="${i}" data-cta="card-pedir" aria-label="Pedir ${p.title}">Pedir</button>
          <a class="card__link" href="${href}" rel="noopener" data-cta="ficha" aria-label="Ver ficha en la tienda: ${p.title}">Ver ficha en la tienda</a>
        </div>
      </div>
    </li>`;
}).join("");
cardsEl.addEventListener("click", (e) => {
  const b = e.target.closest("[data-pedir]");
  if (b) order(productMsg(destacados.destacados[Number(b.dataset.pedir)]));
});
$("[data-fecha]").textContent = FECHA;

// ─── Rubros (sin tabaco: nunca se enlaza "Varios" entero) ───
const RUBROS = [
  ["Whisky", 23, "/productos/whisky_118/"], ["Vodka", 15, "/productos/vodka_132/"], ["Champagne", 11, "/productos/champagne_117/"],
  ["Cervezas", 8, "/productos/cervezas_149/"], ["Vinos", 6, "/productos/vinos_119/"], ["Aperitivos", 6, "/productos/aperitivos_144/"],
  ["Licores", 5, "/productos/licores_115/"], ["Tequila", 5, "/productos/tequila_134/"], ["Gin", 4, "/productos/gin_136/"],
  ["Hielo", 3, "/productos/varios_151/hielo_806/"],
];
$("[data-rubros]").innerHTML = RUBROS.map(([name, n, path], i) => `
  <li class="reveal"><a href="${SITE}${path}?${UTM}" rel="noopener" data-cta="rubro-${name.toLowerCase()}">
    <span class="n">${String(i + 1).padStart(2, "0")}</span><span class="t">${name}</span><span class="c">${n} ${n === 1 ? "producto" : "productos"}</span><span class="go" aria-hidden="true">→</span>
  </a></li>`).join("");

// la tienda no deja comprar online: mirarla nunca debería sacar a la persona de la landing
$$(`a[href^="${SITE}"]`).forEach((a) => { a.target = "_blank"; a.rel = "noopener"; });

// ─── Escenario: el scroll frena el brindis hasta congelarlo ───
const stage = $("#stage");
// el enlace del hero lleva al "Ese." (no se saltea el gesto); sin movimiento baja directo a la vitrina
$(".hero__scroll").addEventListener("click", (e) => {
  if (document.documentElement.classList.contains("is-static")) return;
  e.preventDefault();
  scrollTo({ top: stage.offsetTop + (stage.offsetHeight - innerHeight) * 0.6, behavior: "smooth" });
});
const video = $(".stage__video");
const hero = $(".hero");
const lines = $$("[data-step]");
const flash = $(".stage__flash");
const heroTabs = $$("a, button", hero);
let lastStep = -2, heroLive = true;
let videoOk = false;
if (!(reduce || saveData)) {
  video.src = `/video/brindis${isMobile ? "-mobile" : ""}.mp4`;
  video.addEventListener("loadedmetadata", () => { videoOk = true; });
  video.addEventListener("error", () => { videoOk = false; video.style.setProperty("--vo", 0); });
  video.play().catch(() => {});
  // iPhone con ahorro de batería: bloquea el autoplay hasta que la persona toca. Con el primer toque arranca; y como iOS no
  // pinta cuadros de un video que nunca se reprodujo, esa reproducción también destraba el "Frená el tiempo".
  let started = false;
  const kick = () => {
    if (started) return;
    video.play().then(() => { started = true; if (mode === "scrub") video.pause(); }).catch(() => {});
  };
  video.addEventListener("playing", () => { started = true; });
  ["touchend", "pointerup", "click", "keydown"].forEach((ev) => addEventListener(ev, kick, { passive: true }));
}

let mode = "play", t0 = 0, cur = 0, seeking = false, lastSeek = 0, last = performance.now();
video.addEventListener("seeked", () => { seeking = false; });
function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000); last = now;
  const r = stage.getBoundingClientRect();
  const range = r.height - innerHeight;
  const p = range > 0 ? clamp(-r.top / range) : 0;

  const h = 1 - ramp(p, 0.04, 0.28);
  hero.style.setProperty("--h", h.toFixed(3));
  hero.style.setProperty("--hp", h > 0.4 ? "auto" : "none");
  if ((h > 0.4) !== heroLive) { // con el hero desvanecido, sus botones salen del orden de Tab
    heroLive = h > 0.4;
    heroTabs.forEach((el) => (heroLive ? el.removeAttribute("tabindex") : el.setAttribute("tabindex", "-1")));
  }
  stage.style.setProperty("--shade", ramp(p, 0.55, 1).toFixed(3));
  stage.style.setProperty("--zoom", (1.02 + ease(clamp(p / 0.7)) * 0.05).toFixed(4));
  const step = p < 0.3 ? -1 : p < 0.52 ? 0 : p < 0.7 ? 1 : 2;
  if (step !== lastStep) { // destello de obturador al llegar a "Ese." (solo hacia adelante)
    if (step === 1 && lastStep < 1) { flash.classList.remove("is-hit"); void flash.offsetWidth; flash.classList.add("is-hit"); }
    lastStep = step;
  }
  lines.forEach((l, i) => { const on = i === step; l.classList.toggle("is-on", on); l.toggleAttribute("inert", !on); });

  if (videoOk && video.duration) {
    if (p < 0.02) {
      if (mode === "scrub") { mode = "play"; video.play().catch(() => {}); }
      // loop invisible: el clip entra y sale fundido contra el cuadro de partida.
      // Corta medio segundo después del congelado: así, al scrollear, el brindis nunca rebobina más que eso.
      const t = video.currentTime, d = Math.min(video.duration, FREEZE_T + 0.5);
      if (t > d && !seeking) { seeking = true; video.currentTime = 0; }
      video.style.setProperty("--vo", Math.min(clamp(t / 0.4), clamp((d - t) / 0.6)).toFixed(3));
    } else {
      video.style.setProperty("--vo", 1);
      if (mode === "play") { t0 = video.currentTime; cur = t0; video.pause(); mode = "scrub"; }
      const target = t0 + (FREEZE_T - t0) * ease(clamp(p / 0.68));
      cur += (target - cur) * (1 - Math.exp(-dt * 8));
      if (!seeking && Math.abs(cur - video.currentTime) > 0.01 && now - lastSeek > 30) {
        seeking = true; lastSeek = now; video.currentTime = cur;
      }
    }
  }
  requestAnimationFrame(frame);
}
if (!(reduce || saveData)) requestAnimationFrame(frame);

// ─── Header sólido pasado el hero ───
const topBar = $(".top");
const solidAt = () => stage.offsetHeight - innerHeight * 0.6;
const syncTop = () => topBar.classList.toggle("is-solid", scrollY > solidAt());
addEventListener("scroll", syncTop, { passive: true });
syncTop();

// ─── Revelados suaves ───
const io = new IntersectionObserver((entries) => entries.forEach((e) => {
  if (!e.isIntersecting) return;
  e.target.classList.add("is-in");
  io.unobserve(e.target);
}), { threshold: 0.15, rootMargin: "0px 0px -6% 0px" });
$$(".reveal, .cards .card").forEach((el) => io.observe(el));

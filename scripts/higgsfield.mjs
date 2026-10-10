// Genera con Higgsfield los clips de atmósfera de Modo Diablo.
// Flujo recomendado por el panel: 1) cuadro de partida (imagen) → 2) image-to-video (Kling 2.5 Turbo Pro).
// Uso: node --env-file=.env scripts/higgsfield.mjs brindis
import { mkdir, writeFile, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";

const KEY = process.env.HIGGS;
if (!KEY) throw new Error("Falta HIGGS en .env (formato id:secret)");
const API = "https://api.higgsfield.ai";
const headers = { Authorization: `Key ${KEY}`, "Content-Type": "application/json" };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const IMG = "/higgsfield-ai/soul/standard";
const I2V = "/kling-video/v2.5-turbo/pro/image-to-video";
const T2V = "/kling-video/v2.5-turbo/pro/text-to-video";

// Nada de botellas, etiquetas, logos, manos ni personas: la IA deforma marcas y hay riesgo legal.
const NEG = "text, letters, logo, label, brand name, bottle, people, hands, face, fingers, cuts, scene change, shaky camera, blurry, low quality, cartoon, deformed glass, watermark";

const SHOTS = {
  brindis: {
    still: {
      aspect_ratio: "16:9",
      prompt: `Ultra cinematic macro photograph for a premium spirits campaign: two heavy crystal whisky tumblers with large clear ice cubes clinking together in mid-air at the exact moment of impact, placed in the right half of the frame, amber whisky splashing, tiny droplets frozen in the air. Warm amber backlight with a thin crimson red rim light on the glass edges. Very dark moody bar background with soft amber bokeh, the left third of the frame is deep black empty space. No people, no hands, no bottles, no labels, no text. Shallow depth of field, 85mm macro lens, high contrast, rich blacks, photorealistic.`,
    },
    video: {
      model: I2V,
      duration: 5,
      cfg_scale: 0.5,
      negative_prompt: NEG,
      prompt: `The two crystal tumblers finish clinking in slow motion: the whisky ripples and a small splash crown rises, droplets hang in the air and drift slowly, the ice cubes rotate gently, warm amber light shimmers along the glass edges and the thin crimson rim light pulses softly. The camera pushes in very slowly and smoothly. Locked, elegant macro shot, slow motion, no hands, no people, no text, no labels, no cuts.`,
    },
  },
};

async function run(path, body, tag) {
  const res = await fetch(API + path, { method: "POST", headers: { ...headers, "Idempotency-Key": `modo-${tag}-v2` }, body: JSON.stringify(body) });
  if (!res.ok) throw new Error(`[${tag}] submit ${res.status}: ${await res.text()}`);
  const req = await res.json();
  console.log(`[${tag}] enviado ${req.request_id}`);
  let delay = 4000;
  for (;;) {
    await sleep(delay); delay = Math.min(delay * 1.3, 15000);
    const r = await fetch(req.status_url, { headers });
    if (!r.ok) { console.log(`[${tag}] status ${r.status}, reintento`); continue; }
    const s = await r.json();
    if (s.status === "completed") return s;
    if (["failed", "nsfw", "canceled"].includes(s.status)) throw new Error(`[${tag}] ${s.status}: ${s.error ?? ""}`);
    console.log(`[${tag}] ${s.status}…`);
  }
}
const save = async (url, file) => { await writeFile(file, Buffer.from(await (await fetch(url)).arrayBuffer())); console.log(`→ ${file}`); };

await mkdir("media/raw", { recursive: true });
const name = process.argv[2] ?? "brindis";
const shot = SHOTS[name];
if (!shot) throw new Error(`No existe el plano ${name}`);

const stillFile = `media/raw/${name}-still.jpg`, urlFile = `media/raw/${name}-still.url`;
let stillUrl = existsSync(urlFile) ? (await readFile(urlFile, "utf8")).trim() : null;
if (!stillUrl) {
  const s = await run(IMG, { ...shot.still, num_images: 1, resolution: "1080p" }, `${name}-still`);
  stillUrl = s.images[0].url;
  await writeFile(urlFile, stillUrl);
  await save(stillUrl, stillFile);
}
// Compuerta del panel: el cuadro se mira antes de gastar video. Con --solo-cuadro se frena acá.
if (process.argv.includes("--solo-cuadro")) process.exit(0);

const { model, ...vbody } = shot.video;
const v = await run(model, { ...vbody, image_url: stillUrl }, `${name}-video`);
await save(v.video.url, `media/raw/${name}.mp4`);

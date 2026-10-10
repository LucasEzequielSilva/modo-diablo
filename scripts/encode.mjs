// Recodifica media/raw/*.mp4 para la web. Los clips se scrubean con el scroll ("Frená el tiempo"),
// así que van con todos los cuadros keyframe (-g 1): setear currentTime es instantáneo.
import { mkdirSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";

// raw → [salida, ancho, crf]
const JOBS = {
  brindis: [["brindis", 1600, 24]],          // escritorio 16:9
  "brindis-v": [["brindis-mobile", 720, 26]], // celular 9:16 (clip propio, no un recorte)
  // vertido: [["vertido", 1280, 27]],
  // niebla: [["niebla", 1280, 28]],
};

mkdirSync("public/video", { recursive: true });
const ff = (args) => execFileSync("ffmpeg", ["-y", "-loglevel", "error", ...args], { stdio: "inherit" });

for (const [raw, outs] of Object.entries(JOBS)) {
  const src = `media/raw/${raw}.mp4`;
  if (!existsSync(src)) continue;
  for (const [name, width, crf] of outs) {
    ff(["-i", src, "-vf", `scale=${width}:-2`, "-an", "-c:v", "libx264", "-pix_fmt", "yuv420p", "-g", "1",
        "-movflags", "+faststart", "-preset", "slow", "-crf", String(crf), `public/video/${name}.mp4`]);
    console.log(`✓ ${name}`);
  }
}

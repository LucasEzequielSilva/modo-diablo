// Recodifica media/raw/*.mp4 para la web. El hero se scrubea con el scroll ("Frená el tiempo"),
// así que va con todos los cuadros keyframe (-g 1): setear currentTime es instantáneo.
import { mkdirSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";

const JOBS = {
  brindis: { scrub: true, crf: 24 },
  // vertido: { scrub: false, crf: 27 },
  // niebla: { scrub: false, crf: 28 },
};

mkdirSync("public/video", { recursive: true });
const ff = (args) => execFileSync("ffmpeg", ["-y", "-loglevel", "error", ...args], { stdio: "inherit" });

for (const [name, { scrub, crf }] of Object.entries(JOBS)) {
  const src = `media/raw/${name}.mp4`;
  if (!existsSync(src)) continue;
  const common = ["-an", "-c:v", "libx264", "-pix_fmt", "yuv420p", "-g", scrub ? "1" : "48", "-movflags", "+faststart", "-preset", "slow"];
  ff(["-i", src, "-vf", "scale=1600:-2", ...common, "-crf", String(crf), `public/video/${name}.mp4`]);
  ff(["-i", src, "-vf", "scale=720:-2", ...common, "-crf", String(crf + 3), `public/video/${name}-mobile.mp4`]);
  console.log(`✓ ${name}`);
}

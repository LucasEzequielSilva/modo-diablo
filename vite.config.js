import { defineConfig } from "vite";

// og:image tiene que ser absoluta para que WhatsApp y Telegram muestren la miniatura.
// Se arma con la URL del deploy (Vercel la provee sola: VERCEL_PROJECT_PRODUCTION_URL) o con SITE_URL.
const origin = (process.env.SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "")).replace(/\/$/, "");

const absoluteMeta = {
  name: "absolute-meta-urls",
  transformIndexHtml(html) {
    if (!origin) {
      console.warn("[og] sin SITE_URL ni VERCEL_PROJECT_PRODUCTION_URL: og:image queda relativa");
      return html;
    }
    return html
      .replace(/(property="og:image" content=")\/([^"]+)"/, `$1${origin}/$2"`)
      .replace("</head>", `    <meta property="og:url" content="${origin}/" />\n  </head>`);
  },
};

export default defineConfig({ plugins: [absoluteMeta] });

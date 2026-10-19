import { existsSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

// Bakes the rendered homepage into dist/index.html so crawlers that don't run
// JavaScript (GPTBot, ClaudeBot, PerplexityBot) see the real content.
// Runs after `vite build` and `vite build --ssr src/entry-server.tsx`.

const clientDir = "dist";
const serverDir = "dist-ssr";
const indexPath = join(clientDir, "index.html");
const serverEntry = resolve(serverDir, "entry-server.js");
const rootMarker = '<div id="root"></div>';

if (!existsSync(indexPath) || !existsSync(serverEntry)) {
  throw new Error("Missing client or SSR build output. Run both vite builds first.");
}

const template = readFileSync(indexPath, "utf8");
if (!template.includes(rootMarker)) {
  throw new Error(`${indexPath} has no empty ${rootMarker} to fill.`);
}

const { render } = await import(pathToFileURL(serverEntry).href);
const rendered = await render();

// React prepends an image preload for every <img> on the page. The browser finds those
// images in the markup anyway, so drop the hints rather than let them race the JS.
const appHtml = rendered.replace(/^(?:<link [^>]*\/>)*/, "");

if (!appHtml.includes("<h1")) {
  throw new Error("Pre-rendered markup has no <h1>; the lazy LandingPage did not resolve.");
}

// LandingPage is lazy(), so hydration waits on its chunk. Preload it alongside the entry.
const landingChunk = readdirSync(join(clientDir, "assets")).find(
  (file) => file.startsWith("LandingPage-") && file.endsWith(".js"),
);
const preload = landingChunk
  ? `  <link rel="modulepreload" crossorigin href="/assets/${landingChunk}">\n  </head>`
  : "</head>";

const html = template
  .replace("</head>", preload)
  .replace(rootMarker, `<div id="root">${appHtml}</div>`);

writeFileSync(indexPath, html);
rmSync(serverDir, { force: true, recursive: true });

console.log(`Pre-rendered ${indexPath} (${(appHtml.length / 1024).toFixed(1)} KB of markup)`);

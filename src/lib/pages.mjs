import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const pageDir = pathToFileURL(resolve("src/content/pages") + "/");

export function getPageHtml(slug) {
  const html = readFileSync(new URL(`${slug}.html`, pageDir), "utf8");
  return injectSiteMetadata(injectHeadlineMotion(html, slug), slug);
}

function injectSiteMetadata(html, slug) {
  const pathname = slug === "index" ? "/" : `/${slug}/`;
  const canonicalUrl = new URL(pathname, "https://darlingart.work").href;
  const metadata = [
    `<link rel="canonical" href="${canonicalUrl}"/>`,
    `<meta property="og:url" content="${canonicalUrl}"/>`,
  ].join("");

  return html.replace("</head>", `${metadata}</head>`);
}

function injectHeadlineMotion(html, slug) {
  if (html.includes("headline-motion.css")) {
    return html;
  }

  const assetPrefix = slug === "index" ? "" : "../";
  const headAssets = [
    `<link href="${assetPrefix}assets/headline-motion/headline-motion.css" rel="stylesheet" type="text/css"/>`,
    `<link href="${assetPrefix}assets/headline-motion/site-motion.css" rel="stylesheet" type="text/css"/>`,
  ].join("");
  const bodyAssets = [
    `<script defer src="${assetPrefix}assets/headline-motion/gsap.min.js"></script>`,
    `<script defer src="${assetPrefix}assets/headline-motion/scrolltrigger.min.js"></script>`,
    `<script defer src="${assetPrefix}assets/headline-motion/headline-motion.js"></script>`,
    `<script defer src="${assetPrefix}assets/headline-motion/site-motion.js"></script>`,
  ].join("");

  return html
    .replace("</head>", `${headAssets}</head>`)
    .replace("</body>", `${bodyAssets}</body>`);
}

export function getProjectPageSlugs() {
  return readdirSync(pageDir)
    .filter((file) => file.endsWith(".html") && file !== "index.html")
    .map((file) => file.replace(/\.html$/, ""))
    .sort();
}

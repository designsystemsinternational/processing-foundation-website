import { P5_CDN_URL } from './constants.ts';

export interface SketchDocument {
  js: string;
  css?: string;
  htmlBody?: string;
  scripts?: string[];
  base?: string;
}

/**
 * A standalone HTML document that runs one p5 sketch, for an iframe `srcdoc`.
 *
 * The sketch's own script tag comes BEFORE p5's: p5 looks for global `setup`
 * and `draw` when it loads, so global-mode code has to be defined by then.
 *
 * The canvas rule beats p5's own inline width/height, so the canvas scales to
 * whatever width the frame has. `height: auto` keeps the pixel buffer's ratio,
 * so a width/height in the frontmatter that disagrees with createCanvas() shows
 * as a gap rather than a stretched sketch.
 */
export const sketchDocument = ({
  js,
  css,
  htmlBody,
  scripts = [],
  base = '/',
}: SketchDocument) =>
  `<!DOCTYPE html>
<meta charset="utf8" />
<base href="${base}" />
<style type="text/css">
html, body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}
canvas {
  display: block;
  width: 100% !important;
  height: auto !important;
}
${css ?? ''}
</style>
<body>${htmlBody ?? ''}</body>
<script id="code" type="text/javascript">${js}</script>
<script src="${P5_CDN_URL}"></script>
${scripts.map((src) => `<script src="${src}"></script>`).join('\n')}
`
    // A non-breaking space pasted into the CMS editor is a syntax error that
    // reads as an ordinary space in the source.
    .replace(/\u00A0/g, ' ');

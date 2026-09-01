/**
 * The page an embedded sketch runs in. A sketch folder brings its own
 * index.html — it is a self-contained static page, so it names its p5 version,
 * its load order and the DOM its canvas expects, and every relative path in it
 * resolves against the folder the way it does in the p5 editor.
 *
 * The frame is fluid: the iframe fills the column at the ratio sketch.json
 * declares, so the page has to size itself to its viewport rather than to
 * createCanvas()'s pixels. In practice that means
 * `canvas { width: 100% !important; height: auto !important }` — !important
 * because p5 writes the pixel size inline on the element — and a fluid holder
 * if the canvas is parented into one. Anything laid over the canvas is in
 * viewport pixels, not canvas pixels.
 */
export const sketchUrl = (slug: string) => `/sketches/${slug}/index.html`;

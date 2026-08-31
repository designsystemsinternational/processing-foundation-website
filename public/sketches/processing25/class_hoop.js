// Where the texture seam sits, as an offset to the band's start angle. -HALF_PI points it
// toward the right of the canvas (instead of the front) so it reads less prominently.
const SEAM_ANGLE = -Math.PI / 2;

class Hoop {
  constructor() {
    this.radius = 220;
    this.bandH = 75;
    this.segments = 160;

    this.degStep = TWO_PI/this.segments;
    this.segLength = this.radius * this.degStep;

    this.tex = null;
    this.hr = null;

    this.uOffset = 0;
    this.spinSpeed = 0.0005;
  }

  setTexture(g) {
    this.tex = g;
    this.hr = this.tex.width * this.bandH/this.tex.height;
  }

  update() {
    this.uOffset += this.spinSpeed;
  }

  springReps() {
    return this.hr ? Math.max(1, Math.round(TWO_PI * this.radius / this.hr)) : 1;
  }

  display(scrollTiles = 0, shear = 0, radiusTop = this.radius, radiusBot = this.radius, thickness = this.bandH, flatten = 1, innerAlpha = 0, tex = null, innerTex = null, fixedReps = 0) {
    const outerTex = tex || this.tex;
    const inTex = innerTex || this.innerTex;
    push();
      noStroke();

      const top = -thickness / 2;
      const bot = thickness / 2;

      const hr = outerTex ? outerTex.width * this.bandH / outerTex.height : this.hr;
      const circumference = TWO_PI * (radiusTop + radiusBot) / 2;
      const slant = Math.sqrt((radiusTop - radiusBot) ** 2 + thickness ** 2);
      // Proportional UV: one texture width spans (texW/texH) of the band's slant height,
      // so U stays proportional to V and the type is never stretched. The count is fractional,
      // so with textureWrap(REPEAT) it tiles cleanly and just leaves a seam where it wraps.
      const reps = hr ? (circumference * this.bandH) / (hr * slant) : 1;

      // Split the band at `phase` (the front) into two strips. For a sheared spring coil the two
      // halves are z-offset so the coil's step opens as a GAP at the front (the "shearing shuffle"),
      // while the mesh still closes at gt 0/1 — so the texture seam stays hidden on the right,
      // decoupled from the coil step. For flat bands (shear 0) the split is invisible.
      const phase = -SEAM_ANGLE / TWO_PI;
      const splitP = Math.round(phase * this.segments);
      const halves = [[0, splitP, 1], [splitP, this.segments, 0]];

      if (outerTex) {
        textureMode(NORMAL);
        textureWrap(REPEAT);
        texture(outerTex);
      } else {
        fill(255);
      }
      for (const [pa, pb, zo] of halves) {
        beginShape(TRIANGLE_STRIP);
        for (let p = pa; p <= pb; p++) {
          const gt = p / this.segments;
          const a = gt * TWO_PI + SEAM_ANGLE;
          const z = shear * (gt - phase + zo);
          const u = -(gt * reps + scrollTiles);
          vertex(cos(a) * radiusTop, sin(a) * radiusTop, top + z, u, 1);
          vertex(cos(a) * radiusBot, sin(a) * radiusBot, bot + z, u, 0);
        }
        endShape();
      }

      if (innerAlpha > 0.5 && inTex) {
        const io = 3;
        // the inner wall gets its OWN proportional count from its OWN aspect, so a strip
        // texture loops at true proportion instead of being stretched to the outer's tiling.
        const inHr = inTex.width * this.bandH / inTex.height;
        const innerReps = (circumference * this.bandH) / (inHr * slant);
        textureMode(NORMAL);
        textureWrap(REPEAT);
        texture(inTex);
        tint(255, innerAlpha);
        for (const [pa, pb, zo] of halves) {
          beginShape(TRIANGLE_STRIP);
          for (let p = pa; p <= pb; p++) {
            const gt = p / this.segments;
            const a = gt * TWO_PI + SEAM_ANGLE;
            const z = shear * (gt - phase + zo);
            const u = gt * innerReps + scrollTiles;
            vertex(cos(a) * (radiusTop - io), sin(a) * (radiusTop - io), top + z, u, 1);
            vertex(cos(a) * (radiusBot - io), sin(a) * (radiusBot - io), bot + z, u, 0);
          }
          endShape();
        }
      }

    pop();
  }

  // Draws a flat ring wall as a vertical STACK of sub-band layers, each with its own texture and
  // its own U scroll — the "subdivided hoop" look. Each layer maps its texture at true proportion
  // for its own height, so nothing is stretched, and REPEAT lets it tile with a seam on the right.
  displayLayered(radius, thickness, layers) {
    push();
      noStroke();
      textureMode(NORMAL);
      textureWrap(REPEAT);
      const n = layers.length;
      const layerH = thickness / n;
      const top0 = -thickness / 2;
      const circ = TWO_PI * radius;
      const io = 3;
      for (let m = 0; m < n; m++) {
        const tex = layers[m].tex;
        const texDark = layers[m].texDark;
        const scroll = layers[m].scroll;
        const zTop = top0 + m * layerH;
        const zBot = zTop + layerH;
        const reps = tex ? (circ * tex.height) / (tex.width * layerH) : 1;

        // outer face
        if (tex) texture(tex); else fill(255);
        beginShape(TRIANGLE_STRIP);
        for (let p = 0; p <= this.segments; p++) {
          const gt = p / this.segments;
          const a = gt * TWO_PI + SEAM_ANGLE;
          const u = -(gt * reps + scroll);
          vertex(cos(a) * radius, sin(a) * radius, zTop, u, 1);
          vertex(cos(a) * radius, sin(a) * radius, zBot, u, 0);
        }
        endShape();

        // inner face: mirrored U so the type stays legible from inside, pre-darkened for depth
        if (texDark) {
          texture(texDark);
          beginShape(TRIANGLE_STRIP);
          for (let p = 0; p <= this.segments; p++) {
            const gt = p / this.segments;
            const a = gt * TWO_PI + SEAM_ANGLE;
            const u = gt * reps + scroll;
            vertex(cos(a) * (radius - io), sin(a) * (radius - io), zTop, u, 1);
            vertex(cos(a) * (radius - io), sin(a) * (radius - io), zBot, u, 0);
          }
          endShape();
        }
      }
    pop();
  }

  displayCaps(radiusTop, radiusBot, thickness = this.bandH, alpha = 255, tex = null, rot = 0) {
    const h = thickness / 2;
    push();
      noStroke();
      if (tex) {
        textureMode(NORMAL);
        textureWrap(CLAMP);
        texture(tex);
        tint(255, alpha);
      } else {
        fill(165, alpha);
      }
      rotateZ(rot);
      for (const [zc, rad] of [[-h, radiusTop], [h, radiusBot]]) {
        beginShape(TRIANGLE_FAN);
        vertex(0, 0, zc, 0.5, 0.5);
        for (let p = 0; p <= this.segments; p++) {
          const a = (p / this.segments) * TWO_PI;
          const x = cos(a), y = sin(a);
          vertex(x * rad, y * rad, zc, 0.5 + x * 0.5, 0.5 + y * 0.5);
        }
        endShape();
      }
    pop();
  }
}

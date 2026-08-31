---
title: "Announcing the new p5.sound.js library!"
slug: "announcing-the-new-p5soundjs-library"
date: 2024-12-16T21:18:31.550Z
author:
  - "Processing Foundation"
category: "Dev"
---

<div class="video">
  <iframe src="https://www.youtube.com/embed/p8eAj8yLvH8?feature=oembed" frameborder="0" scrolling="no"></iframe>
</div>

We are thrilled to announce the newest release of [p5.sound.js](https://github.com/processing/p5.sound.js)! [Tommy Martinez](https://thomasjohnmartinez.com/), a core contributor to the project, has provided more information about the updates and process below. To take the new library for a spin, head over to the [p5.Sound.js library](https://editor.p5js.org/thomasjohnmartinez/collections/Dp0zGclVL). Want to support open-source contributions? Donate to our [annual fundraiser](https://donorbox.org/building-together) today!

[Jason Sigal](https://www.jasonsigal.cc/) created the p5.sound.js library as part of the [2014 Google Summer of Code](https://www.jasonsigal.cc/portfolio/p5-js-p5-sound/) program and underwent updates by [aarón montoya-moraga](https://montoyamoraga.io/) during the [2023 p5.sound fellowship](https://medium.com/processing-foundation/announcing-the-2023-p5-sound-fellow-aar%C3%B3n-montoya-moraga-7613450902f6). Tommy Martinez completed the latest revamp of the p5.sound.js library in 2024. We sincerely appreciate the guidance and support from mentor Kristin Galvin and advisors Jason Sigal, Luisa Pereira, Yotam Mann, Dave Pagurek, Kenneth Lim, Cassie Tarakajian, and Rachel Lim.

The latest version of p5.sound.js is now available on [GitHub](https://github.com/processing/p5.sound.js/releases) and [jsdelivr](https://www.jsdelivr.com/package/npm/p5.sound). Since the library is widely used in educational settings, we’ve decided to delay updating the p5.sound.js link in the p5.js web editor to prevent disruptions during the current academic term. The library link will be swapped in the p5.js web editor around late December 2024. The previous [p5.js-sound library](https://github.com/processing/p5.js-sound) will remain accessible, with documentation available on the [archived p5.js site](https://archive.p5js.org/reference/#/libraries/p5.sound). However, it will no longer be actively maintained.

Learn more about the new p5.sound.js through the [reference documentation](https://p5js.org/reference/p5.sound) and [GitHub repository](https://github.com/processing/p5.sound.js). We welcome contributions from the community!

— Qianqian Ye, p5.js Project Lead

<div class="video">
  <iframe src="https://www.youtube.com/embed/-xDYVxpk9Xw?feature=oembed" frameborder="0" scrolling="no"></iframe>
</div>

### Reflection from p5.sound.js core contributor Tommy Martinez

For the past several months, I have been working on an update to p5.sound.js, a project initiated by Processing Foundation to re-envision the library as a beginner-friendly toolkit for working with sound on the web. The process was incredibly fun and added new depth to my research in web-based musical systems, a practice that I’ve been cultivating through teaching The Musical Web at [School for Poetic Computation](https://sfpc.study) and in the development of my browser-based sound works. Initially spearheaded by artist and programmer aarón montoya-moraga in 2023 as the p5.js sound Fellow, the project began by creating a new philosophy for sound in p5.js and by deprecating some higher-level objects such as p5.Polysynth, p5.Score and some of the more esoteric classes, such as p5.Convolver, a more accessible p5.sound.js ecosystem emerged. A [writeup by aarón](https://medium.com/processing-foundation/announcing-the-2023-p5-sound-fellow-aar%C3%B3n-montoya-moraga-7613450902f6) detailing the new approach to the library was released in March 2023.

<div class="video">
  <iframe src="https://www.youtube.com/embed/D1hFjKaWFig?feature=oembed" frameborder="0" scrolling="no"></iframe>
</div>

Inheriting the p5.sound.js redesign project in April of 2024, I looked for other areas where we could make the library more approachable. With contributions from over *68 developers*, the code repository provided the blueprint for how sound should work inside of p5.js. Still, it had become difficult to maintain, and with the many dependencies and technical debt accrued over close to a decade of development, we had outgrown it. After some conversations with Jason Sigal (creator of the original p5.sound.js library), Yotam Mann, Luisa Pereira, p5.js lead Qianqian Ye, and p5.js web editor lead Rachel Lim, I decided it would be best to rebuild the library’s existing functionality “from scratch,” using Tone.js as the primary package import. This process would do away with many duplicate low-level JavaScript from the p5.sound.js library in working order in the Tone.js codebase and instead import it directly.

Tone.js, after all, had provided the initial inspiration for the p5.sound.js project, and with a primarily singular creator, [Yotam Mann](https://yotammann.info), the code base is stylistically self-similar, battle-tested with an active user community, and is capable of doing everything p5.sound.js can do. By developing p5.sound.js as a wrapper for Tone.js, we improve code readability, encourage user contributions and bug fixes, and ultimately provide a more consistent environment to build upon — the p5.Oscillator class, for example, now creates a new instance of the Tone.Oscillator class as opposed to the raw Web Audio API OscillatorNode we had previously. Similarly, methods of the p5.Oscillator class such as frequency() invoke corresponding methods in the Tone.js library. Though there are some compromises in efficiency, this approach has resulted in much less code in p5.sound and a far more tidy codebase that more adequately honors the project it was founded upon.

<div class="video">
  <iframe src="https://www.youtube.com/embed/5dvlcIeXh_g?feature=oembed" frameborder="0" scrolling="no"></iframe>
</div>

Ultimately, using the new p5.sound.js library shouldn’t feel that different. Sketches follow the same mental model using connect() and disconnect() to create sound sources and processor networks. Your previous sketches should work, and if they don’t, we are interested in hearing from you via the GitHub issue tracker. I’ve added a few new examples, including one demonstrating the synthesis of stringed instruments using primitive p5 classes. I am also proud of the work I did on the p5.Panner3D and p5.Delay classes. The original p5.Panner3D class included many rich features but was difficult to use without a deeper understanding of spatialization in sound and its terminology. I’ve done away with some of the more complex behavior, specifically concerning ‘orientation’, and have made the class a more usable omnidirectional spatializer. p5.Delay class now uses the Tone.FeedbackDelay() class, which sounds more like a classic tape delay with flanging produced by delay time modulation.

<div class="video">
  <iframe src="https://www.youtube.com/embed/0keK7H2fUXo?feature=oembed" frameborder="0" scrolling="no"></iframe>
</div>

There is much more about what features were added and which were taken away, but that conversation should happen in the codebase through dialogue with open-source contributors. I am thrilled to hand this project back to the community and offer guidance if needed until it is in a more mature stage. Lastly, thank you to all the advisors who guided this project as it progressed: aarón montoya-moraga, Kenneth Lim, Cassie Tarakajian, Dave Pagurek, Kristin Galvin, Jason Sigal, Qianqian Ye, Rachel Lim and Yotam Mann.

To take the new library for a spin, head over to the [p5.Sound.js library](https://editor.p5js.org/thomasjohnmartinez/collections/Dp0zGclVL). Want to support open-source contributions? Donate to our [annual fundraiser](https://donorbox.org/building-together) today!

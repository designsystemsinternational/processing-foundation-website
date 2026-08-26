---
title: "p5.js 2.1 and 2.2: Expanding Graphics Avenues with p5.strands improvements and WebGPU"
subtitle: "We recently released p5.js 2.1 and 2.2, continuing the work that began with the release of p5.js 2.0."
slug: "p5js-21-and-22-expanding-graphics-avenues-with-p5strands-improvements-and-webgpu"
date: 2026-03-09T11:17:31.205Z
author:
  - "Kit Kuksenok"
  - "Amy B. Woodman"
category: "Software"
headerImage: p5strands-header.webp
indexImage: p5strands-index.webp
---

Newly released features are typically experimental and open for community testing and feedback. You can find full release notes in the links below:

-   [p5.js 2.1](https://github.com/processing/p5.js/releases/tag/v2.1.1): TypeScript integration, add-on Events API, and color contrast checking for web accessibility. Introduced branching (if/else) and looping (for) in p5.strands. This release was co-authored by 31 people!
-   p5.js 2.2: Introduced WebGPU-based renderer, as well as in [2.2.1](https://github.com/processing/p5.js/releases/tag/v2.2.1): a simpler, flatter API for p5.strands and in [2.2.2](https://github.com/processing/p5.js/releases/tag/v2.2.2): performance improvements and support for “millis()” inside p5.strands

These releases build off of the major milestone release of p5.js 2.0 last year, which laid new foundations for the library’s future. Since then, versions 2.1 and 2.2 have focused on stabilizing and extending those foundations. The features and updates in all 2.x releases are based on community feedback since 2023, and as development still continues, we would love for more p5.js artists, learners, teachers, and creators to get involved in shaping the software we all use!

This post is an overview of the latest releases, and also a moment to acknowledge the people who sustain this library. p5.js has been going strong for over a decade, and like any long-lived open-source software project, its survival is communal. Projects like p5.js persist because of the people who dedicate their time to review pull requests, fix regressions, improve documentation, test edge cases, and respond to issues that most users will never see. Much of this work is quiet and ongoing.

### **What’s New in 2.1 and 2.2**

Versions 2.1 and 2.2 build directly on the work introduced in 2.0. These releases emphasize fixes on stability and infrastructure improvements that make future development possible. Some highlights include:

-   New [add-on/template](https://github.com/processing/p5.js-addon-template) support for ecosystem contributors. This is a starter repository designed to help developers quickly scaffold and publish p5.js add-ons and extensions.
-   Advanced graphics work (p5.strands and WebGPU): 2.2 continues refinement and stabilization of p5.strands, the shader programming API introduced in p5.js 2.0, to make it easier to get started with programming visuals using the GPU. Additionally, the experimental WebGPU-based renderer, in development for about half a year, is available directly from the p5.js 2.2 build onwards. WebGL shaders written in p5.strands will ultimately work in WebGPU as well, and support for compute shaders is [in active development](https://editor.p5js.org/davepagurek/sketches/MVc84tjJw) — [learn more](https://discord.gg/s2P3j792Eq) on the p5.js Discord if you are interested in helping shape this feature!
-   Accessibility improvements and maintenance: added accessibility tooling to the core library, including contrast checks, with more utilities planned in future minor releases to help sketches better align with web accessibility standards (WCAG, EAA), alongside ongoing bug fixes, performance improvements, and internal codebase cleanups.

For full technical details, we encourage you to read the complete release notes here: [2.1](https://github.com/processing/p5.js/releases/tag/v2.1.1), [2.2.1](https://github.com/processing/p5.js/releases/tag/v2.2.1), and [2.2.2](https://github.com/processing/p5.js/releases/tag/v2.2.2)!

### 2.x Timeline: We are Here

If you are a p5.js user: this is also a reminder that p5.js 2.x will become the default version in the editor in July 2026.

If you maintain sketches, libraries, or teaching materials, now is a good time to review the compatibility guide and make any needed updates: [https://github.com/processing/p5.js-compatibility](https://github.com/processing/p5.js-compatibility)

The goal of the 2.x transition is long-term sustainability, making sure p5.js can continue to evolve without accumulating unmanageable technical debt.

Learn more about some of the major changes here:

-   [Interview](https://timrodenbroeker.de/kit-kuksenok-on-p5-js-2-0/) with Kit Kuksenok and Tim Rodenbröker on release of p5.js 2.0
-   [Code-along](https://www.youtube.com/watch?v=E2OE-FaMkag) to learn how to use shaders with p5.strands in p5.js 2.0
-   [Learn more](https://www.youtube.com/watch?v=1KqQeqZ3R9Y) about variable fonts, asynchronous loading, text to contours, and 3D text extrusion

If you have questions, please get in touch via the [p5.js Discord](https://discord.gg/6D7BfJn95v).

### Friendlier Shaders with p5.strands

The recent releases have significantly advanced p5.strands, a new feature that was introduced in p5.js 2.0. It is a new shader programming API that makes it possible to create complex, high-performance graphics using familiar JavaScript-style code. Strands translates that code into GLSL behind the scenes, allowing sketches to run dramatically faster than equivalent JavaScript-only implementations, especially when scaled up over time.

[What does p5.strands make possible?](https://beta.p5js.org/contribute/p5strands/)

First, consider [this sketch](https://editor.p5js.org/davepagurek/sketches/s9l80gISI), which uses JavaScript loops to draw a cube of cubes. It is only 40 lines, but if there are many more cubes, it will slow down very much. If it is running smoothly, try changing all the “15” to a higher and higher number, such as “30.” As the scene grows, the sketch performance will suffer very noticeably.

The purpose of shader is to use parallel, GPU-based computation to speed this up. Instead of for loops, here is [a second version](https://editor.p5js.org/davepagurek/sketches/5iSuJWHIN) of the same sketch using GLSL. It is 200 lines of code, and, if you are not familiar with GLSL, may be very difficult to read. Look for the “15” here, too, and try changing it to a larger number, like “30” or beyond. The shader-based animation remains smooth, showing the performance benefits of GPU rendering.

Finally, [the p5.strands version of this sketch](https://editor.p5js.org/davepagurek/sketches/UfP9NTFYQ) combines a more accessible, readable style of JavaScript with the performance of GLSL.

With the introduction of the WebGPU-based renderer, p5.strands sketches can seamlessly use either WEBGL or WEBGPU. [Here](https://editor.p5js.org/ksen0/sketches/q5eKBA-OT) is the same example as above, but using the WebGPU-based renderer. The only changes needed were to use async/await with createCanvas(…), and to import both the main library and the p5.webgpu.js add-on:

<script src\=”https://cdn.jsdelivr.net/npm/p5@2.2.2/lib/p5.js"></script\>

<script src\=”https://cdn.jsdelivr.net/npm/p5@2.2.2/lib/p5.webgpu.js"></script\>

*Special thanks to* [@davepagurek](https://www.davepagurek.com/) *for creating the sketches throughout this post.*

As development continues in 2.x, community feedback and experimentation play a central role in shaping this beginner-friendly approach to shader programming. The changes introduced in 2.1.1, 2.2.1 and 2.2.2 reflect contributions of not only code, but ideas in how the API should develop. With stabilization and improvement of WebGPU-based renderer, p5.strands WebGL shaders would also immediately work when switched to WebGPU.

If you’re curious to explore, test new capabilities, or help guide the future of p5.strands or the WebGPU-based renderer, we’d love for you to join the conversation on Discord (in [#p5strands](https://discord.gg/2MHKVeV2Dr) or [#webgpu](https://discord.gg/nmS4v2qw4K)) and get involved!

### Acknowledging Contributors and Stewards of p5.js

p5.js is built and maintained by a global community of contributors and stewards. Over its 10+ year lifespan, more than 800 people have contributed to p5.js, tracked using the [all-contributors specification](https://github.com/all-contributors/allcontributors.org).

Versions 2.1 and 2.2 include code contributions, reviews, testing, and project [stewardship](https://p5js.org/contribute/steward_guidelines/) from ~**50** people. We’d like to give a big thank you to:

@Aayushdev18, @Abhayaj247, @acgillette, @ayushman1210, @calebfoss, @davepagurek, @dpanshug, @error-four-o-four, @FerrinThreatt, @Geethegreat, @GregStanton, @harishbit, @HughJacks, @IIITM-Jay, @Iron-56, @ksen0, @limzykenneth, @lirenjie95, @lukeplowden, @LalitNarayanYadav, @madhav2348, @nalindalal, @nbogie, @nickmcintyre, @nickswalker, @nking07049925, @Nitin2332, @nakednous, @perminder-17, @Piyushrathoree, @reshma045, @sophyphile, @SoundOfScooting, @tychedelia, @VANSH3104, @shawdm, @pearmini, @Vaivaswat2244, @shivasankaran18, @awood0727, @vietnuyen2358, @shuklaaryan367-byte, @rakesh2005, @aashu2006, @jjnawaaz, @LuLaValva, @dontwanttothink, @Anshumancanrock, @saurabh24thakur

While this reflects code contributions, it doesn’t yet capture the full range of work that sustains the project, including documentation, education, design, and community care. We’re actively working toward better ways to recognize these contributions because recognizing this labor matters. Below are reflections from some of these recent contributors:

*“I learnt how to draw from coding, I am very bad at drawing and artistic things on hand and paper, but this project gave me opportunity to explore another aspect of my life.”* — Nalin, he/him @nalindalal (Contributor)

*“Being a contributor has been such a meaningful experience for me. I’m really proud of helping organize and support community discussions that brought people together and sparked new ideas. Along the way, I’ve learned that even small efforts — a bit of time, a helpful comment, a shared resource — can make a real difference. For anyone thinking about getting involved, I’d say just start small: join a chat, ask questions, and offer help where you can. You’ll be surprised how quickly you start feeling part of something bigger.”* — Nitin Rajpoot @Nitin2332 (Contributor)

*“Contributing to p5.js has been a deeply rewarding learning experience. I worked primarily on extending and improving noise functionality in p5.strands, including GLSL-based noise, fractal noise, vec2/vec3 support, and performance-related improvements, along with documentation and tooling fixes. Through this process, I learned how to work within a large, community-driven codebase, writing maintainable code, responding to reviews, and thinking carefully about API design and accessibility for creative coders. For anyone interested in getting involved, I would recommend starting with issues labeled “Good First PR,” reading existing code carefully, and not hesitating to ask questions. The p5.js community is welcoming, and small contributions quickly build confidence to take on more complex work.”* — Lalit Narayan Yadav (she/her) (Contributor)

*“I improved p5.js documentation through two PRs … clarified inline examples for better accessibility, and enhanced consistency and tone in instructional text. These updates made the reference pages clearer and more welcoming for new learners. I learned the value of community feedback, clear commit messages, and small, incremental improvements that meaningfully enhance user understanding in open-source projects. Start with “good first issue” tasks, follow contributor guidelines, and don’t hesitate to ask questions. Focus on small, impactful fixes — every improvement helps the community grow.”* — Abu Harish @harishbit (Contributor)

*“Working on p5.js has been a great learning experience. I focused on identifying and solving issues while continuously learning from the process. I’m proud of the progress I’ve made through contributing and growing as a developer. I’d encourage others to get involved — the p5.js community is incredibly supportive and welcoming, especially for beginner developers. It’s truly been a pleasure working on this project”* — Vansh Kabra (he/him) @VANSH3104 (Contributor)

*“p5.js has provided me with incredible opportunities to grow as a developer. Under Dave Pagurek’s mentorship I worked on p5.strands, and I feel the project’s values gave me the time and guidance I needed to succeed. I started making sketches soon after beginning to code, and I encourage anyone interested in contributing to do the same. Testing the limits of what I could make, I found myself reading the source code to understand how my sketch ran, and reading contributor docs. The way p5.js is set up for its community makes the move from user to contributor a natural step.”* — Luke, he/him @lukeplowden (Contributor & Steward)

*“In the past few releases, we have made a lot of progress on p5.strands, slowly making it a more capable and easier way to write shaders. I’ve also been toiling away for a while on WebGPU mode, now testable in the latest release. I’m really excited to see people test these features out, make creative things out of them, and also report bugs and suggestions to me! Plenty of these have been logged and fixed/implemented already. If you’re interested in learning, seeing what other people are doing, and helping direct the future of these endeavours, come join the discussion on the p5 discord!”* — Dave Pagurek (he/him) @davepagurek (Maintainer & Steward)

If you contributed to p5.js recently and don’t see yourself credited, or would like to add an additional note, please add your information here so we can acknowledge your work:  
[https://docs.google.com/forms/d/1Nixz3VTes9W3d-V9kj6ouK3UKWHN28u-X8A9OGhLYfM](https://docs.google.com/forms/d/1Nixz3VTes9W3d-V9kj6ouK3UKWHN28u-X8A9OGhLYfM)

### Getting Involved

Active development on p5.js continues and there are many ways to participate. We host monthly, informal developer chats on Discord — stop by to learn something new or bring your own bugs to get help. In these sessions contributors help each other troubleshoot issues and are welcome to share demos or propose new ideas. These are not recorded, intentionally low-pressure, and open to people with a wide range of experience.

If you use p5.js, we’d love to see you there:

-   Join the p5.js Discord channels for [#p5strands](https://discord.gg/2MHKVeV2Dr) and [#webgpu](https://discord.gg/nmS4v2qw4K)
-   Check out the contributing guides on GitHub for [p5.strands](https://beta.p5js.org/contribute/p5strands/) and [WebGPU](https://beta.p5js.org/contribute/webgpu/)
-   Want to test new features **before** they are released? Check recent releases ([2.1](https://github.com/processing/p5.js/releases/tag/v2.1.1), [2.2.1](https://github.com/processing/p5.js/releases/tag/v2.2.1), and [2.2.2](https://github.com/processing/p5.js/releases/tag/v2.2.2)) and look for “release candidates!”. These contain instructions for testing, and finding bugs in them is a very helpful way to get involved with contribution!

Contributing to p5.js spans beyond just coding, you could also get involved by contributing to our documentation, education resources, testing, and tooling. Thank you to everyone who has co-created p5.js over the years!

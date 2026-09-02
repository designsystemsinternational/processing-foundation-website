---
title: "Drawing a Forest in One Line: A Preview of Instancing in p5.strands"
subtitle: What if drawing a thousand shapes only took one line?
slug: drawing-a-forest-in-one-line-a-preview-of-instancing-in-p5strands
date: 2026-08-10T12:00:00.000-04:00
author:
  - Akshat Patil
categories:
  - Dev
  - p5.js
headerImage: 1_z6lxcrsicdlsj8w6cxohkg_1.webp
indexImage: 1_z6lxcrsicdlsj8w6cxohkg.webp
headerImageCaption: 800 trees, two draw calls, made with the new instancing API
headerImagePosition: center
---
*Akshat Patil is a 19 year old computer science undergraduate from Indore, India, who enjoys building where graphics, creative coding, and open source meet. As an [Open Source Software Micrograntee](https://processingfoundation.org/dev/open-source-software-microgrant-program),* *he worked on p5.strands, WebGL, WebGPU, testing infrastructure, and rendering features. He is particularly interested in making powerful graphics tools more accessible and exploring the future of creative coding on the web. Support made possible through Generative Art Foundation.*

What if drawing a thousand shapes only took one line? p5.js v2 introduces a new graphics pipeline called[ p5.strands](https://beta.p5js.org/contribute/p5.strands/) that runs on modern [GPU](https://en.wikipedia.org/wiki/Graphics_processing_unit) technology by using [WebGPU](https://medium.com/@ProcessingOrg/p5-js-2-1-and-2-2-expanding-graphics-avenues-with-p5-strands-improvements-and-webgpu-9771d40c8b1d) where possible and WebGL everywhere else. It allows creators to use the power of the GPU without having to think like a graphics programmer. As an Open Source Software Micrograntee, I helped build a beginner-friendly function that draws many copies of a shape which will be released in p5.js 2.4.

## The Problem

Imagine drawing a forest. Every tree is roughly the same shape. If you draw 1,000 trees in a loop, your sketch sends the GPU 1,000 separate drawing instructions, one per tree, and all that back-and-forth slows things down. Instancing lets you say something different: “here is one tree, draw it 1,000 times.” The GPU receives a single instruction and produces all the copies itself, in parallel. It is the same trick games use for grass, crowds, and stars.

With the new API, instancing looks like this:

![Coming in p5.js 2.4](1_utgt4bgj1c9vkpyrpgigna.webp "Coming in p5.js 2.4")

## Why redesign it?

p5.js already supported instancing, but through retained geometry: buildGeometry(), then model(), then instanceID() in a shader to tell copies apart. It is powerful, but previously you had to learn several new concepts before drawing your first batch of shapes. That is a lot to ask of someone who wants 500 spheres on screen. The project was not about inventing a technique — instancing already existed. The challenge was designing an API that feels like the rest of p5.js.

## Most of the work was not code

The surprising part is how little time went into the final implementation. Most of it went into design: reading the renderer internals, studying how other libraries handle instancing, sketching options in[ tldraw diagrams](https://www.tldraw.com/f/nKqrNyqWS-8fIyC-Zcqo-?d=v-675.-363.3241.1914.page), and writing design documents other people could react to.

And the discussions never stopped. From the first week, ideas moved through Discord threads and GitHub reviews, and I talked with Dave Pagurek and Kit Kuksenok throughout the project. Every round made the API simpler, until the final API looks nothing like my first draft. That is exactly how it should be.

Reviews shaped the naming, the documentation, the examples, and the tests for both WebGL and WebGPU. Even a name changed along the way: instanceID() became instanceIndex, partly to match what WebGPU and other libraries call it, and partly because “index” gives beginners the right mental model, a number in a sequence rather than a unique ID.

To me, that is the real lesson: open-source features are not written, they are negotiated. A good API is a conversation that happens to end in code.

The new instancing API is now merged and lands in p5.js 2.4. If you have ever wanted to fill a canvas with a thousand copies of something, it will soon take one line. And if you want to help shape how p5.js works, the Processing Foundation Microgrant Program is a great place to start.

For readers who want the deeper technical story, the[ tracking issue](https://github.com/processing/p5.js/issues/8911) and the[ design proposal](https://gist.github.com/aashu2006/ca13773766637bb22785f16a475b0be1) show how the API evolved.

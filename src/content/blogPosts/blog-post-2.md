---
title: "Blog post #2"
slug: blog-post-2
date: 2026-07-17T17:34:00.000-04:00
author:
  - Rune Madsen
category: Design
headerImage: /src/assets/media/blogPosts/cover.jpg
---
Some lessons only stick after they've broken something in production. Here are three CSS bugs that quietly rewired how I think about the language.

![alt](src/assets/media/example.jpg)

**1. The mystery gap under my images**

I spent an embarrassing amount of time convinced my container had a phantom margin. It didn't. Images are `inline` by default, which means they inherit the same baseline-alignment quirks as text — including a tiny gap below them for descenders. The fix was one line:

`img { display: block; }`

No margin was ever the problem. My assumption about how images behave was.

**2. Z-index that refused to listen**

I raised a `z-index` to absurd numbers — 999, 9999, 999999 — and the element still sat behind another one. Turns out `z-index` only means anything once an element has a `position` value other than `static`. I was stacking a number on top of nothing.

**3. `100vh` on mobile, cutting off content**

`height: 100vh` looked perfect on desktop and broke on every phone I tested. Mobile browsers count the address bar into the viewport differently depending on scroll state, so `100vh` isn't a fixed number at all on mobile — it shifts under you. Switching to `100dvh` (dynamic viewport height) finally made the layout behave consistently.

None of these bugs were really about CSS syntax. They were about assumptions I hadn't noticed I was making — and every one of them turned into something I now check for by default.

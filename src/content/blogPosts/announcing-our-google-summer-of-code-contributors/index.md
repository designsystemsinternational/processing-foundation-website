---
title: 'Announcing our Google Summer of Code Contributors'
subtitle: 'Processing Foundation is participating in Google Summer of Code (GSoC) for the 14th year!'
slug: 'announcing-our-google-summer-of-code-contributors'
date: 2026-07-02T20:33:17.441Z
author:
  - 'Processing Foundation'
category: 'Google Summer of Code'
headerImage: ex_rgw1LqBJF1fLw8xLBmg.webp
headerImageCaption:
  'L-R: Dean Tarisai, nityam, Aashish Panthi, sam heckle, vansh kabra,
  Krishnageeth Kuppa'
---

GSoC is a global, online mentoring program focused on introducing new
contributors to open-source software development. This summer, five contributors
will work alongside Processing Foundation mentors to develop projects over a
12-week timeline.

Through mentorship, we support college-level students in open source projects
that develop and expand Processing and p5.js. Students are paired with mentors
from our community and are paid a stipend.

Mentors and org admins **Rachel Lim**, **Kit Kuksenok**, and **Raphaël de
Courville** identified a set of project ideas published on the Processing
Foundation Github earlier this year.

Read on to learn about the projects, contributors, and mentors.

[Follow along with their projects on GitHub](https://github.com/processing/Processing-Foundation-GSoC/blob/main/cohorts/2026.md),
or
[chat with them on Discord](https://discordapp.com/channels/1222564477174808586/1353677432397365258)!

### Aashish Panthi

_Mentored by Divyansh Srivastava, 2025 Processing Foundation GSoC Contributor_  
_“Continued Development of Translation Tracker”_

This project is an extension of the Translation Tracker from the GSoC 2025 to
support community translation of the p5.js reference documentation. I’m solving
the problem and the gap in the current translation tracker infrastructure. P5.js
documentation currently has five languages (English, Spanish, Simplified
Chinese, Korean, and Hindi). P5.js is growing, and we need an infrastructure to
support the translations. The goal is to improve/add GitHub Actions and
workflows that assist human translation by volunteer translators, not to support
the AI agents’ translation.

### Dean Tarisai

_Mentored by Kevin Stadler, 2018 Processing Foundation GSoC Contributor, 2023
Processing Foundation GSoC Mentor_  
_“Friendly gamified learning app for p5.js”_

An offline-first gamified learning mobile app for p5.js that teaches users how
to use the library’s symbols (functions, constants, classes, etc.) through small
exercises. Inspired by Google’s Grasshopper app.

Website: [https://prjctimg.me](https://prjctimg.me)  
X: [@prjctimg](https://x.com/prjctimg)

### Krishnageeth Kuppa

_Mentored by Claire Peng, 2025 pr05 Grantee_  
_“E2E testing for the p5.js web editor”_

The p5.js Web Editor has no end-to-end tests. As the team works through a
TypeScript migration and backend refactor, regressions in core user flows can go
undetected and only surface through manual review. This project builds a
complete E2E testing suite using Playwright, integrated into GitHub Actions so
every PR into the develop branch is automatically validated against real user
behaviour. The three deliverables are a working CI pipeline that runs the E2E
suite on every PR, a set of prioritised user flows covering unauthenticated,
authenticated, and state-transition scenarios, and contributor documentation so
the suite can be extended after GSoC without the original author present.

### nityam

_Mentored by Diya Solanki, 2024 pr05 Grantee, 2025 Processing Foundation GSoC
Mentor_  
_“Enabling Full Multi-Material and Texture Support for .mtl Files in p5.js”_

Currently, p5.js has a frustrating limitation for 3D artists: it flattens every
imported model into a single shape that can only hold one texture. If you export
a complex character from Blender or Maya with different materials for things
like skin, clothing, and eyes, p5.js silently discards that information during
the import process. This leaves creators with a flat, grey model instead of the
detailed, textured work they actually designed. This project fixes the problem
at its core by updating the library to recognize and render multi-material
models automatically.

LinkedIn: [@nityamt19](https://www.linkedin.com/in/nityamt19/)

### sam heckle

_Mentored by Lee Tusman, 2018 Processing Foundation GSoC Mentor_  
_“Expanding L5 Tooling, Starter Flow, and Community Ecosystem”_

This project will focus on L5 improvements in three parts. First, experimenting
with editor tooling by building a VS Code extension alongside research on
packaging and web-sharing mechanisms. Second, developing and testing community
infrastructure for sharing and developing L5 projects, alongside introducing
community guidelines. And third, improving and expanding the L5 website, with
emphasis on first-time setup and usability. The overarching goals of this
project are to ease starting flows for those new to Lua (or new to coding!) and
develop stronger community engagement with sharing and developing L5 projects.

Website: [https://samheckle.com/](https://samheckle.com/)  
Bsky: [@smarmy.space](https://bsky.app/profile/smarmy.space)  
Instagram: [@semantic.lol](https://www.instagram.com/semantic.lol/)  
Blog: [https://blog.smarmy.space/](https://blog.smarmy.space/)

### vansh kabra

_Mentored by Dave Pagurek, 2023 Processing Foundation GSoC Mentor, p5.js
maintainer and Claudine Chen, 2024 pr05 grantee_  
_“Native SVG Import/Export for p5.js via p5.Shape System”_

This project aims to add native SVG import and export capabilities to p5.js
through enhancements to the p5.Shape system. Currently, p5.js only supports
raster exports which limits professional workflows for artists and educators who
require vector outputs. The project will first **extend the Shape system** by
adding ArcSegment and EllipseSegment primitives to **enable structured geometry
recording**. Then an **SVG export add-on will be developed** using a visitor
pattern **to convert recorded primitives into clean SVG paths** with transform
support. Key deliverables include a shape recording API, SVG export via
saveSVG(), basic SVG import support, documentation, and tests. This will improve
interoperability of p5.js with design tools and vector workflows while
maintaining backwards compatibility.

Website: [https://vansh-dev.netlify.app](https://vansh-dev.netlify.app)  
LinkedIn: [@vansh-kabra-0a110327b](https://www.linkedin.com/in/vansh-kabra-0a110327b/)

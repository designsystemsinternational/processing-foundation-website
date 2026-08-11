---
title: "New Beginnings: Wrapping Up the First pr05 Developer Grant Program"
slug: "new-beginnings-wrapping-up-the-first-pr05-developer-grant-program"
date: 2025-01-16T20:39:49.690Z
author:
  - "Processing Foundation"
category: "Fellowships"
---

Millions of learners, educators, and creative coders around the world rely on Processing and p5.js every day, but have you ever wondered what keeps your favorite open-source tools running?

Processing and p5.js are open-source projects, meaning their code is publicly available for anyone to use, learn from, or improve. Unlike software built by a for-profit company, these tools are created and maintained by a community of contributors, including many volunteers, with the support of the non-profit Processing Foundation. This ensures that the software remains free to use and available to everyone. Think of it as a public good, just like a library or a public park!

What does that mean in practice? It means that anyone, anywhere, can download and use Processing or p5.js without paying for a license or subscription. The code is also transparent, allowing people to see how the software works, suggest improvements, or even adapt it for their own needs. Over time, small contributions add up, helping the software evolve and improve, benefiting everyone.

However, not all open-source work is suitable for this incremental approach. Some tasks, like major system updates or upgrades to critical components, require specialized knowledge, careful planning, and a long-term commitment that volunteers alone can’t always provide. And because this kind of behind-the-scenes maintenance is often seen as less glamorous, it can be hard to find people willing to take it on.

This is why we created the Processing Foundation Software Development Grant, or `pr05` grant (pronounced ‘pros’). This new mentorship initiative is designed to support the professional growth of software developers through hands-on involvement in open-source projects. In this first iteration of the program, we supported five developers with $10,000 stipends and mentorship from experienced open-source contributors.

The theme of this first year’s program was ‘New Beginnings,’ responding to an important moment of transition for our projects. Processing is moving forward after its founders' departure, and p5.js is preparing for its 2.0 release. At the same time, the p5.js editor is undergoing a significant upgrade, integrating a newer and more powerful version of the software library that powers its code editing features.

We curated [a list of projects](https://github.com/processing/pr05-grant/wiki/2024-Project-List-for-%60pr05%60-=-Processing-Foundation-Software-Development-Grant) to support these transitions, encouraging our grantees to engage deeply with infrastructure. Some of these projects focused on maintaining existing systems. Others were about building prototypes that would expand on critical infrastructure.

Some of our `pr05` took their first steps in open-source, while others built on existing experience. Over four months, they contributed to the ongoing transformation of our projects, making meaningful contributions to improving the accessibility, usability, and maintainability of Processing, p5.js, and the p5.js editor.

We’re incredibly proud of what this first cohort accomplished. Now, let’s take a closer look at their projects!

#### Diya Solanki: Creating a Processing VSCode Extension

<div class="video">
  <iframe src="https://www.youtube.com/embed/KsHP7RExNzM?feature=oembed" frameborder="0" scrolling="no"></iframe>
</div>

Diya focused on integrating Processing with VSCode, creating a Language Server Protocol (LSP) extension to bring robust IntelliSense features for Processing sketches (`.pde` files), like on-hover documentation, code completion, syntax highlighting, and sketch execution within VSCode. Wanna try it out for yourself? [Download the Processing VSCode Extension prototype](https://marketplace.visualstudio.com/items?itemName=DiyaSolanki.processing-language-server-extension) and if you’d like to get involved, visit the [project repository](https://github.com/diyaayay/processing-language-server-extension/)!

Thanks to [Sam Lavigne](https://lav.io/) for his mentorship and [Justin Gitlin](https://cacheflowe.com/about) for his advisory role.

**Read More:  
**Diya’s blog post: [Creating a Processing VSCode Extension](https://medium.com/@diya.solanki.31/2e6c629d59da)

**Related Links:  
**[Project repository](https://github.com/diyaayay/processing-language-server-extension/)  
[Technical summary](https://github.com/processing/pr05-grant/blob/main/2024_NewBeginnings/final-reports/pr05_2024_final_report_Diya_Solanki.md)  
[Visual Studio Marketplace Page](https://marketplace.visualstudio.com/items?itemName=DiyaSolanki.processing-language-server-extension)

**Social media links:  
**[Diya’s Github](https://github.com/diyaayay/) — [Twitter/X @krantikadiya](https://twitter.com/krantikadiya) — [Instagram @diyaayay](https://www.instagram.com/diyaayay/) — [LinkedIn (Diya Solanki)](https://www.linkedin.com/in/diyasolanki/)

#### Miaoye Que: Revamping the Friendly Error System (FES) for p5.js 2.0

<div class="video">
  <iframe src="https://www.youtube.com/embed/HjtJ7JESJqo?feature=oembed" frameborder="0" scrolling="no"></iframe>
</div>

The [Friendly Error System](https://github.com/processing/p5.js/blob/main/contributor_docs/friendly_error_system.md) (FES 🌸) aims to help new programmers by providing error messages in simple, friendly language. With the upcoming p5.js 2.0 release, significant updates were required to keep FES running within the new architecture. Miaoye’s efforts will ensure that the FES continues to be your friendly sidekick when writing p5.js sketches!

> I learned a lot about how to scope and plan a timeline, as well as technical details (such as the libraries I used). It was also a great opportunity to write JavaScript in a more professional way. — Miaoye Que

Thanks to p5.js stewards [Dave Pagurek](https://www.davepagurek.com/) and [Kenneth Lim](https://limzykenneth.com/) for their mentorship and former p5.js lead [Qianqian Ye](https://qianqian-ye.com/) for their support.

**Read More:  
**Miaoye’s blog post: [Revamping the Friendly Error System](https://medium.com/@pure.chinese.honey/6f589b7a453b)

**Related Links  
**[Technical summary](https://github.com/processing/pr05-grant/blob/main/2024_NewBeginnings/final-reports/pr05_2024_final_report_Miaoye_Que.md)

**Social media links:  
**[Miaoye’s Github](https://github.com/sproutleaf) — [Twitter/X @724x00945](https://twitter.com/724x00945) — [Instagram @724x00945](https://www.instagram.com/724x00945/) — [LinkedIn (Miaoye Que)](https://www.linkedin.com/in/miaoyeque/)

#### Dora Do: Prototype a Collaborative Desktop Editor for Processing

<div class="video">
  <iframe src="https://www.youtube.com/embed/woGZGg5tvxU?feature=oembed" frameborder="0" scrolling="no"></iframe>
</div>

Dora developed the Processing Collaborative Editor (PCE), a prototype desktop app for Mac and Windows designed to explore new ways of working with Processing sketches. The PCE emphasizes real-time collaboration, allowing multiple users to work on sketches together like you can a Google Doc. Curious to try it out? [Download the PCE beta](https://doradocodes.github.io/processing-collab-editor/) and give it a spin!

> The complete trust and respect from my mentors and advisors was extremely impactful. I felt they were very encouraging and made me feel confident about my work and contribution to the community.—Dora Do

Thanks to [Sinan Ascioglu](https://wiredpieces.com/) and [Ted Davis](https://teddavis.org/) for their mentorship and support.

**Read More:  
**Dora’s blog post: [Prototype a Collaborative Editor for Processing](https://medium.com/@doradocodes/prototype-a-collaborative-editor-for-processing-10a665063d7b)

**Related Links:  
**[PCE project’s homepage](https://doradocodes.github.io/processing-collab-editor/)  
[Project Repository](https://github.com/doradocodes/processing-collab-editor)  
[Technical summary](https://github.com/processing/pr05-grant/blob/main/2024_NewBeginnings/final-reports/pr05_2024_Final_report_DoraDo.md)

**Social media links:  
**[Dora’s Github](https://github.com/doradocodes/) — [Instagram @doraymee](https://www.instagram.com/doraymee/) — [LinkedIn (Dora Do)](https://www.linkedin.com/in/dorathiendo/) — [Dora’s Website](http://www.doradocodes.com/)

#### Nahee Kim: Upgrading CodeMirror to Version 6 for the p5.js Editor

<div class="video">
  <iframe src="https://www.youtube.com/embed/b0A5zQlPbf4?feature=oembed" frameborder="0" scrolling="no"></iframe>
</div>

When you write code in the p5.js web editor, the part that handles features like syntax highlighting, indentation, and autocompletion is a tool called CodeMirror. It’s what helps you focus on your creative coding without worrying about the technical details of how your code is displayed.

> Debugging tricky issues (…) really sharpened my problem-solving skills and taught me to think critically about code. — Nahee Kim

Nahee worked on upgrading the p5.js web editor to CodeMirror 6, a newer, more powerful and flexible version. While the project is still ongoing, this update will eventually make the editor more accessible and easier to use, especially on mobile devices, thanks to the new features included in CodeMirror 6.

**Related Links:  
**Monthly reports: [July](https://github.com/processing/pr05-grant/blob/main/2024_NewBeginnings/monthly-reports/pr05_2024_July_report_Nahee_Kim.md), [August](https://github.com/processing/pr05-grant/blob/main/2024_NewBeginnings/monthly-reports/pr05_2024_August_report_Nahee_Kim.md), [September](https://github.com/processing/pr05-grant/blob/main/2024_NewBeginnings/monthly-reports/pr05_2024_September_report_Nahee_Kim.md).

**Social media links:  
**[Twitter/X @AppNahee](https://twitter.com/AppNahee) — [Instagram @nahee.app](https://www.instagram.com/nahee.app/)

#### Claudine Chen: Simplifying the Workflow for Processing Libraries, Tools, and Modes

<div class="video">
  <iframe src="https://www.youtube.com/embed/NBoY2d94U-I?feature=oembed" frameborder="0" scrolling="no"></iframe>
</div>

Claudine worked on simplifying the process of creating and managing Processing libraries. She improved the Processing Library Template, a tool that helps developers build new libraries, by making it easier to use and adding new features for local setup and automating documentation. She also updated how new libraries are added to Processing, replacing a complicated manual process with an automated system that’s faster and more reliable. Curious to see how it works? Check out the repositories linked below!

> I really enjoyed the town halls. I learned so much from them. Just working on Processing, and being part of the ecosystem felt impactful.—Claudine Chen

Thanks to [Stef Tervelde](https://steftervel.de/) his mentorship and guidance, and [Katsuya Endoh](https://www.enkatsu.org/) for his contributions.

**Read More:  
**Claudine’s blog post: [Simplifying the Workflow for Processing Libraries, Tools, and Modes](https://medium.com/@cloudnine_95355/simplifying-the-workflow-for-processing-libraries-tools-and-modes-abcbe5c67c8b)

**Related links:  
**[Library Template Repository](https://github.com/processing/processing-library-template/)  
[Contributions Workflow Repository](https://github.com/processing/processing-contributions/)

**Social media links:  
**[Claudine’s Github](https://github.com/mingness) — [Instagram @mingness](https://www.instagram.com/mingness) — [Linkedin (Claudine Chen)](https://www.linkedin.com/in/claudinechen/)

### Moving forward

Through the `pr05` grant, we wanted to show that open-source work, especially the quiet, behind-the-scenes contributions, can be reframed as learning and growth opportunities. Our 2024 grantees embraced this fully, approaching their projects with incredible care and dedication. As Miaoye put it so well:

> In the world of Processing, maintenance is seen as an act of care and love. — Miaoye Que

I’m genuinely proud of how much thoughtfulness and intentionality our `pr05` grantees put in their contributions. There is a lot more to each of their projects than can reasonably fit in this article and I strongly encourage you to go read the story in their own words in the blog posts listed above.

Looking ahead, we can’t wait to welcome a new cohort in 2025—stay tuned for the open call—and continue to build on the legacy of all the incredible contributions of our 2024 cohort, together with you and the Processing community at large!

### Acknowledgements

Thanks to our incredible and supportive mentors and advisors, Sam Lavigne, Justin Gitlin, Sinan Ascioglu, Ted Davis, Dave Pagurek, Kenneth Lim, Stef Tervelde, and Connie Ye!

Our deepest gratitude goes to our Town Hall guests and facilitators, Shauna Gordon-McKeon, Margit Rosen, Nat Decker, Sebastian Burkhart, Computational Mama, and Tega Brain.

### Support Development

Processing Foundation is the non-profit behind Processing, p5.js, and the p5.js editor. We’re imagining open-source software that is free, creative, equitable, and accessible to all. However, free software is expensive to make, and we cannot do this work without you.

To keep the momentum going, [we are raising $20,000 by January 17, 2025](https://donorbox.org/building-together). These funds will directly support contributors who maintain and enhance Processing, p5.js, and the p5.js web editor, ensuring they stay up-to-date and reliable for artists, educators, and creative coders worldwide.

If Processing, p5.js, or the p5.js editor brought you $5 or more in value this year, please consider donating to help us continue to support our development. 100% of your donation funds this essential work — [donate now](https://donorbox.org/building-together)!

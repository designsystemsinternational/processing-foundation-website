import { renderMarkdownInline } from '@/lib/html.ts';
import { captionSizes } from '@/lib/constants.ts';
import Sketch from './Sketch.astro';

export default {
  title: 'Primitives/Sketch',
  component: Sketch,
  argTypes: {
    captionSize: { control: { type: 'select' }, options: captionSizes },
  },
};

export const Default = {
  args: {
    width: 600,
    height: 400,
    title: 'A rotating square',
    caption: renderMarkdownInline('A p5 sketch, scaled to the column width'),
    js: `let angle = 0;

function setup() {
  createCanvas(600, 400);
  rectMode(CENTER);
  noStroke();
}

function draw() {
  background(245, 240, 235);
  translate(width / 2, height / 2);
  rotate(angle);
  fill(30, 60, 200);
  rect(0, 0, 160, 160);
  angle += 0.01;
}`,
  },
};

export const Square = {
  args: {
    ...Default.args,
    width: 400,
    height: 400,
    js: Default.args.js.replace('createCanvas(600, 400)', 'createCanvas(400, 400)'),
  },
};

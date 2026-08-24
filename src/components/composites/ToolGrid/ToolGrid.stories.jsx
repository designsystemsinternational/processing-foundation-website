import q5Screenshot from '@/content/tools/q5js/q5js.png';
import ToolGrid from './ToolGrid.astro';

function tool(name, language, url, image) {
  return { id: name, data: { name, language, url, image } };
}

const TOOLS = [
  tool('Processing.py', 'Python', 'https://py.processing.org'),
  tool('py5', 'Python', 'https://py5coding.org'),
  tool('q5.js', 'Javascript', 'https://q5js.org', q5Screenshot),
  tool('t5.js', 'Javascript'),
  tool('Propane', 'Ruby', 'https://github.com/ruby-processing/propane'),
  tool('Sketching', 'Racket', 'https://github.com/soegaard/sketching'),
  tool('PyCreative', 'Python'),
  tool('Umfeld', 'C++', 'https://umfeld.org'),
];

export default {
  title: 'Composites/ToolGrid',
  component: ToolGrid,
};

export const Default = {
  args: { colorTheme: 'theme-4', tools: TOOLS },
};

export const WithoutImages = {
  args: {
    colorTheme: 'theme-4',
    tools: TOOLS.map(({ id, data }) => ({
      id,
      data: { ...data, image: undefined },
    })),
  },
};

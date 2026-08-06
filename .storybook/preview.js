import "virtual:uno.css";
import "./preview.css";

const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        order: ["Brand", "Components", ["Grid", ["Docs", "*"]]],
        includeNames: true,
      },
    },
  },
};

export default preview;

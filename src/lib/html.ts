import { marked } from 'marked';

declare const html: unique symbol;

/**
 * Markdown a schema has already rendered. The brand is what stops a component
 * from being handed raw markdown for a prop it writes straight to `set:html`.
 */
export type Html = string & { readonly [html]: true };

export const renderMarkdown = (value: string) =>
  marked.parse(value, { async: false }) as Html;

export const renderMarkdownInline = (value: string) =>
  marked.parseInline(value, { async: false }) as Html;

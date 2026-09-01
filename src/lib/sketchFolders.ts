import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Loader } from 'astro/loaders';
import { sketchSchema } from '../schemas/sketches.ts';
import { humanize } from './utils.ts';

/**
 * NODE-ONLY. Reads the sketch folders off disk for the Astro content loader
 * below. Nothing that a component imports may import this file — components get
 * a sketch through the content collection.
 */

/** Where a sketch folder is dropped, relative to the project root. */
export const sketchesDir = 'public/sketches';

const projectRoot = (root?: URL) =>
  root ? fileURLToPath(root) : fileURLToPath(new URL('../../', import.meta.url));

export interface SketchFolder {
  slug: string;
  hasMeta: boolean;
  data: Record<string, unknown>;
}

/**
 * Every folder under public/sketches that is a runnable page, with its
 * sketch.json merged in. A folder without an index.html is not one: it is
 * skipped rather than patched over, so a half-copied sketch fails loudly here
 * instead of rendering an empty frame on the page.
 */
export function readSketchFolders(root?: URL): SketchFolder[] {
  const dir = join(projectRoot(root), sketchesDir);
  if (!existsSync(dir)) return [];

  return readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort()
    .filter((slug) => existsSync(join(dir, slug, 'index.html')))
    .map((slug) => {
      const metaPath = join(dir, slug, 'sketch.json');
      const hasMeta = existsSync(metaPath);
      const meta = hasMeta
        ? (JSON.parse(readFileSync(metaPath, 'utf8')) as Record<string, unknown>)
        : {};
      return { slug, hasMeta, data: { title: humanize(slug), ...meta } };
    });
}

/** The folders that are missing the index.html that makes them runnable. */
export function incompleteSketchFolders(root?: URL): string[] {
  const dir = join(projectRoot(root), sketchesDir);
  if (!existsSync(dir)) return [];

  return readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((slug) => !existsSync(join(dir, slug, 'index.html')))
    .sort();
}

/** The `{ label, value }` list behind the Media block's sketch dropdown. */
export const sketchSelectOptions = (root?: URL) =>
  readSketchFolders(root).map(({ slug, data }) => ({
    label: String(data.title),
    value: slug,
  }));

/**
 * One collection entry per folder. The folders live in public/, outside the
 * content directory, so the glob loader cannot reach them and nothing watches
 * them: a new folder shows up after a dev server restart.
 */
export function sketchFoldersLoader(): Loader {
  return {
    name: 'sketch-folders',
    schema: sketchSchema,
    load: async ({ config, store, parseData, logger }) => {
      store.clear();
      for (const slug of incompleteSketchFolders(config.root)) {
        logger.warn(
          `${sketchesDir}/${slug} has no index.html, so it is not a sketch and cannot be embedded.`,
        );
      }
      for (const { slug, hasMeta, data } of readSketchFolders(config.root)) {
        if (!hasMeta) {
          logger.warn(
            `${sketchesDir}/${slug} has no sketch.json, so the sketch gets a default title and frame size.`,
          );
        }
        store.set({ id: slug, data: await parseData({ id: slug, data }) });
      }
    },
  };
}

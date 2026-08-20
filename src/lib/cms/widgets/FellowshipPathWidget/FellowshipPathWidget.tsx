import { createMetaPathControl } from '@/lib/cms/widgets/MetaPathWidget/MetaPathWidget.tsx';
import { entryString, type EntryMapLike } from '@/lib/cms/widgets/util.tsx';
import { slugify } from '@/lib/utils';

/** Fills the fellowship's `meta.path` from the year and title, or first fellow. */
export const FellowshipPathControl = createMetaPathControl({
  folder: 'src/content/fellowships',
  indexFile: 'index.md',
  folderFor: (entry: EntryMapLike | undefined) => {
    const year = entryString(entry, 'year');
    const slug = slugify(
      entryString(entry, 'title') || entryString(entry, 'fellows'),
    );
    return year && slug ? `${year}/${slug}` : '';
  },
  emptyHint: 'Pick a year and add a title or a fellow to fill this in.',
});

import { createMetaPathControl } from '@/lib/cms/widgets/MetaPathWidget/MetaPathWidget.tsx';
import { entryString, type EntryMapLike } from '@/lib/cms/widgets/util.tsx';
import { slugify } from '@/lib/utils';

/**
 * Fills the grant project's `meta.path` from the grant, the year and the first
 * grantee. The folder is the grantee, not the title, so a person's project sits
 * at a predictable path: `pr05/2025/claire-peng`.
 */
export const GrantProjectPathControl = createMetaPathControl({
  folder: 'src/content/grants',
  indexFile: 'index.md',
  folderFor: (entry: EntryMapLike | undefined) => {
    const grant = slugify(entryString(entry, 'grant'));
    const year = entryString(entry, 'year');
    const slug = slugify(entryString(entry, 'grantees'));
    return grant && year && slug ? `${grant}/${year}/${slug}` : '';
  },
  emptyHint: 'Pick a grant and a year, and add a grantee, to fill this in.',
});

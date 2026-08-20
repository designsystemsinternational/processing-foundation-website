import { Component } from 'react';
import {
  type EntryMapLike,
  type MetaPathControlProps,
} from '@/lib/cms/widgets/util.tsx';
import styles from './MetaPathWidget.module.css';

interface MetaPathOptions {
  folder: string;
  indexFile: string;
  /** The entry's folder inside `folder`, or "" when the fields aren't filled in yet. */
  folderFor: (entry: EntryMapLike | undefined) => string;
  emptyHint: string;
}

/**
 * Builds a `meta.path` control that fills a nested collection's folder in from
 * other fields on the entry, and shows the resulting file path read-only.
 */
export function createMetaPathControl({
  folder,
  indexFile,
  folderFor,
  emptyHint,
}: MetaPathOptions) {
  // Must stay a class: Decap reads shouldComponentUpdate off the control instance,
  // and its default ignores `entry`, so sibling edits never reach this widget.
  return class MetaPathControl extends Component<MetaPathControlProps> {
    private wasSeeded = Boolean(this.props.value);
    private lastAuto: string | null = null;

    shouldComponentUpdate(next: MetaPathControlProps) {
      return (
        this.props.value !== next.value ||
        this.props.classNameWrapper !== next.classNameWrapper ||
        folderFor(this.props.entry) !== folderFor(next.entry)
      );
    }

    componentDidMount() {
      this.autofill();
    }

    componentDidUpdate() {
      this.autofill();
    }

    private autofill() {
      const { value, onChange, entry } = this.props;
      const computed = folderFor(entry);
      if (this.wasSeeded || !computed) return;
      if (value && value !== this.lastAuto) return;
      if (value !== computed) {
        this.lastAuto = computed;
        onChange(computed);
      }
    }

    render() {
      const { value, forID, classNameWrapper } = this.props;

      return (
        <div className={classNameWrapper}>
          {value ? (
            <p id={forID} className={styles.path}>
              {`${folder}/${value}/${indexFile}`}
            </p>
          ) : (
            <p id={forID} className={styles.empty}>
              {emptyHint}
            </p>
          )}
        </div>
      );
    }
  };
}

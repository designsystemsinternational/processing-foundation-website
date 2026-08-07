import { Component } from "react";
import {
  entryString,
  type EntryMapLike,
  type MetaPathControlProps,
} from "@/lib/cms/widgets/util.tsx";
import { slugify } from "@/lib/utils";
import styles from "./FellowshipPathWidget.module.css";

const FELLOWSHIPS_FOLDER = "src/content/fellowships";

function folderFor(entry: EntryMapLike | undefined): string {
  const year = entryString(entry, "year");
  const slug = slugify(
    entryString(entry, "title") || entryString(entry, "fellows"),
  );
  return year && slug ? `${year}/${slug}` : "";
}

/** Fills the fellowship's `meta.path` from the year and title, or first fellow. */
export class FellowshipPathControl extends Component<MetaPathControlProps> {
  private wasSeeded = Boolean(this.props.value);
  private lastAuto: string | null = null;

  // Must stay a class: Decap reads shouldComponentUpdate off the control instance,
  // and its default ignores `entry`, so sibling edits never reach this widget.
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
            {`${FELLOWSHIPS_FOLDER}/${value}/index.md`}
          </p>
        ) : (
          <p id={forID} className={styles.empty}>
            Pick a year and add a title or a fellow to fill this in.
          </p>
        )}
      </div>
    );
  }
}

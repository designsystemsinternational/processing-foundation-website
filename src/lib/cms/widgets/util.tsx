import type { CmsWidgetControlProps } from "decap-cms-core";

/** Shared props, field reader and preview for the custom `meta.path` widgets. */

export interface EntryMapLike {
  getIn(path: string[]): unknown;
}

// entry/setActiveStyle/setInactiveStyle are real Decap runtime props, undocumented in its types.
export interface MetaPathControlProps
  extends Omit<CmsWidgetControlProps<string>, "value"> {
  value: string | undefined;
  entry?: EntryMapLike;
  setActiveStyle?: () => void;
  setInactiveStyle?: () => void;
}

export function entryString(
  entry: EntryMapLike | undefined,
  field: string,
): string {
  const value = entry?.getIn(["data", field]) as
    | { first?: () => unknown }
    | string
    | undefined;
  const single = typeof value === "object" ? value?.first?.() : value;
  return String(single ?? "");
}

export function MetaPathPreview({ value }: { value?: string }) {
  return <span>{value ?? ""}</span>;
}

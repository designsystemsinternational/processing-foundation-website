import { Component } from 'react';
import {
  entryString,
  type EntryMapLike,
  type MetaPathControlProps,
} from '@/lib/cms/widgets/util.tsx';
import styles from './GrantYearWidget.module.css';

const GRANTS_COLLECTION = 'grants';

interface GrantHit {
  data?: { name?: string; years?: Array<{ year?: string; title?: string }> };
}

interface GrantYearControlProps extends MetaPathControlProps {
  // A real Decap runtime prop, undocumented in its types like `entry` — it is
  // how the built-in relation widget reads another collection. Optional so the
  // control stays assignable to Decap's CmsWidgetControlProps.
  query?: (
    forID: string,
    collection: string,
    searchFields: string[],
    term: string,
  ) => Promise<{ payload?: { hits?: GrantHit[] } }>;
}

interface State {
  years: Array<{ year: string; title?: string }>;
  loaded: boolean;
}

/**
 * Year picker offering only the years listed on the grant selected above.
 * Decap's relation widget can read a nested list through a wildcard path, but
 * its `filters` option only takes literals, so it can't narrow the list to a
 * sibling field's value — hence this widget.
 */
export class GrantYearControl extends Component<GrantYearControlProps, State> {
  state: State = { years: [], loaded: false };

  private mounted = false;
  private loadedFor: string | null = null;

  // Must stay a class: Decap reads shouldComponentUpdate off the control
  // instance, and its default ignores `entry`, so the grant field's edits would
  // never reach this widget.
  shouldComponentUpdate(next: GrantYearControlProps, nextState: State) {
    // Decap's wrapper calls this with props only; React is the only caller that
    // passes state, so treat a missing one as "state unchanged".
    const years = (nextState as State | undefined)?.years ?? this.state.years;
    return (
      this.props.value !== next.value ||
      this.props.classNameWrapper !== next.classNameWrapper ||
      this.grantOf(this.props.entry) !== this.grantOf(next.entry) ||
      years !== this.state.years
    );
  }

  componentDidMount() {
    this.mounted = true;
    this.load();
  }

  componentDidUpdate() {
    this.load();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  private grantOf(entry: EntryMapLike | undefined) {
    return entryString(entry, 'grant');
  }

  private async load() {
    const grant = this.grantOf(this.props.entry);
    if (grant === this.loadedFor) return;
    this.loadedFor = grant;

    if (!grant) {
      this.setState({ years: [], loaded: true });
      return;
    }

    const { query, forID } = this.props;
    let hits: GrantHit[] = [];
    try {
      const result = await query?.(forID, GRANTS_COLLECTION, ['name'], grant);
      hits = result?.payload?.hits ?? [];
    } catch (error) {
      console.error('[grant-year] Failed to load grants:', error);
    }
    if (!this.mounted || this.loadedFor !== grant) return;

    const match = hits.find((hit) => hit.data?.name === grant);
    const years = (match?.data?.years ?? [])
      .filter((item): item is { year: string; title?: string } =>
        Boolean(item?.year),
      )
      .map(({ year, title }) => ({ year, title }));

    this.setState({ years, loaded: true });

    const { value, onChange } = this.props;
    if (value && !years.some((item) => item.year === value)) onChange('');
  }

  render() {
    const {
      value,
      forID,
      onChange,
      classNameWrapper,
      setActiveStyle,
      setInactiveStyle,
    } = this.props;
    const { years, loaded } = this.state;
    const grant = this.grantOf(this.props.entry);

    if (!grant) {
      return (
        <div className={classNameWrapper}>
          <p id={forID} className={styles.empty}>
            Pick a grant to choose a year.
          </p>
        </div>
      );
    }

    if (loaded && years.length === 0) {
      return (
        <div className={classNameWrapper}>
          <p id={forID} className={styles.empty}>
            {`“${grant}” has no years yet. Add one to the grant first.`}
          </p>
        </div>
      );
    }

    return (
      <div className={classNameWrapper}>
        <select
          id={forID}
          className={styles.select}
          value={value ?? ''}
          onChange={(event) => onChange(event.target.value)}
          onFocus={setActiveStyle}
          onBlur={setInactiveStyle}
        >
          <option value="">—</option>
          {years.map(({ year, title }) => (
            <option key={year} value={year}>
              {title ? `${year} — ${title}` : year}
            </option>
          ))}
        </select>
      </div>
    );
  }
}

export function GrantYearPreview({ value }: { value?: string }) {
  return <span>{value ?? ''}</span>;
}

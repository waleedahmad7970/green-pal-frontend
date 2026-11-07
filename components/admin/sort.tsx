"use client";

import { useMemo, useState } from "react";

type SortValue = string | number | null | undefined;
export type SortAccessors<T> = Record<string, (row: T) => SortValue>;
export interface SortState {
  key: string;
  dir: "asc" | "desc";
}

const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });

function compare(a: SortValue, b: SortValue): number {
  // Empty values always go to the bottom, whichever direction is chosen
  const aEmpty = a === null || a === undefined || a === "";
  const bEmpty = b === null || b === undefined || b === "";
  if (aEmpty || bEmpty) return aEmpty === bEmpty ? 0 : aEmpty ? 1 : -1;
  if (typeof a === "number" && typeof b === "number") return a - b;
  return collator.compare(String(a), String(b));
}

/**
 * Sorts table rows by a clicked column. Clicking cycles: ascending -> descending -> original order.
 * `accessors` maps a column key to the value used for sorting (numbers sort numerically,
 * dates should be returned as timestamps, text sorts alphabetically).
 */
export function useTableSort<T>(rows: T[], accessors: SortAccessors<T>, initial: SortState | null = null) {
  const [sort, setSort] = useState<SortState | null>(initial);

  const sorted = useMemo(() => {
    const get = sort ? accessors[sort.key] : undefined;
    if (!sort || !get) return rows;
    const factor = sort.dir === "asc" ? 1 : -1;
    return rows
      .map((row, index) => ({ row, index }))
      .sort((x, y) => {
        const av = get(x.row);
        const bv = get(y.row);
        const aEmpty = av === null || av === undefined || av === "";
        const bEmpty = bv === null || bv === undefined || bv === "";
        // keep empties at the bottom regardless of direction
        const c = aEmpty || bEmpty ? compare(av, bv) : compare(av, bv) * factor;
        return c || x.index - y.index;
      })
      .map((x) => x.row);
    // accessors are defined at module level in each page, so they are stable
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, sort]);

  const toggle = (key: string) =>
    setSort((cur) => {
      if (!cur || cur.key !== key) return { key, dir: "asc" };
      if (cur.dir === "asc") return { key, dir: "desc" };
      return null;
    });

  return { sorted, sort, toggle };
}

/** A table header cell that sorts the table when clicked. */
export function SortTh({
  label,
  sortKey,
  sort,
  onSort,
  className = "p-4 font-normal",
}: {
  label: string;
  sortKey: string;
  sort: SortState | null;
  onSort: (key: string) => void;
  className?: string;
}) {
  const active = sort?.key === sortKey;
  return (
    <th
      className={className}
      aria-sort={active ? (sort!.dir === "asc" ? "ascending" : "descending") : "none"}
    >
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        title={`Sort by ${label}`}
        className={`inline-flex items-center gap-1 cursor-pointer select-none transition-colors hover:text-signal ${
          active ? "text-signal" : ""
        }`}
      >
        {label}
        <span aria-hidden className={`text-[10px] leading-none ${active ? "" : "opacity-40"}`}>
          {active ? (sort!.dir === "asc" ? "▲" : "▼") : "↕"}
        </span>
      </button>
    </th>
  );
}

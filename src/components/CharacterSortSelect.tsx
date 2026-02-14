// src/app/characters/CharacterSortSelect.tsx
'use client';

import * as React from 'react';
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from '@headlessui/react';
import { useRouter, useSearchParams } from 'next/navigation';

import CheckIcon from '@/assets/images/check.svg';
import ChevronIcon from '@/assets/images/chevron-down.svg';

import { useComboWidth } from '@/components/GenreSelect/useComboWidth';
import { useGenreSelectFloating } from '@/components/GenreSelect/useGenreSelectFloating';
import SearchOverlay from '@/components/SearchOverlay';

type OrderBy = 'name' | 'favorites';
type SortDir = 'asc' | 'desc';

type SortSelectItem = {
  label: string;
  value: { orderBy: OrderBy; sort: SortDir };
};

const ITEMS: SortSelectItem[] = [
  { label: 'Name (A → Z)', value: { orderBy: 'name', sort: 'asc' } },
  { label: 'Name (Z → A)', value: { orderBy: 'name', sort: 'desc' } },
  { label: 'Favorites (High → Low)', value: { orderBy: 'favorites', sort: 'desc' } },
  { label: 'Favorites (Low → High)', value: { orderBy: 'favorites', sort: 'asc' } },
];

function getSelected(items: SortSelectItem[], orderBy: string, sort: string) {
  return items.find((it) => it.value.orderBy === orderBy && it.value.sort === sort) ?? items[0];
}

export default function CharacterSortSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isPending, startTransition] = React.useTransition();

  const currentOrderBy = searchParams.get('orderBy') ?? 'favorites';
  const currentSort = searchParams.get('sort') ?? 'desc';

  const selectedItem = React.useMemo(
    () => getSelected(ITEMS, currentOrderBy, currentSort),
    [currentOrderBy, currentSort]
  );

  const [query, setQuery] = React.useState('');
  const filteredItems = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ITEMS;
    return ITEMS.filter((it) => it.label.toLowerCase().includes(q));
  }, [query]);

  const inputElRef = React.useRef<HTMLInputElement | null>(null);
  const comboWidth = useComboWidth({
    inputElRef,
    items: filteredItems.map((x) => ({ label: x.label, value: x.label })),
  });

  const { floatingStyles, setReference, setFloating } = useGenreSelectFloating();

  const onChange = React.useCallback(
    (item: SortSelectItem | null) => {
      if (!item) return;

      const params = new URLSearchParams(searchParams.toString());
      params.set('orderBy', item.value.orderBy);
      params.set('sort', item.value.sort);

      startTransition(() => {
        router.push(`/characters?${params.toString()}`);
      });
    },
    [router, searchParams]
  );

  return (
    <>
      <SearchOverlay active={isPending} text="Sorting…" />

      <div>
        <Combobox value={selectedItem} onChange={onChange}>
          <div className="relative">
            <div
              className="relative"
              ref={setReference}
              style={comboWidth ? { width: comboWidth } : undefined}
            >
              <ComboboxInput
                id="character-sort-select"
                ref={inputElRef}
                className={[
                  'bg-zinc-700 px-3.5 py-2 w-full pr-10',
                  'text-white rounded-md',
                  'outline-none focus:ring-2 focus:ring-zinc-400/40',
                ].join(' ')}
                displayValue={(item: SortSelectItem) => item?.label ?? ''}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Řazení…"
              />

              <ComboboxButton
                className="flex justify-end absolute inset-y-0 right-0 items-center pl-6 pr-4 text-white/90"
                aria-label="Open Sort List"
              >
                <ChevronIcon className="h-4 w-3 text-white/90" />
              </ComboboxButton>
            </div>

            <ComboboxOptions
              ref={setFloating}
              style={floatingStyles}
              className={[
                'z-50 overflow-hidden rounded-md shadow-lg',
                'bg-zinc-800 py-1',
                'overflow-y-auto scroll-py-1 scrollbar-thin-dark',
                'empty:hidden whitespace-nowrap',
              ].join(' ')}
            >
              {filteredItems.map((it) => (
                <ComboboxOption
                  key={`${it.value.orderBy}_${it.value.sort}`}
                  value={it}
                  className={[
                    'px-4 py-1 flex justify-between items-center cursor-pointer outline-none',
                    'data-focus:bg-zinc-900',
                  ].join(' ')}
                >
                  <span className="text-white">{it.label}</span>
                  <span className="relative ml-2 text-white">
                    {it.value.orderBy === currentOrderBy && it.value.sort === currentSort ? (
                      <CheckIcon className="h-3 w-3 text-white" />
                    ) : null}
                  </span>
                </ComboboxOption>
              ))}

              {filteredItems.length === 0 && (
                <div className="px-4 py-2 text-sm text-zinc-300">Nic nenalezeno.</div>
              )}
            </ComboboxOptions>
          </div>
        </Combobox>
      </div>
    </>
  );
}
// src/components/GenreSelect/GenreSelect.tsx
'use client';

import * as React from 'react';
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from '@headlessui/react';

import type { Genre } from '@/types/genre';
import type { GenreSelectItem } from '@/types/genre-select';

import {
  buildGenreSelectItems,
  filterGenreSelectItems,
  getSelectedGenreSelectItem,
} from './utils';
import { useGenreRouting } from './useGenreRouting';
import { useComboWidth } from './useComboWidth';
import { useGenreSelectFloating } from './useGenreSelectFloating';
import SearchOverlay from '@/components/SearchOverlay';

import CheckIcon from '@/assets/images/check.svg';
import ChevronIcon from '@/assets/images/chevron-down.svg';

export default function GenreSelect({genres}: { genres: Genre[] }) {
  const [query, setQuery] = React.useState('');

  const items = React.useMemo(() => buildGenreSelectItems(genres), [genres]);

  const {currentGenre, onChange, isPending} = useGenreRouting();

  const selectedItem = React.useMemo(
    () => getSelectedGenreSelectItem(items, currentGenre),
    [items, currentGenre]
  );

  const filteredItems = React.useMemo(
    () => filterGenreSelectItems(items, query),
    [items, query]
  );

  const inputElRef = React.useRef<HTMLInputElement | null>(null);
  const comboWidth = useComboWidth({inputElRef, items});

  const {floatingStyles, setReference, setFloating} = useGenreSelectFloating();

  return (
    <>
      <SearchOverlay active={isPending} text="Sorting…" />
      <div>
        <Combobox value={selectedItem} onChange={onChange} by="value">
          <div className="relative">
            <div
              className="relative"
              ref={setReference}
              style={comboWidth ? {width: comboWidth} : undefined}
            >
              <ComboboxInput
                id="genre-select"
                ref={inputElRef}
                className={[
                  'bg-zinc-700 px-3.5 py-2 w-full pr-10',
                  'text-white rounded-md',
                  'outline-none focus:ring-2 focus:ring-zinc-400/40',
                ].join(' ')}
                displayValue={(item: GenreSelectItem) => item?.label ?? ''}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Vyber žánr…"
              />

              <ComboboxButton
                className="flex justify-end absolute inset-y-0 right-0 items-center pl-6 pr-4 text-white/90"
                aria-label="Open Genre List"
              >
                <ChevronIcon className="h-4 w-3 text-white/90"/>
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
                  key={it.value || '__all__'}
                  value={it}
                  className={[
                    'px-4 py-1 flex justify-between items-center cursor-pointer outline-none',
                    'data-focus:bg-zinc-900',
                  ].join(' ')}
                >
                  <span className="text-white">{it.label}</span>
                  <span className="relative ml-2 text-white">
                  {it.value === currentGenre ? (
                    <CheckIcon className="h-3 w-3 text-white"/>
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
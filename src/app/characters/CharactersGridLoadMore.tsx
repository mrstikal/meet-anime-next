'use client';

import * as React from 'react';
import type { CharacterCardData } from '@/types/character';
import CharacterCard from '@/components/CharacterCard';

type Props = {
  initialItems: CharacterCardData[];
  initialHasNextPage: boolean;
  initialNextPage: number;
  orderBy?: string;
  sort?: string;
  query?: string;
  limit?: number;
};

function dedupeById(list: CharacterCardData[]) {
  const seen = new Set<number>();
  return list.filter((x) => {
    if (seen.has(x.id)) return false;
    seen.add(x.id);
    return true;
  });
}

export default function CharactersGridLoadMore({
                                                 initialItems,
                                                 initialHasNextPage,
                                                 initialNextPage,
                                                 orderBy,
                                                 sort,
                                                 query,
                                                 limit = 20,
                                               }: Props) {
  const [items, setItems] = React.useState<CharacterCardData[]>(dedupeById(initialItems));
  const [hasNextPage, setHasNextPage] = React.useState(initialHasNextPage);
  const [nextPage, setNextPage] = React.useState(initialNextPage);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setItems(dedupeById(initialItems));
    setHasNextPage(initialHasNextPage);
    setNextPage(initialNextPage);
    setLoading(false);
    setError(null);
  }, [initialItems, initialHasNextPage, initialNextPage]);

  async function onLoadMore() {
    if (loading || !hasNextPage) return;

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.set('page', String(nextPage));
      params.set('limit', String(limit));
      if (orderBy) params.set('orderBy', orderBy);
      if (sort) params.set('sort', sort);
      if (query) params.set('q', query);

      const res = await fetch(`/api/characters?${params.toString()}`, { method: 'GET' });
      if (!res.ok) throw new Error('Request failed');

      const json: { items: CharacterCardData[]; hasNextPage: boolean; nextPage: number } = await res.json();

      setItems((prev) => dedupeById([...prev, ...(json.items ?? [])]));
      setHasNextPage(Boolean(json.hasNextPage));
      setNextPage(Number(json.nextPage) || (nextPage + 1));
    } catch {
      setError('Nepodařilo se načíst další položky.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-6">
        {items.map((c) => (
          <CharacterCard key={c.id} character={c} />
        ))}
      </div>

      <div className="mt-8 flex flex-col items-center gap-3">
        {error ? <p className="text-sm text-red-400">{error}</p> : null}

        {hasNextPage ? (
          <button
            type="button"
            onClick={onLoadMore}
            disabled={loading}
            className={[
              'px-4 py-2 rounded-md',
              'bg-zinc-800 text-white',
              'hover:bg-zinc-700',
              'disabled:opacity-60 disabled:cursor-not-allowed',
            ].join(' ')}
          >
            {loading ? 'Loading…' : 'Load more'}
          </button>
        ) : items.length > 0 ? (
          <p className="text-sm text-zinc-400">To je vše.</p>
        ) : null}
      </div>
    </div>
  );
}
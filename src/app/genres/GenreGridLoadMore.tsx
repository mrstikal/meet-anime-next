'use client';

import * as React from 'react';
import type { Anime } from '@/types/anime';
import AnimeCard from '@/components/AnimeCard';

type Props = {
  initialItems: Anime[];
  initialHasNextPage: boolean;
  initialNextPage: number;
  selectedGenreId?: string;
  orderBy?: string;
  sort?: string;
  query?: string;
  limit?: number;
};

function dedupeById(list: Anime[]) {
  const seen = new Set<number>();
  return list.filter((a) => {
    if (seen.has(a.mal_id)) return false;
    seen.add(a.mal_id);
    return true;
  });
}

export default function GenreGridLoadMore({
                                            initialItems,
                                            initialHasNextPage,
                                            initialNextPage,
                                            selectedGenreId,
                                            orderBy,
                                            sort,
                                            query,
                                            limit = 20,
                                          }: Props) {
  const dedupedInitialItems = React.useMemo(() => dedupeById(initialItems), [initialItems]);

  const [items, setItems] = React.useState<Anime[]>(dedupedInitialItems);
  const [hasNextPage, setHasNextPage] = React.useState<boolean>(initialHasNextPage);
  const [nextPage, setNextPage] = React.useState<number>(initialNextPage);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setItems(dedupeById(initialItems));
    setHasNextPage(initialHasNextPage);
    setNextPage(initialNextPage);
    setError(null);
    setLoading(false);
  }, [initialItems, initialHasNextPage, initialNextPage]);

  async function onLoadMore() {
    if (loading || !hasNextPage) return;

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.set('page', String(nextPage));
      params.set('limit', String(limit));
      if (selectedGenreId) params.set('genreId', selectedGenreId);
      if (orderBy) params.set('orderBy', orderBy);
      if (sort) params.set('sort', sort);
      if (query) params.set('q', query);

      const res = await fetch(`/api/anime?${params.toString()}`, {method: 'GET'});
      if (!res.ok) throw new Error('Request failed');

      const json: {
        items: Anime[];
        hasNextPage: boolean;
        nextPage: number;
      } = await res.json();

      const incoming = dedupeById(json.items ?? []);

      setItems((prev) => dedupeById([...prev, ...incoming]));
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
        {items.length > 0 ? (
          items.map((anime: Anime) => (
            <AnimeCard key={anime.mal_id} anime={anime} href={`/anime/${anime.mal_id}`}/>
          ))
        ) : (
          <p className="text-zinc-500 col-span-full text-center py-10">
            {selectedGenreId ? 'Loading...' : ''}
          </p>
        )}
      </div>

      <div className="mt-8 flex flex-col items-center gap-3">
        {error ? (
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm text-red-400">{error} Try again, please.</p>
            <button
              type="button"
              onClick={onLoadMore}
              disabled={loading || !hasNextPage}
              className={[
                'px-4 py-2 rounded-md',
                'bg-red-900/40 text-red-100 border border-red-700/40',
                'hover:bg-red-900/55',
                'disabled:opacity-60 disabled:cursor-not-allowed',
              ].join(' ')}
            >
              {loading ? 'Trying…' : 'Try again'}
            </button>
          </div>
        ) : hasNextPage ? (
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
          <p className="text-sm text-zinc-400">That&#39;s all</p>
        ) : null}
      </div>
    </div>
  );
}
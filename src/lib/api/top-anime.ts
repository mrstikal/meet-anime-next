import type { Anime } from '@/types/anime';
import { BASE_URL } from '@/constants/url';

export async function getTopAnime() {
  const res = await fetch(`${BASE_URL}/top/anime?limit=20`);
  if (!res.ok) throw new Error('Chyba při načítání anime');
  const { data } = await res.json();

  return data
}

export async function getTopAnimePage(opts?: { page?: number; limit?: number; orderBy?: string; sort?: string; q?: string }) {
  const page = opts?.page ?? 1;
  const limit = opts?.limit ?? 20;

  const hasOrdering = Boolean(opts?.orderBy || opts?.sort);
  const hasQuery = Boolean(opts?.q && opts.q.trim().length > 0);

  const url = (() => {
    if (!hasOrdering && !hasQuery) {
      return `${BASE_URL}/top/anime?page=${page}&limit=${limit}`;
    }

    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('limit', String(limit));
    if (opts?.q) params.set('q', opts.q);
    if (opts?.orderBy) params.set('order_by', opts.orderBy);
    if (opts?.sort) params.set('sort', opts.sort);

    return `${BASE_URL}/anime?${params.toString()}`;
  })();

  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error('Chyba při načítání anime');

  const json: {
    data: Anime[];
    pagination?: { has_next_page?: boolean; current_page?: number };
  } = await res.json();

  const items: Anime[] = (json.data ?? []);

  return {
    items,
    hasNextPage: Boolean(json.pagination?.has_next_page),
    nextPage: page + 1,
  };
}
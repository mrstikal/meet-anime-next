import type { Genre } from '@/types/genre';
import type { Anime } from '@/types/anime';
import { BASE_URL } from '@/constants/url';

export async function getAnimeByGenrePage(
  genreId: string,
  opts?: { page?: number; limit?: number; orderBy?: string; sort?: string; q?: string }
) {
  const page = opts?.page ?? 1;
  const limit = opts?.limit ?? 20;

  const params = new URLSearchParams();
  params.set('genres', genreId);
  params.set('page', String(page));
  params.set('limit', String(limit));
  if (opts?.q) params.set('q', opts.q);
  if (opts?.orderBy) params.set('order_by', opts.orderBy);
  if (opts?.sort) params.set('sort', opts.sort);

  const res = await fetch(`${BASE_URL}/anime?${params.toString()}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Chyba při načítání žánrů');

  const json: {
    data: Anime[];
    pagination?: { has_next_page?: boolean; current_page?: number };
  } = await res.json();

  const items: Anime[] = (json.data ?? [])

  return {
    items,
    hasNextPage: Boolean(json.pagination?.has_next_page),
    nextPage: page + 1,
  };
}

export async function getGenres() {
  const res = await fetch('https://api.jikan.moe/v4/genres/anime');
  const { data }: { data: Genre[] } = await res.json();
  return data.sort((a, b) => a.name.localeCompare(b.name));
}
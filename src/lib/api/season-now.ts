import type { Anime } from '@/types/anime';
import { BASE_URL } from '@/constants/url';

function formatSeasonLabel(season?: string | null, year?: number | null) {
  const s = (season ?? '').trim().toLowerCase();
  const y = typeof year === 'number' && Number.isFinite(year) ? year : null;

  const seasonName =
    s === 'winter' ? 'Winter' :
    s === 'spring' ? 'Spring' :
    s === 'summer' ? 'Summer' :
    s === 'fall' ? 'Fall' :
    s ? s.charAt(0).toUpperCase() + s.slice(1) : null;

  if (seasonName && y) return `${seasonName} ${y}`;
  if (seasonName) return seasonName;
  if (y) return String(y);
  return null;
}

export async function getSeasonNowPage(opts?: { page?: number; limit?: number }) {
  const page = opts?.page ?? 1;
  const limit = opts?.limit ?? 20;

  const params = new URLSearchParams();
  params.set('page', String(page));
  params.set('limit', String(limit));

  const res = await fetch(`${BASE_URL}/seasons/now?${params.toString()}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Chyba při načítání current season');

  const json: {
    data: Anime[];
    pagination?: { has_next_page?: boolean; current_page?: number };
  } = await res.json();

  const seasonLabel =
    formatSeasonLabel(json.data?.[0]?.season ?? null, json.data?.[0]?.year ?? null) ?? undefined;

  const items: Anime[] = (json.data ?? []);

  return {
    items,
    hasNextPage: Boolean(json.pagination?.has_next_page),
    nextPage: page + 1,
    seasonLabel,
  };
}
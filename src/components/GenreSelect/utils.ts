import type { Genre } from '@/types/genre';
import type { GenreSelectItem } from '@/types/genre-select';

export function buildGenreSelectItems(genres: Genre[]): GenreSelectItem[] {
  return [
    { label: 'All Genres', value: '' },
    ...genres.map((g) => ({ label: g.name, value: String(g.mal_id) })),
  ];
}

export function filterGenreSelectItems(items: GenreSelectItem[], query: string): GenreSelectItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return items;
  return items.filter((it) => it.label.toLowerCase().includes(q));
}

export function getSelectedGenreSelectItem(items: GenreSelectItem[], currentValue: string): GenreSelectItem {
  return items.find((it) => it.value === currentValue) ?? items[0];
}
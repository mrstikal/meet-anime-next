import { BASE_URL } from '@/constants/url';
import type { Anime } from '@/types/anime';

export async function getAnimeById(id: number | string): Promise<Anime> {
  const res = await fetch(`${BASE_URL}/anime/${id}`, { cache: 'no-store' });

  if (!res.ok) {
    throw new Error(`Chyba při načítání anime ${id}`);
  }

  const json: { data: Anime } = await res.json();
  return json.data;
}
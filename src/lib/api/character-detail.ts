import { BASE_URL } from '@/constants/url';
import type { Character } from '@/types/character';

export async function getCharacterById(id: number | string): Promise<Character> {
  const res = await fetch(`${BASE_URL}/characters/${id}/full`, { cache: 'no-store' });

  if (!res.ok) {
    throw new Error(`Chyba při načítání character ${id}`);
  }

  const json: { data: Character } = await res.json();
  return json.data;
}
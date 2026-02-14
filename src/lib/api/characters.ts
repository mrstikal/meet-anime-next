// src/lib/api/characters.ts
import { BASE_URL } from '@/constants/url';
import type { CharacterCardData } from '@/types/character';

type OrderBy = 'name' | 'favorites';
type SortDir = 'asc' | 'desc';

type CharacterListItem = {
  mal_id: number;
  name: string;
  nicknames?: string[] | null;
  images?: {
    jpg?: { image_url?: string | null };
    webp?: { image_url?: string | null };
  };
  favorites?: number | null;
};

const JIKAN_CHARACTERS_MAX_LIMIT = 25;

// Cache: imageUrl -> reachable?
const imageReachableCache = new Map<string, boolean>();

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

function pickImageUrl(c: CharacterListItem) {
  return c.images?.jpg?.image_url ?? c.images?.webp?.image_url ?? null;
}

function isNoiseMALName(name: string) {
  const n = name.trim().toLowerCase();
  if (!n) return true;
  if (n === '-' || n === '—') return true;
  if (n === '- myanimelist.net') return true;
  if (n === 'myanimelist.net') return true;
  if (n.startsWith('-') && n.includes('myanimelist.net')) return true;
  return false;
}

async function isImageReachable(url: string): Promise<boolean> {
  const cached = imageReachableCache.get(url);
  if (cached != null) return cached;

  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 2500);

  try {
    const head = await fetch(url, { method: 'HEAD', signal: controller.signal });
    if (head.ok) {
      imageReachableCache.set(url, true);
      return true;
    }

    const get = await fetch(url, { method: 'GET', signal: controller.signal });
    const ok = get.ok;

    imageReachableCache.set(url, ok);
    return ok;
  } catch {
    imageReachableCache.set(url, false);
    return false;
  } finally {
    clearTimeout(t);
  }
}

export async function getCharactersPage(opts?: {
  page?: number;
  limit?: number;
  orderBy?: OrderBy;
  sort?: SortDir;
  q?: string;
}) {
  const startPage = opts?.page ?? 1;
  const targetLimit = opts?.limit ?? 20;

  const MAX_PAGES_TO_SCAN = 10;
  const PER_REQUEST_DELAY_MS = 400;
  const perPageLimit = JIKAN_CHARACTERS_MAX_LIMIT;

  // budget pro validaci obrázků, aby request netrval věčně
  const MAX_IMAGE_CHECKS = 120;
  let imageChecksUsed = 0;

  const collected: CharacterCardData[] = [];
  let page = startPage;
  let scanned = 0;
  let hasNextPage = true;

  while (collected.length < targetLimit && scanned < MAX_PAGES_TO_SCAN && hasNextPage) {
    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('limit', String(perPageLimit));
    if (opts?.q) params.set('q', opts.q);
    if (opts?.orderBy) params.set('order_by', opts.orderBy);
    if (opts?.sort) params.set('sort', opts.sort);

    const res = await fetch(`${BASE_URL}/characters?${params.toString()}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Chyba při načítání postav');

    const json: {
      data: CharacterListItem[];
      pagination?: { has_next_page?: boolean; current_page?: number };
    } = await res.json();

    const data = json.data ?? [];
    hasNextPage = Boolean(json.pagination?.has_next_page);

    for (const c of data) {
      if (collected.length >= targetLimit) break;

      const name = (c.name ?? '').trim();
      if (isNoiseMALName(name)) continue;

      const favorites = typeof c.favorites === 'number' ? c.favorites : null;
      const nicknames = Array.isArray(c.nicknames) ? c.nicknames.filter(Boolean) : [];

      let image: string | null = pickImageUrl(c);

      // místo "skip" => když je rozbitá, nastavíme null (placeholder)
      if (image && imageChecksUsed < MAX_IMAGE_CHECKS) {
        imageChecksUsed += 1;
        const ok = await isImageReachable(image);
        if (!ok) image = null;
      } else if (image && imageChecksUsed >= MAX_IMAGE_CHECKS) {
        // když už nemáme budget, radši image zahoďme, aby se případně negenerovaly 404 ve FE
        image = null;
      }

      collected.push({
        id: c.mal_id,
        name,
        image,
        favorites,
        nicknames,
      });
    }

    page += 1;
    scanned += 1;

    if (collected.length < targetLimit && hasNextPage && scanned < MAX_PAGES_TO_SCAN) {
      await sleep(PER_REQUEST_DELAY_MS);
    }
  }

  return {
    items: collected,
    hasNextPage: hasNextPage && scanned < MAX_PAGES_TO_SCAN,
    nextPage: page,
  };
}
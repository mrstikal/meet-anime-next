import { NextResponse } from 'next/server';
import { getTopAnimePage } from '@/lib/api/top-anime';
import { getAnimeByGenrePage } from '@/lib/api/genres';

const ALLOWED_ORDER_BY = new Set(['title', 'score', 'popularity']);
const ALLOWED_SORT = new Set(['asc', 'desc']);

export async function GET(request: Request) {
  const url = new URL(request.url);

  const genreId = url.searchParams.get('genreId') ?? undefined;
  const q = url.searchParams.get('q') ?? undefined;

  const page = Number(url.searchParams.get('page') ?? '1');
  const limit = Number(url.searchParams.get('limit') ?? '20');

  const orderByRaw = url.searchParams.get('orderBy') ?? undefined;
  const sortRaw = url.searchParams.get('sort') ?? undefined;

  const orderBy = orderByRaw && ALLOWED_ORDER_BY.has(orderByRaw) ? orderByRaw : undefined;
  const sort = sortRaw && ALLOWED_SORT.has(sortRaw) ? sortRaw : undefined;

  const safePage = Number.isFinite(page) && page > 0 ? page : 1;
  const safeLimit = Number.isFinite(limit) && limit > 0 ? limit : 20;

  try {
    const result = genreId
      ? await getAnimeByGenrePage(genreId, { page: safePage, limit: safeLimit, orderBy, sort, q })
      : await getTopAnimePage({ page: safePage, limit: safeLimit, orderBy, sort, q });

    return NextResponse.json(result, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (e) {
    return NextResponse.json(
      { message: 'Chyba při načítání dat.' },
      { status: 500 }
    );
  }
}
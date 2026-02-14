// src/app/api/characters/route.ts
import { NextResponse } from 'next/server';
import { getCharactersPage } from '@/lib/api/characters';

const ALLOWED_ORDER_BY = new Set(['name', 'favorites']);
const ALLOWED_SORT = new Set(['asc', 'desc']);

export async function GET(request: Request) {
  const url = new URL(request.url);

  const q = url.searchParams.get('q') ?? undefined;

  const page = Number(url.searchParams.get('page') ?? '1');
  const limit = Number(url.searchParams.get('limit') ?? '20');

  const orderByRaw = url.searchParams.get('orderBy') ?? undefined;
  const sortRaw = url.searchParams.get('sort') ?? undefined;

  const orderBy =
    orderByRaw && ALLOWED_ORDER_BY.has(orderByRaw) ? (orderByRaw as 'name' | 'favorites') : undefined;
  const sort = sortRaw && ALLOWED_SORT.has(sortRaw) ? (sortRaw as 'asc' | 'desc') : undefined;

  const safePage = Number.isFinite(page) && page > 0 ? page : 1;
  const safeLimit = Number.isFinite(limit) && limit > 0 ? limit : 20;

  try {
    const result = await getCharactersPage({
      page: safePage,
      limit: safeLimit,
      q,
      orderBy,
      sort,
    });

    return NextResponse.json(result, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({ message: 'Chyba při načítání dat.' }, { status: 500 });
  }
}
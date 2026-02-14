// src/app/api/season-now/route.ts
import { NextResponse } from 'next/server';
import { getSeasonNowPage } from '@/lib/api/season-now';

export async function GET(request: Request) {
  const url = new URL(request.url);

  const page = Number(url.searchParams.get('page') ?? '1');
  const limit = Number(url.searchParams.get('limit') ?? '20');

  const safePage = Number.isFinite(page) && page > 0 ? page : 1;
  const safeLimit = Number.isFinite(limit) && limit > 0 ? limit : 20;

  try {
    const result = await getSeasonNowPage({ page: safePage, limit: safeLimit });

    return NextResponse.json(result, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch {
    return NextResponse.json({ message: 'Chyba při načítání dat.' }, { status: 500 });
  }
}
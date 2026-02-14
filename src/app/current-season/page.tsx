// src/app/current-season/page.tsx
import type { Anime } from '@/types/anime';
import { getSeasonNowPage } from '@/lib/api/season-now';
import CurrentSeasonLoadMore from './CurrentSeasonLoadMore';

export default async function CurrentSeasonPage() {
  const limit = 20;

  let initial: { items: Anime[]; hasNextPage: boolean; nextPage: number; seasonLabel?: string };

  try {
    initial = await getSeasonNowPage({ page: 1, limit });
  } catch {
    initial = { items: [], hasNextPage: false, nextPage: 2, seasonLabel: undefined };
  }

  const title = initial.seasonLabel ? `Current season - ${initial.seasonLabel}` : 'Current season';

  return (
    <main className="py-8">
      <h1 className="text-4xl font-bold mb-6">{title}</h1>

      <CurrentSeasonLoadMore
        initialItems={initial.items}
        initialHasNextPage={initial.hasNextPage}
        initialNextPage={initial.nextPage}
        limit={limit}
      />
    </main>
  );
}
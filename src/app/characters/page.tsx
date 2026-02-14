import { getCharactersPage } from '@/lib/api/characters';
import type { CharacterCardData } from '@/types/character';

import CharacterSortSelect from '../../components/CharacterSortSelect';
import CharactersGridLoadMore from './CharactersGridLoadMore';
import AnimeSearchInput from '@/components/AnimeSearchInput';

export default async function CharactersPage({
                                               searchParams,
                                             }: {
  searchParams: Promise<{ orderBy?: string; sort?: string; q?: string }>;
}) {
  const resolved = await searchParams;

  const orderBy = resolved.orderBy ?? 'favorites';
  const sort = resolved.sort ?? 'desc';
  const q = resolved.q;

  const limit = 20;

  let initial: { items: CharacterCardData[]; hasNextPage: boolean; nextPage: number };

  try {
    initial = await getCharactersPage({
      page: 1,
      limit,
      orderBy: orderBy === 'name' || orderBy === 'favorites' ? orderBy : 'favorites',
      sort: sort === 'asc' || sort === 'desc' ? sort : 'desc',
      q,
    });
  } catch {
    initial = { items: [], hasNextPage: false, nextPage: 2 };
  }

  return (
    <main className="py-8">
      <h1 className="text-4xl font-bold mb-6">Characters</h1>

      <div className="flex flex-col gap-x-4 gap-y-2 md:flex-row md:items-start">
        <CharacterSortSelect />
        <AnimeSearchInput basePath="/characters" placeholder="Find character" />
      </div>

      <CharactersGridLoadMore
        initialItems={initial.items}
        initialHasNextPage={initial.hasNextPage}
        initialNextPage={initial.nextPage}
        orderBy={orderBy}
        sort={sort}
        query={q}
        limit={limit}
      />
    </main>
  );
}
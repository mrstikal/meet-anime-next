import { getGenres, getAnimeByGenrePage } from '@/lib/api/genres';
import { getTopAnimePage } from '@/lib/api/top-anime';
import type { Genre } from "@/types/genre";
import type { Anime } from "@/types/anime";
import GenreSelect from '@/components/GenreSelect';
import SortSelect from '@/components/SortSelect';
import AnimeSearchInput from '@/components/AnimeSearchInput';
import GenreGridLoadMore from './GenreGridLoadMore';

export default async function GenresPage({searchParams}: {
  searchParams: Promise<{ id?: string; orderBy?: string; sort?: string; q?: string }>;
}) {
  const genres: Genre[] = await getGenres();

  const resolvedSearchParams = await searchParams;
  const selectedGenreId = resolvedSearchParams.id;

  const orderBy = resolvedSearchParams.orderBy ?? 'score';
  const sort = resolvedSearchParams.sort ?? 'desc';
  const q = resolvedSearchParams.q;

  const limit = 20;

  let initial: { items: Anime[]; hasNextPage: boolean; nextPage: number };

  try {
    initial = selectedGenreId
      ? await getAnimeByGenrePage(selectedGenreId, { page: 1, limit, orderBy, sort, q })
      : await getTopAnimePage({ page: 1, limit, orderBy, sort, q });
  } catch {
    initial = { items: [], hasNextPage: false, nextPage: 2 };
  }

  return (
    <main className="py-8">
      <h1 className="text-4xl font-bold mb-6">Genres</h1>

      <div className="flex flex-col gap-x-4 gap-y-3 md:flex-row md:items-start">
        <GenreSelect genres={genres}/>
        <SortSelect />
        <AnimeSearchInput />
      </div>

      <GenreGridLoadMore
        initialItems={initial.items}
        initialHasNextPage={initial.hasNextPage}
        initialNextPage={initial.nextPage}
        selectedGenreId={selectedGenreId}
        orderBy={orderBy}
        sort={sort}
        query={q}
        limit={limit}
      />
    </main>
  );
}
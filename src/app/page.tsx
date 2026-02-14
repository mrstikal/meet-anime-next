import { getTopAnime } from '@/lib/api/top-anime';
import type { Anime } from '@/types/anime';
import AnimeCard from '@/components/AnimeCard';

import * as React from "react";

export default async function HomePage() {
  const topAnime: Anime[] = await getTopAnime();

  return (
      <main className="py-8">
      <h1 className="text-4xl font-bold mb-8">Top Twenty Anime</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-6">
        {topAnime.map((anime) => (
          <AnimeCard key={anime.mal_id} anime={anime} href={`/anime/${anime.mal_id}`} />
        ))}
      </div>
    </main>
  );
}
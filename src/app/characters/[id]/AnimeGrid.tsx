import * as React from 'react';
import type { Anime } from '@/types/character';
import Image from 'next/image';
import Link from 'next/link';

export default async function AnimeGrid({anime}: { anime: Anime[] }) {

  const allAnime = anime.map((a) => {
    const imageUrl =
      a.anime.images?.webp?.image_url ??
      a.anime.images?.jpg?.image_url ??
      a.anime.images?.webp?.small_image_url ??
      a.anime.images?.jpg?.small_image_url ??
      null;
    return {
      id: a.anime.mal_id,
      title: a.anime.title,
      image: imageUrl,
      role: a.role,
    }
  });

  return (
    <>
      <h2 className="text-2xl pb-3 pt-4">Appeared in</h2>
      <section className="flex flex-wrap gap-5">
        {allAnime.map((anime) => (
          <Link
            href={`/anime/${Number(anime.id)}`}
            key={String(anime.id)}
            className="w-40 shrink-0"
          >
            {anime.image ? (
              <Image
                src={anime.image}
                alt={anime.title}
                className="w-full h-auto object-cover aspect-7/10"
                width={500}
                height={500}
              />
            ) : (
              <div className="w-full aspect-7/10 bg-zinc-600 flex items-center justify-center">
                <span className="text-zinc-400 text-sm">No image</span>
              </div>
            )}
            {anime.title.length > 0 &&
              <p className="text-xs pt-2 text-zinc-300">
                {anime.title}
              </p>
            }
            {anime.role.length > 0 &&
              <p className="text-xs pt-1 text-zinc-300">
                <span className="font-bold">Role:</span> {anime.role}
              </p>
            }
          </Link>
        ))}
      </section>
    </>
  );
}
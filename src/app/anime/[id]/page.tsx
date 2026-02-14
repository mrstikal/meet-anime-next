import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getAnimeById } from '@/lib/api/anime-detail';
import RatingIcon from "@/assets/images/star.svg";
import FavoriteIcon from "@/assets/images/favorite.svg";
import * as React from "react";

export default async function Page({params}: { params: { id: string } }) {
  const resolvedParams = await params;

  const idNumber = Number(resolvedParams.id);

  if (!Number.isFinite(idNumber)) {
    notFound();
  }

  let anime;
  try {
    anime = await getAnimeById(idNumber);
  } catch {
    notFound();
  }

  const imageUrl =
    anime.images?.webp?.large_image_url ??
    anime.images?.jpg?.large_image_url ??
    anime.images?.webp?.image_url ??
    anime.images?.jpg?.image_url ??
    null;

  const genres = anime.genres.map(g => g.name).join(', ');
  const themes = anime.themes.map(t => t.name).join(', ');
  const studios = anime.studios.map(s => s.name).join(', ');
  const producers =  anime.producers.map(p => p.name).join(', ');

  return (
      <main className="pt-4 flex justify-center">
      <div className="max-w-400 px-8">
        <h1 className="text-4xl font-bold mb-4">{anime.title}</h1>

        <div className="md:flex items-start gap-6">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={anime.title}
              className="object-cover aspect-7/10 min-w-40 max-w-75 shrink mb-4 md:mb-0"
              width={500}
              height={500}
            />
          ) : (
            <div className="w-full aspect-7/10 bg-zinc-600 flex items-center justify-center">
              <span className="text-zinc-400 text-sm">No image</span>
            </div>
          )}

          <section>
            <div className="text-sm pb-4 space-y-3 text-green-100/70 leading-tight font-light">
              {anime.type && anime.episodes &&
                <div>
                  {anime.type} ({anime.episodes} {anime.episodes > 1 ? "episodes" : "episode"} )
                  {anime.duration && anime.duration !== 'Unknown' ? `, ${anime.duration}` : null}
                </div>
              }
              {genres.length > 0 &&
                <div><span className="font-medium">Genre: </span>{genres}</div>
              }
              {themes.length > 0 &&
                <div><span className="font-medium">Theme:</span> {themes}</div>
              }
              {anime.score !== null && anime.scored_by !== null &&
              <p className="text-sm flex items-center gap-1.5 leading-3">
                <RatingIcon className="w-2.5 h-2.5"/>
                <span className="relative leading-none">
                 {anime.score}
                  <span className="inline-block w-0.5"></span>/<span className="inline-block w-0.5"></span>
                 {anime.scored_by}
                </span>
              </p>
              }
              {anime.favorites &&
                <p className="flex items-center pt-1">
                  <FavoriteIcon className="w-2.5 h-2.5 mr-1.5"/>
                  <span className="leading-0 relative">{anime.favorites}</span>
                </p>
              }
            </div>

            {anime.synopsis?.trim() &&
              <p className="py-6 font-light text-zinc-50 leading-[1.6] whitespace-pre-wrap max-w-200">
                {anime.synopsis}
              </p>
            }

            <div className="text-sm pt-4 space-y-3 text-blue-100/70 leading-tight font-light">
              {anime.source && anime.source.length > 1 &&
                <p><span className="font-medium">Source:</span> {anime.source}</p>
              }
              {studios.length > 1 &&
                <p><span className="font-medium">Studio:</span> {studios}</p>
              }
              {producers.length > 1 &&
                <p><span className="font-medium">Produced by:</span> {producers}</p>
              }
            </div>

          </section>
        </div>
      </div>
    </main>
  );
}
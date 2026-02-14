import Image from 'next/image';
import type { Anime } from '@/types/character';
import { notFound } from 'next/navigation';
import { getCharacterById } from '@/lib/api/character-detail';
import AnimeGrid from "@/app/characters/[id]/AnimeGrid";
import FavoriteIcon from "@/assets/images/favorite.svg";
import * as React from "react";

export default async function Page({params}: { params: { id: string } }) {
  const resolvedParams = await params;

  const idNumber = Number(resolvedParams.id);

  if (!Number.isFinite(idNumber)) {
    notFound();
  }

  let character;
  try {
    character = await getCharacterById(idNumber);
  } catch {
    notFound();
  }

  const imageUrl =
    character.images?.webp?.image_url ??
    character.images?.jpg?.image_url ??
    character.images?.webp?.small_image_url ??
    character.images?.jpg?.small_image_url ??
    null;


  const nicknames = character.nicknames.length > 0 ? character.nicknames.join(', ') : null;
  const voices: string[] = [];
  if (character.voices.length > 0) {
    character.voices.forEach((voice) => {
      voices.push(voice.person.name + ' (' + voice.language + ')\n')
    })
  }

  const joinedVoices = voices.join('')

  return (
    <main className="pt-4 flex justify-center">
      <div className="max-w-400 px-8">
        <h1 className="text-4xl font-bold mb-4">{character.name}</h1>

        <div className="md:flex items-start gap-6">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={character.name}
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
              {nicknames &&
                <div><span className="font-medium">Nicknames: </span>{nicknames}</div>
              }
              {joinedVoices.length > 0 &&
                <div className="whitespace-pre-wrap leading-relaxed">
                  <div className="font-medium">Voices:</div>
                  {joinedVoices}
                </div>
              }
              {character.favorites &&
                <p className="flex items-center pt-1">
                  <FavoriteIcon className="w-2.5 h-2.5 mr-1.5"/>
                  <span className="leading-0 relative">{character.favorites}</span>
                </p>
              }
            </div>
            {character.about?.trim() &&
              <p className="py-6 font-light text-zinc-50 leading-[1.6] whitespace-pre-wrap max-w-200">
                {character.about}
              </p>
            }


          </section>
        </div>
        <AnimeGrid anime={character.anime} />
      </div>
    </main>
  );
}
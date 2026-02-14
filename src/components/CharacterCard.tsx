// src/components/CharacterCard.jsx
import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';
import type { CharacterCardData } from '@/types/character';
import FavoriteIcon from '@/assets/images/favorite.svg';

export default function CharacterCard({character}: { character: CharacterCardData }) {
  const nicknamesText =
    character.nicknames.length > 0 ? character.nicknames.slice(0, 3).join(', ') : null;

  const [imgFailed, setImgFailed] = React.useState(false);

  return (
    <Link
      href={`/characters/${character.id}`}
      className="flex flex-col relative overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
    >
      {character.image && !imgFailed ? (
        <Image
          src={character.image}
          alt={character.name}
          className="w-full h-auto object-cover aspect-7/10"
          width={500}
          height={500}
          onError={() => setImgFailed(true)}
        />
      ) : (
        <div className="w-full aspect-7/10 bg-zinc-800 flex items-center justify-center">
          <span className="text-zinc-400 text-sm">No image</span>
        </div>
      )}

      <h2 className="text-xl font-light pt-2 leading-tight">{character.name}</h2>

      <div className="text-xs pt-2.5 text-zinc-200">
        <div className="flex items-center mb-1 text-yellow-100">
          <FavoriteIcon className="w-2.5 h-2.5 mr-1"/>
          <span className="leading-0 relative">{character.favorites ?? '—'}</span>
        </div>
        {nicknamesText &&
          <div>Nicknames: {nicknamesText ?? '—'}</div>
        }
      </div>
    </Link>
  );
}
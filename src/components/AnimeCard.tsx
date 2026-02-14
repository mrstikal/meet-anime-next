import type { Anime } from '@/types/anime';
import Link from 'next/link';
import Image from 'next/image';
import RatingIcon from '@/assets/images/star.svg';

type Props = {
  anime: Anime;
  href: string;
  className?: string;
};

export default function AnimeCard({ anime, href, className }: Props) {
  const imageUrl =
    anime.images?.webp?.large_image_url ??
    anime.images?.jpg?.large_image_url ??
    anime.images?.webp?.image_url ??
    anime.images?.jpg?.image_url ??
    null;

  return (
    <Link
      href={href}
      className={[
        'flex flex-col relative overflow-hidden hover:shadow-lg transition-shadow cursor-pointer',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {imageUrl ? (
        <Image
          src={imageUrl}
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

      <h2 className="text-xl font-light pt-2 leading-tight">{anime.title}</h2>

      <div className="text-xs pt-2.5">
        {anime.type ? anime.type : null}
        {anime.type && anime.episodes != null ? ' ' : null}
        {anime.episodes != null ? (
          <>
            ({anime.episodes} {anime.episodes === 1 ? 'episode' : 'episodes'})
          </>
        ) : null}
      </div>

      {anime.score != null && anime.scored_by != null ? (
        <p className="py-0.5 text-xs flex items-center gap-1.5 text-yellow-100 leading-3">
          <RatingIcon className="w-2.5 h-2.5" />
          <span className="relative leading-none">
            {anime.score}
            <span className="inline-block w-0.5"></span>/<span className="inline-block w-0.5"></span>
            {anime.scored_by}
          </span>
        </p>
      ) : (
        <p className="py-0.5 text-xs flex items-center gap-1.5 text-yellow-100 leading-3">
          No rating available
        </p>
      )}
    </Link>
  );
}
export type Anime = {
  mal_id: number,
  url: string,
  images: {
    jpg: {
      image_url: string | null,
      small_image_url: string | null,
      large_image_url: string | null,
    },
    webp: {
      image_url: string | null,
      small_image_url: string | null,
      large_image_url: string | null
    }
  },
  trailer: {
    youtube_id: string | null,
    url: string | null,
    embed_url: string | null
  },
  approved: boolean,
  titles: [
    {
      type: string,
      title: string
    }
  ],
  title: string,
  title_english: string,
  title_japanese: string,
  title_synonyms: [
    string
  ],
  type: string,
  source: string,
  episodes: number | null,
  status: string | null,
  airing: boolean,
  aired: {
    from: string | null,
    to: string | null,
    prop: {
      from: {
        day: number | null,
        month: number | null,
        year: number | null
      },
      to: {
        day: number | null,
        month: number | null,
        year: number | null
      },
    }
  },
  duration: string,
  rating: string | null,
  score: number | null,
  scored_by: number | null,
  rank: number | null,
  popularity: number | null,
  members: number | null,
  favorites: number | null,
  synopsis: string,
  background: string,
  season: string | null,
  year: number | null,
  broadcast: {
    day: string | null,
    time: string | null,
    timezone: string | null,
  },
  producers: [
    {
      mal_id: number,
      type: string,
      name: string,
      url: string
    }
  ],
  licensors: [
    {
      mal_id: number,
      type: string,
      name: string,
      url: string
    }
  ],
  studios: [
    {
      mal_id: number,
      type: string,
      name: string,
      url: string
    }
  ],
  genres: [
    {
      mal_id: number,
      type: string,
      name: string,
      url: string
    }
  ],
  explicit_genres: [
    {
      mal_id: number,
      type: string,
      name: string,
      url: string
    }
  ],
  themes: [
    {
      mal_id: number,
      type: string,
      name: string,
      url: string
    }
  ],
  demographics: [
    {
      mal_id: number,
      type: string,
      name: string,
      url: string
    }
  ]
}
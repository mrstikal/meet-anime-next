export type Anime = {
  anime: {
    mal_id: number,
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
    title: string,
  }
  role: string,
}

export type CharacterCardData = {
  id: number,
  name: string,
  image?: string | null,
  favorites: number | null,
  nicknames: string[],
}

export type Character = CharacterCardData & {
  voices: {
    language: string,
    person: {
      name: string
    }
  }[],
  anime: Anime[],
  about?: string | null,
  images: {
    jpg: {
      image_url: string | null,
      small_image_url: string | null,
    },
    webp: {
      image_url: string | null,
      small_image_url: string | null,
    }
  },
}
// src/components/GenreSelect/useGenreRouting.ts
import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { GenreSelectItem } from '@/types/genre-select';

export function useGenreRouting() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isPending, startTransition] = React.useTransition();

  const currentGenre = searchParams.get('id') || '';

  const onChange = React.useCallback(
    (item: GenreSelectItem | null) => {
      if (!item) return;

      const params = new URLSearchParams(searchParams.toString());

      if (item.value === '') params.delete('id');
      else params.set('id', item.value);

      const qs = params.toString();

      startTransition(() => {
        router.push(qs ? `/genres?${qs}` : '/genres');
      });
    },
    [router, searchParams]
  );

  return { currentGenre, onChange, isPending };
}
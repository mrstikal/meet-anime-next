// src/components/GenreSelect/useComboWidth.ts
import * as React from 'react';
import type { GenreSelectItem } from '@/types/genre-select';

export function useComboWidth({
                                inputElRef,
                                items,
                              }: {
  inputElRef: React.RefObject<HTMLInputElement | null>;
  items: GenreSelectItem[];
}) {
  const [comboWidth, setComboWidth] = React.useState<number | undefined>(undefined);

  React.useEffect(() => {
    const inputEl = inputElRef.current;
    if (!inputEl) return;

    const style = window.getComputedStyle(inputEl);
    const font = style.font;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.font = font;

    const maxTextWidth = items.reduce((max, it) => {
      const w = ctx.measureText(it.label).width;
      return Math.max(max, w);
    }, 0);

    const leftPadding = 14;
    const rightPaddingAndButton = 40;
    const extra = 16;

    const desired = Math.ceil(maxTextWidth + leftPadding + rightPaddingAndButton + extra);

    const maxAllowed = Math.max(240, window.innerWidth - 16);
    const clamped = Math.min(desired, maxAllowed);

    setComboWidth(clamped);
  }, [inputElRef, items]);

  return comboWidth;
}
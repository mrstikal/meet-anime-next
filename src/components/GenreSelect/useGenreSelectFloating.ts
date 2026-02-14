import * as React from 'react';
import { autoUpdate, flip, offset, shift, size, useFloating } from '@floating-ui/react-dom';

export function useGenreSelectFloating() {
  const { refs, floatingStyles } = useFloating({
    placement: 'bottom-start',
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(8),
      flip(),
      shift({ padding: 8 }),
      size({
        padding: 8,
        apply({ rects, availableHeight, elements }) {
          Object.assign(elements.floating.style, {
            width: `${rects.reference.width}px`,
            maxHeight: `${Math.max(160, availableHeight)}px`,
          });
        },
      }),
    ],
  });

  const setReference = React.useCallback((node: HTMLElement | null) => refs.setReference(node), [refs]);
  const setFloating = React.useCallback((node: HTMLElement | null) => refs.setFloating(node), [refs]);

  return { floatingStyles, setReference, setFloating };
}
/**
 * useDocumentTitle – setzt den Browser-Tab-Titel und stellt beim Unmounten
 * den vorherigen wieder her (z.B. beim Verlassen einer Board-Seite).
 * Ohne das zeigte JEDE Seite dauerhaft nur "OpenFloorball" im Tab – bei
 * mehreren gleichzeitig offenen Boards/Tabs war nicht unterscheidbar,
 * welcher Tab welches Board zeigt.
 */
import { useEffect } from 'react';

export function useDocumentTitle(title) {
  useEffect(() => {
    if (!title) return undefined;
    const previous = document.title;
    document.title = `${title} – OpenFloorball`;
    return () => { document.title = previous; };
  }, [title]);
}

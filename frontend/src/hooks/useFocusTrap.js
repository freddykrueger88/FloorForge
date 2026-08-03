/**
 * useFocusTrap – Fokus-Trap für Modal-Dialoge (Issue #19)
 * Merkt sich das vorher fokussierte Element, fokussiert beim Öffnen
 * initialFocusRef?.current oder das erste fokussierbare Element im
 * Container, fängt Tab/Shift+Tab am Anfang/Ende ab, ruft onEscape() bei
 * Escape auf und stellt beim Schließen den vorherigen Fokus wieder her.
 */
import { useEffect } from 'react';

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

function getFocusable(container) {
  return Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR))
    .filter((el) => el.offsetParent !== null);
}

export function useFocusTrap(containerRef, { active = true, initialFocusRef, onEscape } = {}) {
  useEffect(() => {
    if (!active) return undefined;
    const container = containerRef.current;
    if (!container) return undefined;

    const previouslyFocused = document.activeElement;
    const initial = initialFocusRef?.current ?? getFocusable(container)[0];
    initial?.focus();

    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        onEscape?.();
        return;
      }
      if (e.key !== 'Tab') return;

      const focusable = getFocusable(container);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    container.addEventListener('keydown', handleKeyDown);
    return () => {
      container.removeEventListener('keydown', handleKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [containerRef, active, initialFocusRef, onEscape]);
}

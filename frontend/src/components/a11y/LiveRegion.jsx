/**
 * LiveRegion – rein akustische Screenreader-Ankündigungen (Issue #19)
 * Sichtbar nirgends (sr-only), einmal global gerendert, angesteuert über
 * `announceStore.announce(msg)` von überall in der App.
 */
import useAnnounceStore from '../../store/announceStore.js';

export default function LiveRegion() {
  const message = useAnnounceStore((s) => s.message);
  return (
    <div aria-live="polite" role="status" className="sr-only">
      {message}
    </div>
  );
}

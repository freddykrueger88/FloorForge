/**
 * PlayerAccessibleList – Tastaturzugänglicher Parallel-Zugang zu den
 * Spielern auf dem Konva-Canvas (Issue #27)
 *
 * Konva rendert auf <canvas>, daher sind einzelne Spieler-Token nicht Teil
 * der nativen Tab-Reihenfolge. Diese unsichtbare (bis auf Fokus) Liste
 * bietet denselben "Spieler auswählen → Info-Panel öffnen"-Vorgang per
 * Tab + Enter, wie er per Maus/Touch schon funktioniert.
 */
export default function PlayerAccessibleList({ players = [], onSelectPlayer, selectedPlayerId }) {
  return (
    <ul aria-label="Spieler (Tastaturzugriff)" style={{ listStyle: 'none' }}>
      {players.map((p) => (
        <li key={p.id}>
          <button
            type="button"
            className="sr-only sr-only-focusable"
            onClick={() => onSelectPlayer?.(p.id)}
            aria-pressed={p.id === selectedPlayerId}
          >
            {p.role}{p.name ? ` – ${p.name}` : ''} ({p.team === 'home' ? 'Heimteam' : 'Auswärtsteam'})
          </button>
        </li>
      ))}
    </ul>
  );
}

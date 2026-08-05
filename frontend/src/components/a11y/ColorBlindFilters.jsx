/**
 * ColorBlindFilters – SVG-Filter-Definitionen für den Farbblind-Modus
 * (Issue #18). Rendert nichts Sichtbares, nur <filter>-Defs, die per
 * `filter: url(#openfloorball-cb-...)` auf documentElement angewendet werden
 * (siehe settingsController/SettingsPage – data-colorblind-mode Attribut).
 *
 * Hinweis: Basis-Implementierung auf Ebene von Issue #18 (ein einfacher,
 * global anwendbarer Farbfilter je Typ). Für eine klinisch validierte
 * Daltonisierung bzw. tiefere Prüfung siehe Issue #19.
 */
export default function ColorBlindFilters() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <defs>
        <filter id="openfloorball-cb-protanopie">
          <feColorMatrix type="matrix" values="
            0.567 0.433 0     0 0
            0.558 0.442 0     0 0
            0     0.242 0.758 0 0
            0     0     0     1 0" />
        </filter>
        <filter id="openfloorball-cb-deuteranopie">
          <feColorMatrix type="matrix" values="
            0.625 0.375 0   0 0
            0.7   0.3   0   0 0
            0     0.3   0.7 0 0
            0     0     0   1 0" />
        </filter>
        <filter id="openfloorball-cb-tritanopie">
          <feColorMatrix type="matrix" values="
            0.95 0.05  0     0 0
            0    0.433 0.567 0 0
            0    0.475 0.525 0 0
            0    0     0     1 0" />
        </filter>
        <filter id="openfloorball-cb-monochromie">
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </defs>
    </svg>
  );
}

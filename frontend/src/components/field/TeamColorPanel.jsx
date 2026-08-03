/**
 * TeamColorPanel – Farbkonfiguration für Heim/Gast-Teams und Ball
 * Issue #14 – v0.4.0
 */
import { useState } from 'react';
import { IFF_BALL_COLORS, DEFAULT_TEAM_COLORS } from '../../constants/fieldConfig.js';
import styles from './TeamColorPanel.module.css';

export default function TeamColorPanel({
  homeColor,
  awayColor,
  ballColor,
  onChangeHomeColor,
  onChangeAwayColor,
  onChangeBallColor,
  onClose,
}) {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
    onClose?.();
  };

  return (
    <div className={styles.wrapper}>
      <button
        className={styles.toggleBtn}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Teamfarben konfigurieren"
        title="Teamfarben"
      >
        <span
          className={styles.colorDot}
          style={{ background: homeColor ?? DEFAULT_TEAM_COLORS.home.fill }}
        />
        <span
          className={styles.colorDot}
          style={{ background: awayColor ?? DEFAULT_TEAM_COLORS.away.fill }}
        />
        <span>🎨</span>
      </button>

      {open && (
        <div
          className={styles.panel}
          role="dialog"
          aria-label="Farbeinstellungen"
        >
          <header className={styles.panelHeader}>
            <span className={styles.panelTitle}>Teamfarben &amp; Ball</span>
            <button
              className={styles.closeBtn}
              onClick={handleClose}
              aria-label="Schließen"
            >✕</button>
          </header>

          {/* Heimteam */}
          <section className={styles.section}>
            <label className={styles.sectionLabel}>Heimteam</label>
            <div className={styles.colorRow}>
              <div className={styles.colorField}>
                <span className={styles.colorFieldLabel}>Füllfarbe</span>
                <input
                  type="color"
                  className={styles.colorInput}
                  value={homeColor ?? DEFAULT_TEAM_COLORS.home.fill}
                  onChange={(e) => onChangeHomeColor(e.target.value)}
                  aria-label="Heimteam Füllfarbe"
                />
              </div>
              <button
                className={styles.resetBtn}
                onClick={() => onChangeHomeColor(DEFAULT_TEAM_COLORS.home.fill)}
                title="Standardfarbe wiederherstellen"
              >↺</button>
            </div>
          </section>

          {/* Gastteam */}
          <section className={styles.section}>
            <label className={styles.sectionLabel}>Gastteam</label>
            <div className={styles.colorRow}>
              <div className={styles.colorField}>
                <span className={styles.colorFieldLabel}>Füllfarbe</span>
                <input
                  type="color"
                  className={styles.colorInput}
                  value={awayColor ?? DEFAULT_TEAM_COLORS.away.fill}
                  onChange={(e) => onChangeAwayColor(e.target.value)}
                  aria-label="Gastteam Füllfarbe"
                />
              </div>
              <button
                className={styles.resetBtn}
                onClick={() => onChangeAwayColor(DEFAULT_TEAM_COLORS.away.fill)}
                title="Standardfarbe wiederherstellen"
              >↺</button>
            </div>
          </section>

          {/* Ball */}
          <section className={styles.section}>
            <label className={styles.sectionLabel}>Ball</label>
            <div className={styles.ballPresets}>
              {IFF_BALL_COLORS.map((bc) => (
                <button
                  key={bc.id}
                  className={`${styles.ballPreset} ${ballColor === bc.hex ? styles.ballPresetActive : ''}`}
                  style={{ background: bc.hex, border: bc.hex === '#ffffff' ? '1.5px solid #aaa' : 'none' }}
                  onClick={() => onChangeBallColor(bc.hex)}
                  title={`${bc.label}${bc.official ? ' (IFF offiziell)' : ''}`}
                  aria-label={bc.label}
                />
              ))}
              <input
                type="color"
                className={styles.colorInput}
                value={ballColor ?? '#f97316'}
                onChange={(e) => onChangeBallColor(e.target.value)}
                title="Eigene Ballfarbe wählen"
                aria-label="Eigene Ballfarbe"
              />
            </div>
            <p className={styles.hint}>
              ⚠ IFF-Wettkampf: nur Weiß oder Rot offiziell erlaubt
            </p>
          </section>
        </div>
      )}
    </div>
  );
}

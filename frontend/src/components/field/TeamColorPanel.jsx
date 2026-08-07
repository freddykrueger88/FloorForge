/**
 * TeamColorPanel – Farbkonfiguration für Heim/Gast-Teams und Ball
 * Issue #14 – v0.4.0
 */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Palette, X, RotateCcw } from 'lucide-react';
import { IFF_BALL_COLORS, DEFAULT_TEAM_COLORS } from '../../constants/fieldConfig.js';
import Button from '../common/Button.jsx';
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
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
    onClose?.();
  };

  return (
    <div className={styles.wrapper}>
      <Button
        variant="secondary"
        size="sm"
        className={styles.toggleBtn}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={t('teamColorPanel.configure')}
        title={t('teamColorPanel.title')}
      >
        <span
          className={styles.colorDot}
          style={{ background: homeColor ?? DEFAULT_TEAM_COLORS.home.fill }}
        />
        <span
          className={styles.colorDot}
          style={{ background: awayColor ?? DEFAULT_TEAM_COLORS.away.fill }}
        />
        <span><Palette size={16} aria-hidden="true" /></span>
      </Button>

      {open && (
        <div
          className={styles.panel}
          role="dialog"
          aria-label={t('teamColorPanel.dialogLabel')}
        >
          <header className={styles.panelHeader}>
            <span className={styles.panelTitle}>{t('teamColorPanel.panelTitle')}</span>
            <Button
              variant="secondary"
              size="sm"
              iconOnly
              onClick={handleClose}
              aria-label={t('teamColorPanel.close')}
            ><X size={18} aria-hidden="true" /></Button>
          </header>

          {/* Heimteam */}
          <section className={styles.section}>
            <label className={styles.sectionLabel}>{t('teams.home')}</label>
            <div className={styles.colorRow}>
              <div className={styles.colorField}>
                <span className={styles.colorFieldLabel}>{t('teamColorPanel.fillColor')}</span>
                <input
                  type="color"
                  className={styles.colorInput}
                  value={homeColor ?? DEFAULT_TEAM_COLORS.home.fill}
                  onChange={(e) => onChangeHomeColor(e.target.value)}
                  aria-label={t('teamColorPanel.fillColorAria', { team: t('teams.home') })}
                />
              </div>
              <Button
                variant="secondary"
                size="sm"
                iconOnly
                onClick={() => onChangeHomeColor(DEFAULT_TEAM_COLORS.home.fill)}
                title={t('teamColorPanel.resetDefault')}
                aria-label={t('teamColorPanel.resetDefault')}
              ><RotateCcw size={16} aria-hidden="true" /></Button>
            </div>
          </section>

          {/* Gastteam */}
          <section className={styles.section}>
            <label className={styles.sectionLabel}>{t('teams.away')}</label>
            <div className={styles.colorRow}>
              <div className={styles.colorField}>
                <span className={styles.colorFieldLabel}>{t('teamColorPanel.fillColor')}</span>
                <input
                  type="color"
                  className={styles.colorInput}
                  value={awayColor ?? DEFAULT_TEAM_COLORS.away.fill}
                  onChange={(e) => onChangeAwayColor(e.target.value)}
                  aria-label={t('teamColorPanel.fillColorAria', { team: t('teams.away') })}
                />
              </div>
              <Button
                variant="secondary"
                size="sm"
                iconOnly
                onClick={() => onChangeAwayColor(DEFAULT_TEAM_COLORS.away.fill)}
                title={t('teamColorPanel.resetDefault')}
                aria-label={t('teamColorPanel.resetDefault')}
              ><RotateCcw size={16} aria-hidden="true" /></Button>
            </div>
          </section>

          {/* Ball */}
          <section className={styles.section}>
            <label className={styles.sectionLabel}>{t('teamColorPanel.ball')}</label>
            <div className={styles.ballPresets}>
              {IFF_BALL_COLORS.map((bc) => (
                <button
                  key={bc.id}
                  className={`${styles.ballPreset} ${ballColor === bc.hex ? styles.ballPresetActive : ''}`}
                  style={{ background: bc.hex, border: bc.hex === '#ffffff' ? '1.5px solid #aaa' : 'none' }}
                  onClick={() => onChangeBallColor(bc.hex)}
                  title={`${bc.label}${bc.official ? t('teamColorPanel.iffOfficialSuffix') : ''}`}
                  aria-label={bc.label}
                />
              ))}
              <input
                type="color"
                className={styles.colorInput}
                value={ballColor ?? '#f97316'}
                onChange={(e) => onChangeBallColor(e.target.value)}
                title={t('teamColorPanel.customBallColorTitle')}
                aria-label={t('teamColorPanel.customBallColor')}
              />
            </div>
            <p className={styles.hint}>
              {t('teamColorPanel.iffHint')}
            </p>
          </section>
        </div>
      )}
    </div>
  );
}

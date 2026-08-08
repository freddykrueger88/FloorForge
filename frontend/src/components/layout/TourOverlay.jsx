/**
 * TourOverlay – Onboarding-Tour für neue Nutzer (ISSUE 023, "Einfach
 * starten", CLAUDE.md §15). Global gemountet (siehe App.jsx), damit sie
 * auf jeder Route erscheinen kann – die Ziel-Elemente sind Nav-Links in
 * Header.jsx (data-tour-Attribute).
 *
 * Persistenz bewusst über die bestehende, ungefilterte Settings-API
 * (`preferences_json`, siehe useSettings.js) statt einer neuen users-
 * Spalte/eines neuen Endpunkts – kein Backend-Change nötig.
 *
 * Vereinfachung: die Info-Karte bleibt an einer festen Position (unten
 * mittig), nur der abgedunkelte Bereich bekommt einen visuellen
 * "Ausschnitt" über dem Zielelement (CSS box-shadow-Trick). Ein
 * separater, unsichtbarer Klick-Fänger blockiert währenddessen die
 * ganze Seite – die Tour ist bewusst modal, Fortschritt nur über die
 * Weiter/Zurück/Überspringen-Buttons, nicht durch Klicks auf das
 * hervorgehobene Element selbst.
 */
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useAuthStore from '../../store/authStore.js';
import useTourStore from '../../store/tourStore.js';
import { useSettings } from '../../hooks/useSettings.js';
import { useFocusTrap } from '../../hooks/useFocusTrap.js';
import useAnnounceStore from '../../store/announceStore.js';
import Button from '../common/Button.jsx';
import styles from './TourOverlay.module.css';

const STEPS = [
  { target: null,             titleKey: 'tour.welcomeTitle',   bodyKey: 'tour.welcomeBody' },
  { target: 'nav-boards',     titleKey: 'tour.boardsTitle',    bodyKey: 'tour.boardsBody' },
  { target: 'nav-trainings',  titleKey: 'tour.trainingsTitle', bodyKey: 'tour.trainingsBody' },
  { target: 'nav-library',    titleKey: 'tour.libraryTitle',   bodyKey: 'tour.libraryBody' },
  { target: 'nav-settings',   titleKey: 'tour.settingsTitle',  bodyKey: 'tour.settingsBody' },
  { target: null,             titleKey: 'tour.doneTitle',      bodyKey: 'tour.doneBody' },
];

export default function TourOverlay() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const active = useTourStore((s) => s.active);
  const stepIndex = useTourStore((s) => s.stepIndex);
  const { settings, loading, updateSettings } = useSettings();
  const hasCheckedAutoStart = useRef(false);
  const containerRef = useRef(null);
  const [rect, setRect] = useState(null);

  // Einmaliger Auto-Start: sobald die Settings geladen sind und die Tour
  // laut Server noch nicht abgeschlossen wurde. ref-gesichert, damit ein
  // erneutes Nachladen der Settings (z.B. nach anderen Änderungen) die
  // Tour nicht ein zweites Mal auslöst.
  useEffect(() => {
    if (hasCheckedAutoStart.current) return;
    if (!user || loading || !settings) return;
    hasCheckedAutoStart.current = true;
    if (!settings.tourCompleted) useTourStore.getState().start();
  }, [user, loading, settings]);

  const step = STEPS[stepIndex];

  // Spotlight-Rechteck über dem Zielelement, bei Resize/Scroll neu
  // berechnet (nur während die Tour aktiv ist).
  useEffect(() => {
    if (!active || !step?.target) { setRect(null); return undefined; }
    const update = () => {
      // Es kann mehrere Elemente mit demselben data-tour-Attribut geben
      // (z.B. Header.jsx: derselbe Nav-Link einmal in der Desktop-Leiste,
      // einmal im mobilen Hamburger-Menü – je nach Bildschirmbreite ist
      // nur eines davon sichtbar). Das erste, tatsächlich sichtbare
      // Element auswählen statt blind das erste im DOM.
      const candidates = document.querySelectorAll(`[data-tour="${step.target}"]`);
      const el = Array.from(candidates).find((c) => c.offsetParent !== null);
      setRect(el ? el.getBoundingClientRect() : null);
    };
    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [active, step]);

  useEffect(() => {
    if (!active || !step) return;
    useAnnounceStore.getState().announce(t(step.titleKey));
  }, [active, step, t]);

  const handleClose = async () => {
    const isLast = stepIndex === STEPS.length - 1;
    useTourStore.getState()[isLast ? 'finish' : 'skip']();
    try { await updateSettings({ tourCompleted: true }); } catch { /* nicht kritisch, Tour bleibt lokal geschlossen */ }
  };

  useFocusTrap(containerRef, { active, onEscape: handleClose });

  if (!active || !step) return null;

  const isFirst = stepIndex === 0;
  const isLast = stepIndex === STEPS.length - 1;

  return (
    <div ref={containerRef} className={styles.wrapper}>
      <div className={styles.clickCatcher} aria-hidden="true" />
      {rect ? (
        <div
          className={styles.spotlight}
          aria-hidden="true"
          style={{
            top: rect.top - 6, left: rect.left - 6,
            width: rect.width + 12, height: rect.height + 12,
          }}
        />
      ) : (
        <div className={styles.plainBackdrop} aria-hidden="true" />
      )}

      <div className={styles.card} role="dialog" aria-modal="true" aria-labelledby="tour-title">
        <p className={styles.stepCounter}>{t('tour.stepCounter', { current: stepIndex + 1, total: STEPS.length })}</p>
        <h2 id="tour-title" className={styles.title}>{t(step.titleKey)}</h2>
        <p className={styles.body}>{t(step.bodyKey)}</p>

        <div className={styles.actions}>
          <Button variant="ghost" size="sm" onClick={handleClose}>{t('tour.skip')}</Button>
          <div className={styles.navButtons}>
            {!isFirst && (
              <Button variant="secondary" size="sm" onClick={() => useTourStore.getState().prev()}>
                {t('tour.back')}
              </Button>
            )}
            {isLast ? (
              <Button variant="primary" size="sm" onClick={handleClose}>{t('tour.finish')}</Button>
            ) : (
              <Button variant="primary" size="sm" onClick={() => useTourStore.getState().next()}>{t('tour.next')}</Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

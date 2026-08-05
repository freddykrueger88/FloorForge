/**
 * FormationsPanel – Formations-Vorlagen speichern/laden (Issue #46)
 * Speichert die aktuelle Spieler-Aufstellung als wiederverwendbare,
 * benannte Vorlage; über alle eigenen Boards hinweg nutzbar. Bei
 * abweichendem Feldtyp übernimmt der Aufrufer (BoardEditorPage) die
 * Skalierung via rescalePlayers().
 */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FIELD_TYPE_LABELS } from '../../constants/fieldConfig.js';
import styles from './FormationsPanel.module.css';

export default function FormationsPanel({
  formations = [],
  onSave,
  onLoad,
  onDelete,
  canAddFormation = true,
  teams = [],
}) {
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(false);
  const [newName,   setNewName  ] = useState('');
  const [teamId,    setTeamId   ] = useState('');

  const handleSave = () => {
    const name = newName.trim();
    if (!name || !canAddFormation) return;
    onSave?.(name, teamId === '' ? null : teamId);
    setNewName('');
    setTeamId('');
  };

  return (
    <section className={styles.panel} aria-label={t('formations.sectionAriaLabel')}>
      <header className={styles.header}>
        <button
          className={styles.collapseBtn}
          onClick={() => setCollapsed((v) => !v)}
          aria-expanded={!collapsed}
          aria-label={collapsed ? t('formations.expand') : t('formations.collapse')}
        >
          <span aria-hidden="true">{collapsed ? '▸' : '▾'}</span> {t('formations.title')}
        </button>
        {!collapsed && <span className={styles.count}>{formations.length}/20</span>}
      </header>

      {!collapsed && (
        <>
          {formations.length === 0 && (
            <p className={styles.emptyHint}>{t('formations.emptyHint')}</p>
          )}

          <ul className={styles.list} role="list">
            {formations.map((formation) => (
              <li key={formation._id} className={styles.item}>
                <button
                  className={styles.loadBtn}
                  onClick={() => onLoad?.(formation)}
                  title={t('formations.loadTitle')}
                >
                  <span className={styles.name}>{formation.name}</span>
                  {formation.teamId && (
                    <span className={styles.teamBadge} title={teams.find((tm) => tm._id === formation.teamId)?.name ?? t('formations.teamBadgeFallback')}>
                      👥
                    </span>
                  )}
                  <span className={styles.fieldBadge}>{FIELD_TYPE_LABELS[formation.fieldType] ?? formation.fieldType}</span>
                </button>
                <button
                  className={styles.deleteBtn}
                  onClick={() => onDelete?.(formation._id)}
                  aria-label={t('formations.deleteAriaLabel', { name: formation.name })}
                  title={t('formations.deleteTitle')}
                >
                  🗑
                </button>
              </li>
            ))}
          </ul>

          <div className={styles.addRow}>
            <input
              className={styles.newNameInput}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              placeholder={t('formations.newNamePlaceholder')}
              maxLength={40}
              disabled={!canAddFormation}
              aria-label={t('formations.newNameAriaLabel')}
            />
            {teams.length > 0 && (
              <select
                className={styles.newTeamSelect}
                value={teamId}
                onChange={(e) => setTeamId(e.target.value)}
                disabled={!canAddFormation}
                aria-label={t('formations.teamAriaLabel')}
              >
                <option value="">{t('formations.personalOption')}</option>
                {teams.map((tm) => (
                  <option key={tm._id} value={tm._id}>{tm.name}</option>
                ))}
              </select>
            )}
            <button
              className={styles.saveBtn}
              onClick={handleSave}
              disabled={!canAddFormation || !newName.trim()}
              aria-label={t('formations.saveAriaLabel')}
              title={t('formations.saveTitle')}
            >
              💾
            </button>
          </div>
          {!canAddFormation && <p className={styles.limitHint}>{t('formations.limitHint')}</p>}
        </>
      )}
    </section>
  );
}

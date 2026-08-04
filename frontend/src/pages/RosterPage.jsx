/**
 * RosterPage – Verwaltung des zentralen Team-Kaders (Issue #53)
 * Name + Rückennummer + Position, wiederverwendbar über alle Boards
 * hinweg. Rein optional – Board-Spieler bleiben frei editierbar.
 */
import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useRoster } from '../hooks/useRoster.js';
import styles from './RosterPage.module.css';

const ROLES = ['TW', 'V', 'C', 'S'];

export default function RosterPage() {
  const { t } = useTranslation();
  const {
    rosterPlayers, loading, error,
    fetchRoster, addRosterPlayer, updateRosterPlayer, deleteRosterPlayer, canAddRosterPlayer,
  } = useRoster();

  const [name,   setName  ] = useState('');
  const [number, setNumber] = useState('');
  const [role,   setRole  ] = useState('');

  const load = useCallback(async () => {
    try { await fetchRoster(); } catch { /* error via hook */ }
  }, [fetchRoster]);

  useEffect(() => { load(); }, [load]);

  const handleAdd = async (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    try {
      await addRosterPlayer({
        name: trimmed,
        jerseyNumber: number === '' ? null : Number(number),
        role: role === '' ? null : role,
      });
      setName(''); setNumber(''); setRole('');
    } catch { /* error via hook */ }
  };

  return (
    <main className={styles.page} id="main-content">
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>{t('roster.title')}</h1>
          <p className={styles.subtitle}>
            {rosterPlayers.length > 0
              ? t('roster.count', { count: rosterPlayers.length })
              : t('roster.noPlayersYet')}
          </p>
        </div>
      </header>

      <form className={styles.addForm} onSubmit={handleAdd}>
        <input
          className={styles.nameInput}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t('roster.namePlaceholder')}
          maxLength={40}
          aria-label={t('roster.nameAriaLabel')}
        />
        <input
          type="number"
          className={styles.numberInput}
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          placeholder={t('roster.numberPlaceholder')}
          min={0}
          max={99}
          aria-label={t('roster.numberAriaLabel')}
        />
        <select
          className={styles.roleSelect}
          value={role}
          onChange={(e) => setRole(e.target.value)}
          aria-label={t('roster.roleAriaLabel')}
        >
          <option value="">{t('roster.roleNone')}</option>
          {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
        <button type="submit" className={styles.addBtn} disabled={loading || !name.trim() || !canAddRosterPlayer}>
          {t('roster.add')}
        </button>
      </form>
      {!canAddRosterPlayer && <p className={styles.limitHint}>{t('roster.limitHint')}</p>}

      {error && (
        <div className={styles.errorBanner} role="alert">⚠️ {error}</div>
      )}

      {rosterPlayers.length === 0 ? (
        <div className={styles.emptyState} role="status">
          <div className={styles.emptyIcon} aria-hidden="true">🧑‍🤝‍🧑</div>
          <p>{t('roster.emptyStateDesc')}</p>
        </div>
      ) : (
        <ul className={styles.list} role="list" aria-label={t('roster.title')}>
          {rosterPlayers.map((player) => (
            <li key={player._id} className={styles.row}>
              <input
                className={styles.rowNameInput}
                defaultValue={player.name}
                onBlur={(e) => {
                  const trimmed = e.target.value.trim();
                  if (trimmed && trimmed !== player.name) updateRosterPlayer(player._id, { name: trimmed });
                  else e.target.value = player.name;
                }}
                maxLength={40}
                aria-label={t('roster.rowNameAriaLabel', { name: player.name })}
              />
              <input
                type="number"
                className={styles.rowNumberInput}
                defaultValue={player.jerseyNumber ?? ''}
                onBlur={(e) => {
                  const val = e.target.value === '' ? null : Number(e.target.value);
                  if (val !== player.jerseyNumber) updateRosterPlayer(player._id, { jerseyNumber: val });
                }}
                min={0}
                max={99}
                aria-label={t('roster.rowNumberAriaLabel', { name: player.name })}
              />
              <select
                className={styles.rowRoleSelect}
                value={player.role ?? ''}
                onChange={(e) => updateRosterPlayer(player._id, { role: e.target.value === '' ? null : e.target.value })}
                aria-label={t('roster.rowRoleAriaLabel', { name: player.name })}
              >
                <option value="">{t('roster.roleNone')}</option>
                {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
              <button
                className={styles.deleteBtn}
                onClick={() => deleteRosterPlayer(player._id)}
                aria-label={t('roster.deleteAriaLabel', { name: player.name })}
                title={t('roster.deleteTitle')}
              >
                🗑
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

/**
 * TrainingsPage – Übersichtsseite aller Trainingseinheiten (Issue #45)
 * Kachel-Ansicht mit Anlegen, Umbenennen, Löschen – analog BoardsPage.jsx.
 */
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useTrainingSessions } from '../hooks/useTrainingSessions.js';
import { useTeams } from '../hooks/useTeams.js';
import TrainingSessionCard from '../components/trainings/TrainingSessionCard.jsx';
import styles from './TrainingsPage.module.css';

export default function TrainingsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    sessions, loading, error,
    fetchSessions, createSession, renameSession, deleteSession, canAddSession,
  } = useTrainingSessions();
  // ROADMAP Phase 2: eigene Teams laden, um Trainingseinheiten optional
  // team-geteilt statt rein persönlich anzulegen.
  const { teams, fetchTeams } = useTeams();

  const [creating, setCreating] = useState(false);
  const [newName,  setNewName ] = useState('');
  const [newTeamId, setNewTeamId] = useState('');

  const load = useCallback(async () => {
    try { await fetchSessions(); } catch { /* error via hook */ }
  }, [fetchSessions]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { fetchTeams().catch(() => {}); }, [fetchTeams]);

  const teamsICanShareWith = teams.filter((tm) => tm.role === 'owner' || tm.role === 'coach');

  const handleCreate = async (e) => {
    e.preventDefault();
    const trimmed = newName.trim();
    if (!trimmed) return;
    try {
      const session = await createSession(trimmed, newTeamId === '' ? null : newTeamId);
      setCreating(false);
      setNewName('');
      setNewTeamId('');
      navigate(`/trainings/${session._id}`);
    } catch { /* error via hook */ }
  };

  const handleRename = async (id, name) => {
    try { await renameSession(id, name); } catch { /* error via hook */ }
  };

  const handleDelete = async (id) => {
    try { await deleteSession(id); } catch { /* error via hook */ }
  };

  return (
    <main className={styles.page} id="main-content">
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>{t('nav.trainings')}</h1>
          <p className={styles.subtitle}>
            {sessions.length > 0
              ? t('trainings.count', { count: sessions.length })
              : t('trainings.noSessionsYet')}
          </p>
        </div>
      </header>

      <div className={styles.actionsBar}>
        {creating ? (
          <form className={styles.createForm} onSubmit={handleCreate}>
            <input
              autoFocus
              className={styles.createInput}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Escape') { setCreating(false); setNewName(''); } }}
              placeholder={t('trainings.namePlaceholder')}
              maxLength={80}
              aria-label={t('trainings.nameAriaLabel')}
            />
            {teamsICanShareWith.length > 0 && (
              <select
                className={styles.createInput}
                value={newTeamId}
                onChange={(e) => setNewTeamId(e.target.value)}
                aria-label={t('trainings.teamAriaLabel')}
              >
                <option value="">{t('trainings.personalOption')}</option>
                {teamsICanShareWith.map((tm) => (
                  <option key={tm._id} value={tm._id}>{tm.name}</option>
                ))}
              </select>
            )}
            <button type="submit" className={styles.newBtn} disabled={loading || !newName.trim()}>
              {t('trainings.confirmCreate')}
            </button>
            <button type="button" className={styles.cancelBtn} onClick={() => { setCreating(false); setNewName(''); }}>
              {t('trainings.cancelCreate')}
            </button>
          </form>
        ) : (
          <button
            className={styles.newBtn}
            onClick={() => setCreating(true)}
            disabled={!canAddSession}
            aria-label={t('trainings.newSessionAriaLabel')}
          >
            <span aria-hidden="true">➕</span> {t('trainings.newSession')}
          </button>
        )}
      </div>

      {error && (
        <div className={styles.errorBanner} role="alert">
          ⚠️ {error}
        </div>
      )}

      {loading && sessions.length === 0 ? (
        <div className={styles.skeletonGrid} aria-busy="true" aria-label={t('trainings.loadingSessions')}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className={styles.skeleton} />
          ))}
        </div>
      ) : sessions.length === 0 ? (
        <div className={styles.emptyState} role="status">
          <div className={styles.emptyIcon} aria-hidden="true">📋</div>
          <h2>{t('trainings.noSessionsYet')}</h2>
          <p>{t('trainings.emptyStateDesc')}</p>
        </div>
      ) : (
        <ul className={styles.grid} role="list" aria-label={t('nav.trainings')}>
          {sessions.map((session) => (
            <li key={session._id}>
              <TrainingSessionCard
                session={session}
                teamName={session.teamId ? teams.find((tm) => tm._id === session.teamId)?.name : null}
                onClick={() => navigate(`/trainings/${session._id}`)}
                onRename={(name) => handleRename(session._id, name)}
                onDelete={() => handleDelete(session._id)}
              />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

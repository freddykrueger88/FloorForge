/**
 * BoardsPage – Übersichtsseite aller Spielfelder
 * Kachel-Ansicht mit Anlegen, Umbenennen, Löschen
 */
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useBoardsApi } from '../hooks/useBoardsApi.js';
import { useSettings } from '../hooks/useSettings.js';
import BoardCard from '../components/boards/BoardCard.jsx';
import BoardPostcard from '../components/boards/BoardPostcard.jsx';
import NewBoardModal from '../components/boards/NewBoardModal.jsx';
import DeleteConfirmDialog from '../components/boards/DeleteConfirmDialog.jsx';
import styles from './BoardsPage.module.css';

const VIEW_STORAGE_KEY = 'floorforge:boardsView';

export default function BoardsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { loading, error, fetchBoards, createBoard, updateBoard, deleteBoard } = useBoardsApi();
  const { settings } = useSettings();

  const [boards,        setBoards       ] = useState([]);
  const [showNewModal,  setShowNewModal  ] = useState(false);
  const [deleteTarget,  setDeleteTarget  ] = useState(null); // { id, name }
  // Ansicht: Postkarten-Galerie ↔ Kompakt-Kachel (Issue #30)
  const [view, setView] = useState(() => localStorage.getItem(VIEW_STORAGE_KEY) || 'postcard');

  const setViewMode = useCallback((mode) => {
    setView(mode);
    localStorage.setItem(VIEW_STORAGE_KEY, mode);
  }, []);

  const load = useCallback(async () => {
    try { setBoards(await fetchBoards()); } catch { /* error via hook */ }
  }, [fetchBoards]);

  useEffect(() => { load(); }, [load]);

  const handleCreate = async (data) => {
    try {
      const board = await createBoard({
        homeColor: settings?.defaultHomeColor,
        awayColor: settings?.defaultAwayColor,
        ballColor: settings?.defaultBallColor,
        ...data,
      });
      setShowNewModal(false);
      navigate(`/board/${board._id}`);
    } catch { /* error via hook */ }
  };

  const handleRename = async (id, name) => {
    try {
      const updated = await updateBoard(id, { name });
      setBoards((prev) => prev.map((b) => b._id === id ? updated : b));
    } catch { /* error via hook */ }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await deleteBoard(deleteTarget.id);
      setBoards((prev) => prev.filter((b) => b._id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch { /* error via hook */ }
  };

  return (
    <main className={styles.page} id="main-content">
      <a href="#main-content" className="sr-only sr-only-focusable">{t('accessibility.skipToContent')}</a>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>{t('nav.boards')}</h1>
          <p className={styles.subtitle}>
            {boards.length > 0
              ? t('boardsPage.count', { count: boards.length })
              : t('boardsPage.noBoardsYet')}
          </p>
        </div>
        <Link
          to="/settings"
          className={styles.newBtn}
          aria-label={t('boardsPage.openSettings')}
          title={t('nav.settings')}
        >
          <span aria-hidden="true">⚙️</span>
        </Link>
        <button
          className={styles.newBtn}
          onClick={() => setShowNewModal(true)}
          aria-label={t('boardsPage.newBoardAriaLabel')}
        >
          <span aria-hidden="true">➕</span> {t('boardsPage.newBoard')}
        </button>

        {/* Postkarten-Galerie ↔ Kompakt-Kachel Toggle (Issue #30) */}
        <div className={styles.viewToggle} role="group" aria-label={t('boardsPage.viewToggleLabel')}>
          <button
            className={`${styles.viewBtn} ${view === 'postcard' ? styles.viewActive : ''}`}
            onClick={() => setViewMode('postcard')}
            aria-pressed={view === 'postcard'}
            aria-label={t('boardsPage.postcardView')}
            title={t('boardsPage.postcardView')}
          >
            <span aria-hidden="true">🃏</span>
          </button>
          <button
            className={`${styles.viewBtn} ${view === 'compact' ? styles.viewActive : ''}`}
            onClick={() => setViewMode('compact')}
            aria-pressed={view === 'compact'}
            aria-label={t('boardsPage.compactView')}
            title={t('boardsPage.compactView')}
          >
            <span aria-hidden="true">▦</span>
          </button>
        </div>
      </header>

      {error && (
        <div className={styles.errorBanner} role="alert">
          ⚠️ {error}
        </div>
      )}

      {loading && boards.length === 0 ? (
        <div className={styles.skeletonGrid} aria-busy="true" aria-label={t('boardsPage.loadingBoards')}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={styles.skeleton} />
          ))}
        </div>
      ) : boards.length === 0 ? (
        <div className={styles.emptyState} role="status">
          <div className={styles.emptyIcon} aria-hidden="true">🏑</div>
          <h2>{t('boardsPage.noBoardsYet')}</h2>
          <p>{t('boardsPage.emptyStateDesc')}</p>
          <button
            className={styles.newBtn}
            onClick={() => setShowNewModal(true)}
          >
            {t('boardsPage.createFirstBoard')}
          </button>
        </div>
      ) : (
        <ul
          className={view === 'postcard' ? styles.postcardGrid : styles.grid}
          role="list"
          aria-label={t('nav.boards')}
        >
          {boards.map((board) => (
            <li key={board._id}>
              {view === 'postcard' ? (
                <BoardPostcard
                  board={board}
                  onClick={() => navigate(`/board/${board._id}`)}
                />
              ) : (
                <BoardCard
                  board={board}
                  onClick={() => navigate(`/board/${board._id}`)}
                  onRename={(name) => handleRename(board._id, name)}
                  onDelete={() => setDeleteTarget({ id: board._id, name: board.name })}
                />
              )}
            </li>
          ))}
        </ul>
      )}

      {showNewModal && (
        <NewBoardModal
          onConfirm={handleCreate}
          onClose={() => setShowNewModal(false)}
          loading={loading}
          defaultFieldType={settings?.defaultFieldType ?? 'large'}
        />
      )}

      {deleteTarget && (
        <DeleteConfirmDialog
          boardName={deleteTarget.name}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
          loading={loading}
        />
      )}
    </main>
  );
}

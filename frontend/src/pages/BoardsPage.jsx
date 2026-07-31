/**
 * BoardsPage – Übersichtsseite aller Spielfelder
 * Kachel-Ansicht mit Anlegen, Umbenennen, Löschen
 */
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBoardsApi } from '../hooks/useBoardsApi.js';
import BoardCard from '../components/boards/BoardCard.jsx';
import NewBoardModal from '../components/boards/NewBoardModal.jsx';
import DeleteConfirmDialog from '../components/boards/DeleteConfirmDialog.jsx';
import styles from './BoardsPage.module.css';

export default function BoardsPage() {
  const navigate = useNavigate();
  const { loading, error, fetchBoards, createBoard, updateBoard, deleteBoard } = useBoardsApi();

  const [boards,        setBoards       ] = useState([]);
  const [showNewModal,  setShowNewModal  ] = useState(false);
  const [deleteTarget,  setDeleteTarget  ] = useState(null); // { id, name }

  const load = useCallback(async () => {
    try { setBoards(await fetchBoards()); } catch { /* error via hook */ }
  }, [fetchBoards]);

  useEffect(() => { load(); }, [load]);

  const handleCreate = async (data) => {
    try {
      const board = await createBoard(data);
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
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Spielfelder</h1>
          <p className={styles.subtitle}>
            {boards.length > 0
              ? `${boards.length} Spielfeld${boards.length !== 1 ? 'er' : ''}`
              : 'Noch kein Spielfeld angelegt'}
          </p>
        </div>
        <button
          className={styles.newBtn}
          onClick={() => setShowNewModal(true)}
          aria-label="Neues Spielfeld anlegen"
        >
          <span aria-hidden="true">➕</span> Neues Spielfeld
        </button>
      </header>

      {error && (
        <div className={styles.errorBanner} role="alert">
          ⚠️ {error}
        </div>
      )}

      {loading && boards.length === 0 ? (
        <div className={styles.skeletonGrid} aria-busy="true" aria-label="Lädt Spielfelder...">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={styles.skeleton} />
          ))}
        </div>
      ) : boards.length === 0 ? (
        <div className={styles.emptyState} role="status">
          <div className={styles.emptyIcon} aria-hidden="true">🏑</div>
          <h2>Noch kein Spielfeld angelegt</h2>
          <p>Erstelle dein erstes Spielfeld und beginne mit der Taktik-Planung.</p>
          <button
            className={styles.newBtn}
            onClick={() => setShowNewModal(true)}
          >
            Erstes Spielfeld anlegen
          </button>
        </div>
      ) : (
        <ul className={styles.grid} role="list" aria-label="Spielfelder">
          {boards.map((board) => (
            <li key={board._id}>
              <BoardCard
                board={board}
                onClick={() => navigate(`/board/${board._id}`)}
                onRename={(name) => handleRename(board._id, name)}
                onDelete={() => setDeleteTarget({ id: board._id, name: board.name })}
              />
            </li>
          ))}
        </ul>
      )}

      {showNewModal && (
        <NewBoardModal
          onConfirm={handleCreate}
          onClose={() => setShowNewModal(false)}
          loading={loading}
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

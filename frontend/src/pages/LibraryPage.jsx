/**
 * LibraryPage – Community-Übungsbibliothek (EPIC 010 MVP)
 * Struktur analog BoardsPage.jsx (Kategorie-Filter, Suche), aber ohne
 * View-Toggle/Playbook-Filter (dafür fehlt hier die Grundlage) und
 * ohne "Neu"-Button (Veröffentlichen passiert im Board-Editor).
 */
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, Presentation, SearchX } from 'lucide-react';
import { useLibraryApi } from '../hooks/useLibraryApi.js';
import useAuthStore from '../store/authStore.js';
import useAnnounceStore from '../store/announceStore.js';
import LibraryEntryCard from '../components/library/LibraryEntryCard.jsx';
import ReportEntryModal from '../components/library/ReportEntryModal.jsx';
import styles from './LibraryPage.module.css';

const CATEGORIES = ['technik', 'taktik', 'kondition', 'spielverstaendnis', 'nachwuchs'];

export default function LibraryPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const {
    loading, error, fetchLibrary, cloneEntry, reportEntry, deleteEntry,
  } = useLibraryApi();

  const [entries,        setEntries       ] = useState([]);
  const [searchQuery,    setSearchQuery   ] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [cloningId,      setCloningId     ] = useState(null);
  const [reportTarget,   setReportTarget  ] = useState(null); // entry

  const load = useCallback(async () => {
    try {
      setEntries(await fetchLibrary({
        category: categoryFilter === 'all' ? '' : categoryFilter,
        search: searchQuery.trim(),
      }));
    } catch { /* error via hook */ }
  }, [fetchLibrary, categoryFilter, searchQuery]);

  // Serverseitig gefiltert (category/search als Query-Parameter) – anders
  // als BoardsPage.jsx, wo Filter clientseitig über bereits geladene Boards
  // laufen. Die Bibliothek kann instanzweit sehr viele Einträge haben,
  // Serverseitige Filterung + Pagination im Endpoint ist daher die Basis.
  // Debounce (300ms) verhindert einen Request pro Tastenanschlag bei der
  // Textsuche.
  useEffect(() => {
    const timer = setTimeout(load, 300);
    return () => clearTimeout(timer);
  }, [load]);

  const hasFilter = searchQuery.trim() !== '' || categoryFilter !== 'all';

  const handleClone = async (entryId) => {
    setCloningId(entryId);
    try {
      const board = await cloneEntry(entryId);
      useAnnounceStore.getState().announce(t('library.cloneSuccess'));
      navigate(`/board/${board._id}`);
    } catch { /* error via hook */ } finally {
      setCloningId(null);
    }
  };

  const handleReportConfirm = async (reason) => {
    try {
      await reportEntry(reportTarget._id, reason);
      useAnnounceStore.getState().announce(t('library.reportSuccess'));
    } catch { /* error via hook, shown in modal */ }
  };

  const handleRemove = async (entry) => {
    if (!window.confirm(t('library.removeConfirm'))) return;
    try {
      await deleteEntry(entry._id);
      setEntries((prev) => prev.filter((e) => e._id !== entry._id));
    } catch { /* error via hook */ }
  };

  return (
    <main className={styles.page} id="main-content">
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>{t('library.pageTitle')}</h1>
          <p className={styles.subtitle}>
            {entries.length > 0
              ? t('library.count', { count: entries.length })
              : hasFilter ? t('library.noFilterMatch') : t('library.noEntriesYet')}
          </p>
        </div>
      </header>

      <div className={styles.actionsBar}>
        <input
          type="search"
          className={styles.searchInput}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('library.searchPlaceholder')}
          aria-label={t('library.searchAriaLabel')}
        />
        <select
          className={styles.searchInput}
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          aria-label={t('library.categoryFilterAriaLabel')}
        >
          <option value="all">{t('boardsPage.categoryFilterAll')}</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{t(`exerciseCategory.${c}`)}</option>
          ))}
        </select>
      </div>

      {error && (
        <div className={styles.errorBanner} role="alert">
          <AlertTriangle size={16} aria-hidden="true" /> {error}
        </div>
      )}

      {loading && entries.length === 0 ? (
        <div className={styles.skeletonGrid} aria-busy="true" aria-label={t('library.loading')}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={styles.skeleton} />
          ))}
        </div>
      ) : entries.length === 0 ? (
        <div className={styles.emptyState} role="status">
          <div className={styles.emptyIcon} aria-hidden="true">
            {hasFilter ? <SearchX size={40} aria-hidden="true" /> : <Presentation size={40} aria-hidden="true" />}
          </div>
          {hasFilter ? (
            <p>{t('library.noFilterMatch')}</p>
          ) : (
            <>
              <h2>{t('library.noEntriesYet')}</h2>
              <p>{t('library.emptyStateDesc')}</p>
            </>
          )}
        </div>
      ) : (
        <ul className={styles.grid} role="list" aria-label={t('library.pageTitle')}>
          {entries.map((entry) => (
            <li key={entry._id}>
              <LibraryEntryCard
                entry={entry}
                canManage={entry.ownerId === user?.id || user?.role === 'admin'}
                cloning={cloningId === entry._id}
                onClone={() => handleClone(entry._id)}
                onReport={() => setReportTarget(entry)}
                onRemove={() => handleRemove(entry)}
              />
            </li>
          ))}
        </ul>
      )}

      {reportTarget && (
        <ReportEntryModal
          entryName={reportTarget.name}
          loading={loading}
          error={error}
          onConfirm={handleReportConfirm}
          onClose={() => setReportTarget(null)}
        />
      )}
    </main>
  );
}

/**
 * DataSection – DSGVO-Auskunft, Export/Import (UI/UX-Audit, Stufe 3 –
 * aus der vormals 1011-Zeilen-SettingsPage.jsx ausgelagert, reines
 * Verschieben ohne Logik-Änderung)
 */
import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, Download, CheckCircle2 } from 'lucide-react';
import { useBackup } from '../../hooks/useBackup.js';
import { apiFetch } from '../../utils/apiFetch.js';
import Button from '../common/Button.jsx';
import styles from '../../pages/SettingsPage.module.css';

export default function DataSection() {
  const { t } = useTranslation();

  const [myData, setMyData] = useState(null);
  const [myDataError, setMyDataError] = useState(null);
  const [myDataLoading, setMyDataLoading] = useState(false);
  const [showMyData, setShowMyData] = useState(false);
  const handleShowMyData = async () => {
    if (myData) { setShowMyData((v) => !v); return; }
    setMyDataLoading(true);
    setMyDataError(null);
    try {
      setMyData(await apiFetch('/api/user/data'));
      setShowMyData(true);
    } catch (err) {
      setMyDataError(err.message);
    } finally {
      setMyDataLoading(false);
    }
  };

  const { exporting, importing, error: backupError, importResult, exportData, importData } = useBackup();
  const [importFile, setImportFile] = useState(null);
  const fileInputRef = useRef(null);
  const handleExport = async () => {
    try { await exportData(); } catch { /* Fehler wird bereits von useBackup gehalten */ }
  };
  const handleImport = async (e) => {
    e.preventDefault();
    if (!importFile) return;
    try {
      await importData(importFile);
      setImportFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch { /* Fehler wird bereits von useBackup gehalten */ }
  };

  return (
    <section className={styles.section}>
      <h2>{t('settings.nav.data')}</h2>

      <div className={styles.field}>
        <h3 className={styles.subTitle}>{t('settings.gdprTitle')}</h3>
        <p className={styles.hint}>{t('settings.gdprHint')}</p>
        <Button variant="primary" size="md" className={styles.submitBtn} onClick={handleShowMyData} disabled={myDataLoading}>
          {myDataLoading ? t('settings.gdprLoading') : showMyData ? t('settings.gdprHide') : t('settings.gdprShow')}
        </Button>
        {myDataError && <p className={styles.msgError}><AlertTriangle size={16} aria-hidden="true" /> {myDataError}</p>}
        {showMyData && myData && (
          <pre className={styles.dataPreview}>{JSON.stringify(myData, null, 2)}</pre>
        )}
      </div>

      <div className={styles.field}>
        <h3 className={styles.subTitle}>{t('settings.exportTitle')}</h3>
        <p className={styles.hint}>{t('settings.exportHint')}</p>
        <Button variant="primary" size="md" className={styles.submitBtn} onClick={handleExport} disabled={exporting}>
          {exporting ? t('settings.exportingBtn') : <><Download size={16} aria-hidden="true" /> {t('settings.exportBtn')}</>}
        </Button>
      </div>

      <form className={styles.subForm} onSubmit={handleImport}>
        <h3 className={styles.subTitle}>{t('settings.importTitle')}</h3>
        <p className={styles.hint}>{t('settings.importHint')}</p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".zip,application/zip"
          onChange={(e) => setImportFile(e.target.files?.[0] ?? null)}
        />
        <Button type="submit" variant="primary" size="md" className={styles.submitBtn} disabled={!importFile || importing}>
          {importing ? t('settings.importingBtn') : t('settings.importBtn')}
        </Button>
        {backupError && <p className={styles.msgError}><AlertTriangle size={16} aria-hidden="true" /> {backupError}</p>}
        {importResult && (
          <p className={styles.msgOk}>
            <CheckCircle2 size={16} aria-hidden="true" /> {t('settings.importResult', { imported: importResult.imported, skipped: importResult.skipped })}
          </p>
        )}
      </form>
    </section>
  );
}

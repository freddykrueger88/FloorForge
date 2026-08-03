/**
 * SettingsPage – Zentrale Einstellungsseite (Issue #18)
 * Darstellung, Spielfeld-Standards, Barrierefreiheit, Konto, Admin.
 */
import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore.js';
import useThemeStore from '../store/themeStore.js';
import { useSettings } from '../hooks/useSettings.js';
import { useAutoSave } from '../hooks/useAutoSave.js';
import { apiFetch } from '../utils/apiFetch.js';
import { applyGlobalPreferences } from '../utils/applyPreferences.js';
import { IFF_FIELDS, IFF_BALL_COLORS, DEFAULT_TEAM_COLORS } from '../constants/fieldConfig.js';
import DeleteAccountDialog from '../components/settings/DeleteAccountDialog.jsx';
import styles from './SettingsPage.module.css';

const THEME_LABELS = { dark: 'Dunkel', light: 'Hell', vikings: 'TB Uphusen Vikings', iff: 'IFF Official' };
const COLORBLIND_OPTIONS = [
  { value: 'keine',        label: 'Keine' },
  { value: 'deuteranopie', label: 'Deuteranopie (Rot-Grün)' },
  { value: 'protanopie',   label: 'Protanopie (Rot-Grün)' },
  { value: 'tritanopie',   label: 'Tritanopie (Blau-Gelb)' },
  { value: 'monochromie',  label: 'Monochromie (Graustufen)' },
];

export default function SettingsPage() {
  const navigate = useNavigate();
  const { user, setUser, logout } = useAuthStore();
  const { theme, themes, setTheme } = useThemeStore();
  const { settings, loading, updateSettings } = useSettings();

  const [name, setName] = useState(user?.name || '');
  useEffect(() => { setName(user?.name || ''); }, [user?.name]);
  const saveName = useCallback(async (n) => {
    if (!n.trim()) return;
    const res = await apiFetch('/api/auth/name', { method: 'PUT', body: JSON.stringify({ name: n.trim() }) });
    setUser(res.user);
  }, [setUser]);
  const { status: nameSaveStatus } = useAutoSave(name, saveName, !!user);

  // ── Konto: E-Mail ──────────────────────────────────────────────
  const [emailForm, setEmailForm] = useState({ newEmail: '', currentPassword: '' });
  const [emailMsg, setEmailMsg] = useState(null);
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setEmailMsg(null);
    try {
      const res = await apiFetch('/api/auth/email', { method: 'PUT', body: JSON.stringify(emailForm) });
      setUser(res.user);
      setEmailForm({ newEmail: '', currentPassword: '' });
      setEmailMsg({ type: 'ok', text: 'E-Mail geändert.' });
    } catch (err) {
      setEmailMsg({ type: 'error', text: err.message });
    }
  };

  // ── Konto: Passwort ────────────────────────────────────────────
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwMsg, setPwMsg] = useState(null);
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPwMsg(null);
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwMsg({ type: 'error', text: 'Neue Passwörter stimmen nicht überein.' });
      return;
    }
    try {
      await apiFetch('/api/auth/password', {
        method: 'PUT',
        body: JSON.stringify({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword }),
      });
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPwMsg({ type: 'ok', text: 'Passwort geändert.' });
    } catch (err) {
      setPwMsg({ type: 'error', text: err.message });
    }
  };

  // ── Konto: Löschen ─────────────────────────────────────────────
  const [showDelete, setShowDelete] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const handleDeleteAccount = async (email) => {
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      await apiFetch('/api/user/account', { method: 'DELETE', body: JSON.stringify({ email }) });
      setUser(null);
      navigate('/login', { replace: true });
    } catch (err) {
      setDeleteError(err.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  // ── Admin ──────────────────────────────────────────────────────
  const isAdmin = user?.role === 'admin';
  const [users, setUsers] = useState([]);
  const [adminError, setAdminError] = useState(null);
  const loadUsers = useCallback(async () => {
    try { setUsers(await apiFetch('/api/admin/users')); } catch (err) { setAdminError(err.message); }
  }, []);
  useEffect(() => { if (isAdmin) loadUsers(); }, [isAdmin, loadUsers]);

  const handleDeleteUser = async (id) => {
    setAdminError(null);
    try {
      await apiFetch(`/api/admin/users/${id}`, { method: 'DELETE' });
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      setAdminError(err.message);
    }
  };

  const handleToggleRole = async (u) => {
    setAdminError(null);
    const nextRole = u.role === 'admin' ? 'user' : 'admin';
    try {
      const updated = await apiFetch(`/api/admin/users/${u.id}/role`, {
        method: 'PUT', body: JSON.stringify({ role: nextRole }),
      });
      setUsers((prev) => prev.map((row) => row.id === u.id ? updated : row));
    } catch (err) {
      setAdminError(err.message);
    }
  };

  // ── Darstellung/Barrierefreiheit/Spielfeld-Standards: sofort speichern ──
  const patch = async (fields) => {
    const updated = await updateSettings(fields);
    applyGlobalPreferences(updated);
  };

  if (loading) return <p className={styles.loadingMsg}>Wird geladen…</p>;

  return (
    <main className={styles.page} id="main-content">
      <header className={styles.header}>
        <Link to="/boards" className={styles.backLink} aria-label="Zurück zu den Spielfeldern">←</Link>
        <h1 className={styles.title}>Einstellungen</h1>
      </header>

      <div className={styles.layout}>
        <nav className={styles.sidebar} aria-label="Einstellungs-Kategorien">
          <a href="#darstellung">Darstellung</a>
          <a href="#spielfeld">Spielfeld-Standards</a>
          <a href="#barrierefreiheit">Barrierefreiheit</a>
          <a href="#konto">Konto</a>
          {isAdmin && <a href="#admin">Admin</a>}
        </nav>

        <div className={styles.content}>
          {/* ── Darstellung ──────────────────────────────────────── */}
          <section id="darstellung" className={styles.section}>
            <h2>Darstellung</h2>

            <div className={styles.field}>
              <label className={styles.fieldLabel}>Theme</label>
              <div className={styles.themeGrid}>
                {themes.map((t) => (
                  <button
                    key={t}
                    className={`${styles.themeTile} ${theme === t ? styles.themeTileActive : ''}`}
                    onClick={() => { setTheme(t); patch({ theme: t }); }}
                    aria-pressed={theme === t}
                  >
                    {THEME_LABELS[t] ?? t}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.fieldLabel} htmlFor="font-size">Schriftgröße</label>
              <select
                id="font-size"
                className={styles.select}
                value={settings?.fontSize ?? 'mittel'}
                onChange={(e) => patch({ fontSize: e.target.value })}
              >
                <option value="klein">Klein</option>
                <option value="mittel">Mittel</option>
                <option value="gross">Groß</option>
              </select>
            </div>

            <label className={styles.checkboxRow}>
              <input
                type="checkbox"
                checked={!!settings?.reducedMotion}
                onChange={(e) => patch({ reducedMotion: e.target.checked })}
              />
              Bewegungen reduzieren
            </label>
          </section>

          {/* ── Spielfeld-Standards ──────────────────────────────── */}
          <section id="spielfeld" className={styles.section}>
            <h2>Spielfeld-Standards</h2>

            <div className={styles.field}>
              <label className={styles.fieldLabel} htmlFor="default-field-type">Standard-Spielfeld-Typ</label>
              <select
                id="default-field-type"
                className={styles.select}
                value={settings?.defaultFieldType ?? 'large'}
                onChange={(e) => patch({ defaultFieldType: e.target.value })}
              >
                {Object.values(IFF_FIELDS).map((f) => (
                  <option key={f.id} value={f.id}>{f.label}</option>
                ))}
              </select>
            </div>

            <div className={styles.colorRow}>
              <label className={styles.colorField}>
                Heimfarbe
                <input
                  type="color"
                  value={settings?.defaultHomeColor ?? DEFAULT_TEAM_COLORS.home.fill}
                  onChange={(e) => patch({ defaultHomeColor: e.target.value })}
                />
              </label>
              <label className={styles.colorField}>
                Gastfarbe
                <input
                  type="color"
                  value={settings?.defaultAwayColor ?? DEFAULT_TEAM_COLORS.away.fill}
                  onChange={(e) => patch({ defaultAwayColor: e.target.value })}
                />
              </label>
              <label className={styles.colorField}>
                Ballfarbe
                <select
                  className={styles.select}
                  value={settings?.defaultBallColor ?? '#ffffff'}
                  onChange={(e) => patch({ defaultBallColor: e.target.value })}
                >
                  {IFF_BALL_COLORS.map((bc) => (
                    <option key={bc.id} value={bc.hex}>{bc.label}{bc.official ? ' (IFF)' : ''}</option>
                  ))}
                </select>
              </label>
            </div>
          </section>

          {/* ── Barrierefreiheit ─────────────────────────────────── */}
          <section id="barrierefreiheit" className={styles.section}>
            <h2>Barrierefreiheit</h2>
            <p className={styles.hint}>
              Vollständige WCAG-Prüfung, Screenreader-Test und weitere Modi folgen
              in Issue #19 — hier die Basis-Schalter.
            </p>

            <div className={styles.field}>
              <label className={styles.fieldLabel} htmlFor="colorblind-mode">Farbblind-Modus</label>
              <select
                id="colorblind-mode"
                className={styles.select}
                value={settings?.colorBlindMode ?? 'keine'}
                onChange={(e) => patch({ colorBlindMode: e.target.value })}
              >
                {COLORBLIND_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            <label className={styles.checkboxRow}>
              <input
                type="checkbox"
                checked={!!settings?.highContrast}
                onChange={(e) => patch({ highContrast: e.target.checked })}
              />
              Hoher Kontrast
            </label>

            <label className={styles.checkboxRow}>
              <input
                type="checkbox"
                checked={!!settings?.adhdMode}
                onChange={(e) => patch({ adhdMode: e.target.checked })}
              />
              ADHS-freundlicher Modus (weniger dekorative Ablenkung)
            </label>
          </section>

          {/* ── Konto ────────────────────────────────────────────── */}
          <section id="konto" className={styles.section}>
            <h2>Konto</h2>

            <div className={styles.field}>
              <label className={styles.fieldLabel} htmlFor="display-name">Anzeigename</label>
              <input
                id="display-name"
                className={styles.textInput}
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={100}
              />
              <span className={styles.saveStatus} aria-live="polite">
                {nameSaveStatus === 'saving' && 'Speichert…'}
                {nameSaveStatus === 'saved' && '✓ Gespeichert'}
              </span>
            </div>

            <form className={styles.subForm} onSubmit={handleEmailSubmit}>
              <h3 className={styles.subTitle}>E-Mail ändern</h3>
              <p className={styles.currentValue}>Aktuell: {user?.email}</p>
              <input
                type="email"
                className={styles.textInput}
                placeholder="Neue E-Mail-Adresse"
                value={emailForm.newEmail}
                onChange={(e) => setEmailForm((f) => ({ ...f, newEmail: e.target.value }))}
                required
              />
              <input
                type="password"
                className={styles.textInput}
                placeholder="Aktuelles Passwort"
                value={emailForm.currentPassword}
                onChange={(e) => setEmailForm((f) => ({ ...f, currentPassword: e.target.value }))}
                required
              />
              <button type="submit" className={styles.submitBtn}>E-Mail ändern</button>
              {emailMsg && (
                <p className={emailMsg.type === 'error' ? styles.msgError : styles.msgOk}>{emailMsg.text}</p>
              )}
            </form>

            <form className={styles.subForm} onSubmit={handlePasswordSubmit}>
              <h3 className={styles.subTitle}>Passwort ändern</h3>
              <input
                type="password"
                className={styles.textInput}
                placeholder="Aktuelles Passwort"
                value={pwForm.currentPassword}
                onChange={(e) => setPwForm((f) => ({ ...f, currentPassword: e.target.value }))}
                required
              />
              <input
                type="password"
                className={styles.textInput}
                placeholder="Neues Passwort"
                value={pwForm.newPassword}
                onChange={(e) => setPwForm((f) => ({ ...f, newPassword: e.target.value }))}
                required
              />
              <span className={styles.hint}>Mind. 8 Zeichen, Groß-/Kleinbuchstaben und eine Zahl</span>
              <input
                type="password"
                className={styles.textInput}
                placeholder="Neues Passwort bestätigen"
                value={pwForm.confirmPassword}
                onChange={(e) => setPwForm((f) => ({ ...f, confirmPassword: e.target.value }))}
                required
              />
              <button type="submit" className={styles.submitBtn}>Passwort ändern</button>
              {pwMsg && (
                <p className={pwMsg.type === 'error' ? styles.msgError : styles.msgOk}>{pwMsg.text}</p>
              )}
            </form>

            <div className={styles.dangerZone}>
              <h3 className={styles.subTitle}>Account löschen</h3>
              <p className={styles.hint}>Löscht deinen Account und alle Spielfelder unwiderruflich.</p>
              <button className={styles.deleteBtn} onClick={() => setShowDelete(true)}>
                🗑 Account löschen
              </button>
            </div>

            <button className={styles.logoutBtn} onClick={logout}>Abmelden</button>
          </section>

          {/* ── Admin ────────────────────────────────────────────── */}
          {isAdmin && (
            <section id="admin" className={styles.section}>
              <h2>Admin: Benutzerverwaltung</h2>
              {adminError && <p className={styles.msgError}>⚠️ {adminError}</p>}
              <table className={styles.userTable}>
                <thead>
                  <tr><th>E-Mail</th><th>Rolle</th><th>Registriert am</th><th></th></tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td>{u.email}</td>
                      <td>{u.role}</td>
                      <td>{new Date(u.created_at).toLocaleDateString('de-DE')}</td>
                      <td className={styles.userActions}>
                        {u.id !== user.id && (
                          <>
                            <button className={styles.smallBtn} onClick={() => handleToggleRole(u)}>
                              {u.role === 'admin' ? 'Zu User degradieren' : 'Zu Admin befördern'}
                            </button>
                            <button className={styles.smallBtnDanger} onClick={() => handleDeleteUser(u.id)}>
                              Löschen
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}
        </div>
      </div>

      {showDelete && (
        <DeleteAccountDialog
          userEmail={user.email}
          onConfirm={handleDeleteAccount}
          onCancel={() => { setShowDelete(false); setDeleteError(null); }}
          loading={deleteLoading}
          error={deleteError}
        />
      )}
    </main>
  );
}

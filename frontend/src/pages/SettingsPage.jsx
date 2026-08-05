/**
 * SettingsPage – Zentrale Einstellungsseite (Issue #18)
 * Darstellung, Spielfeld-Standards, Barrierefreiheit, Konto, Admin.
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import useAuthStore from '../store/authStore.js';
import useThemeStore from '../store/themeStore.js';
import { useSettings } from '../hooks/useSettings.js';
import { useAutoSave } from '../hooks/useAutoSave.js';
import { useBackup } from '../hooks/useBackup.js';
import { useTeams } from '../hooks/useTeams.js';
import { apiFetch } from '../utils/apiFetch.js';
import { applyGlobalPreferences } from '../utils/applyPreferences.js';
import { formatDate } from '../utils/formatDate.js';
import { IFF_FIELDS, IFF_BALL_COLORS, DEFAULT_TEAM_COLORS } from '../constants/fieldConfig.js';
import DeleteAccountDialog from '../components/settings/DeleteAccountDialog.jsx';
import styles from './SettingsPage.module.css';

export default function SettingsPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user, setUser, logout } = useAuthStore();
  const { theme, themes, setTheme } = useThemeStore();
  const { settings, loading, updateSettings } = useSettings();

  const THEME_LABELS = { dark: t('settings.dark'), light: t('settings.light'), vikings: t('settings.vikings'), iff: t('settings.iff') };
  const COLORBLIND_OPTIONS = [
    { value: 'keine',        label: t('settings.colorblindNone') },
    { value: 'deuteranopie', label: t('settings.colorblindDeuteranopia') },
    { value: 'protanopie',   label: t('settings.colorblindProtanopia') },
    { value: 'tritanopie',   label: t('settings.colorblindTritanopia') },
    { value: 'monochromie',  label: t('settings.colorblindMonochrome') },
  ];

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
      setEmailMsg({ type: 'ok', text: t('settings.emailChanged') });
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
      setPwMsg({ type: 'error', text: t('settings.passwordMismatch') });
      return;
    }
    try {
      await apiFetch('/api/auth/password', {
        method: 'PUT',
        body: JSON.stringify({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword }),
      });
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPwMsg({ type: 'ok', text: t('settings.passwordChanged') });
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

  // ── Daten: Auskunft ──────────────────────────────────────────────
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

  // ── Daten: Export/Import ─────────────────────────────────────────
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

  // ── Admin ──────────────────────────────────────────────────────
  const isAdmin = user?.role === 'admin';
  const [users, setUsers] = useState([]);
  const [adminError, setAdminError] = useState(null);
  const loadUsers = useCallback(async () => {
    try { setUsers(await apiFetch('/api/admin/users')); } catch (err) { setAdminError(err.message); }
  }, []);
  useEffect(() => { if (isAdmin) loadUsers(); }, [isAdmin, loadUsers]);

  // ── Admin: Automatische Backups ─────────────────────────────────
  const [backupConfig, setBackupConfig] = useState(null);
  const [backupConfigError, setBackupConfigError] = useState(null);
  const loadBackupConfig = useCallback(async () => {
    try { setBackupConfig(await apiFetch('/api/admin/backup-config')); } catch (err) { setBackupConfigError(err.message); }
  }, []);
  useEffect(() => { if (isAdmin) loadBackupConfig(); }, [isAdmin, loadBackupConfig]);

  const patchBackupConfig = async (fields) => {
    setBackupConfigError(null);
    const next = { ...backupConfig, ...fields };
    try {
      setBackupConfig(await apiFetch('/api/admin/backup-config', { method: 'PUT', body: JSON.stringify(next) }));
    } catch (err) {
      setBackupConfigError(err.message);
    }
  };

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

  // ── Teams (ROADMAP Phase 2) ──────────────────────────────────────
  const {
    teams, error: teamsError,
    fetchTeams, createTeam, deleteTeam,
    fetchMembers, inviteMember, updateMemberRole, removeMember,
  } = useTeams();
  useEffect(() => { fetchTeams().catch(() => {}); }, [fetchTeams]);

  const [newTeamName,    setNewTeamName]    = useState('');
  const [expandedTeamId, setExpandedTeamId] = useState(null);
  const [membersByTeam,  setMembersByTeam]  = useState({});
  const [inviteForm,     setInviteForm]     = useState({ email: '', role: 'coach' });

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    const trimmed = newTeamName.trim();
    if (!trimmed) return;
    try {
      await createTeam(trimmed);
      setNewTeamName('');
    } catch { /* error via hook */ }
  };

  const handleToggleTeam = async (teamId) => {
    if (expandedTeamId === teamId) { setExpandedTeamId(null); return; }
    setExpandedTeamId(teamId);
    if (!membersByTeam[teamId]) {
      try {
        const members = await fetchMembers(teamId);
        setMembersByTeam((prev) => ({ ...prev, [teamId]: members }));
      } catch { /* error via hook */ }
    }
  };

  const handleInvite = async (e, teamId) => {
    e.preventDefault();
    const trimmed = inviteForm.email.trim();
    if (!trimmed) return;
    try {
      const member = await inviteMember(teamId, { email: trimmed, role: inviteForm.role });
      setMembersByTeam((prev) => ({ ...prev, [teamId]: [...(prev[teamId] ?? []), member] }));
      setInviteForm({ email: '', role: 'coach' });
    } catch { /* error via hook */ }
  };

  const handleRoleChange = async (teamId, memberId, role) => {
    try {
      const updated = await updateMemberRole(teamId, memberId, role);
      setMembersByTeam((prev) => ({
        ...prev,
        [teamId]: (prev[teamId] ?? []).map((m) => m._id === memberId ? updated : m),
      }));
    } catch { /* error via hook */ }
  };

  const handleRemoveMember = async (teamId, memberId) => {
    try {
      await removeMember(teamId, memberId);
      setMembersByTeam((prev) => ({
        ...prev,
        [teamId]: (prev[teamId] ?? []).filter((m) => m._id !== memberId),
      }));
    } catch { /* error via hook */ }
  };

  const handleDeleteTeam = async (teamId) => {
    try {
      await deleteTeam(teamId);
      setExpandedTeamId((prev) => prev === teamId ? null : prev);
    } catch { /* error via hook */ }
  };

  const handleLeaveTeam = async (teamId) => {
    const myMembership = (membersByTeam[teamId] ?? []).find((m) => m.userId === user.id);
    if (!myMembership) return;
    try {
      await removeMember(teamId, myMembership._id);
      await fetchTeams();
      setExpandedTeamId((prev) => prev === teamId ? null : prev);
    } catch { /* error via hook */ }
  };

  // ── Darstellung/Barrierefreiheit/Spielfeld-Standards: sofort speichern ──
  const patch = async (fields) => {
    const updated = await updateSettings(fields);
    applyGlobalPreferences(updated);
  };

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
    patch({ language: lang });
  };

  if (loading) return <p className={styles.loadingMsg}>{t('settings.loadingPage')}</p>;

  return (
    <main className={styles.page} id="main-content">
      <header className={styles.header}>
        <Link to="/boards" className={styles.backLink} aria-label={t('settings.backLink')}>←</Link>
        <h1 className={styles.title}>{t('settings.title')}</h1>
      </header>

      <div className={styles.layout}>
        <nav className={styles.sidebar} aria-label={t('settings.nav.categories')}>
          <a href="#darstellung">{t('settings.nav.appearance')}</a>
          <a href="#spielfeld">{t('settings.nav.fieldStandards')}</a>
          <a href="#barrierefreiheit">{t('settings.nav.accessibility')}</a>
          <a href="#konto">{t('settings.nav.account')}</a>
          <a href="#teams">{t('settings.nav.teams')}</a>
          <a href="#daten">{t('settings.nav.data')}</a>
          {isAdmin && <a href="#admin">{t('settings.nav.admin')}</a>}
        </nav>

        <div className={styles.content}>
          {/* ── Darstellung ──────────────────────────────────────── */}
          <section id="darstellung" className={styles.section}>
            <h2>{t('settings.nav.appearance')}</h2>

            <div className={styles.field}>
              <label className={styles.fieldLabel}>{t('settings.theme')}</label>
              <div className={styles.themeGrid}>
                {themes.map((th) => (
                  <button
                    key={th}
                    className={`${styles.themeTile} ${theme === th ? styles.themeTileActive : ''}`}
                    onClick={() => { setTheme(th); patch({ theme: th }); }}
                    aria-pressed={theme === th}
                  >
                    {THEME_LABELS[th] ?? th}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.fieldLabel} htmlFor="language-select">{t('settings.language')}</label>
              <select
                id="language-select"
                className={styles.select}
                value={i18n.language}
                onChange={(e) => handleLanguageChange(e.target.value)}
              >
                <option value="de">{t('settings.languageDe')}</option>
                <option value="en">{t('settings.languageEn')}</option>
              </select>
            </div>

            <div className={styles.field}>
              <label className={styles.fieldLabel} htmlFor="font-size">{t('settings.fontSize')}</label>
              <select
                id="font-size"
                className={styles.select}
                value={settings?.fontSize ?? 'mittel'}
                onChange={(e) => patch({ fontSize: e.target.value })}
              >
                <option value="klein">{t('settings.fontSizeSmall')}</option>
                <option value="mittel">{t('settings.fontSizeMedium')}</option>
                <option value="gross">{t('settings.fontSizeLarge')}</option>
              </select>
            </div>

            <label className={styles.checkboxRow}>
              <input
                type="checkbox"
                checked={!!settings?.reducedMotion}
                onChange={(e) => patch({ reducedMotion: e.target.checked })}
              />
              {t('settings.reducedMotion')}
            </label>

            <label className={styles.checkboxRow}>
              <input
                type="checkbox"
                checked={!!settings?.dyslexiaFont}
                onChange={(e) => patch({ dyslexiaFont: e.target.checked })}
              />
              {t('settings.dyslexiaFont')}
            </label>
          </section>

          {/* ── Spielfeld-Standards ──────────────────────────────── */}
          <section id="spielfeld" className={styles.section}>
            <h2>{t('settings.nav.fieldStandards')}</h2>

            <div className={styles.field}>
              <label className={styles.fieldLabel} htmlFor="default-field-type">{t('settings.defaultFieldType')}</label>
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
                {t('settings.homeColor')}
                <input
                  type="color"
                  value={settings?.defaultHomeColor ?? DEFAULT_TEAM_COLORS.home.fill}
                  onChange={(e) => patch({ defaultHomeColor: e.target.value })}
                />
              </label>
              <label className={styles.colorField}>
                {t('settings.awayColor')}
                <input
                  type="color"
                  value={settings?.defaultAwayColor ?? DEFAULT_TEAM_COLORS.away.fill}
                  onChange={(e) => patch({ defaultAwayColor: e.target.value })}
                />
              </label>
              <label className={styles.colorField}>
                {t('settings.ballColor')}
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
            <h2>{t('settings.nav.accessibility')}</h2>

            <div className={styles.field}>
              <label className={styles.fieldLabel} htmlFor="colorblind-mode">{t('settings.colorblindMode')}</label>
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
              {t('settings.highContrast')}
            </label>

            <label className={styles.checkboxRow}>
              <input
                type="checkbox"
                checked={!!settings?.adhdMode}
                onChange={(e) => patch({ adhdMode: e.target.checked })}
              />
              {t('settings.adhdMode')}
            </label>
          </section>

          {/* ── Konto ────────────────────────────────────────────── */}
          <section id="konto" className={styles.section}>
            <h2>{t('settings.nav.account')}</h2>

            <div className={styles.field}>
              <label className={styles.fieldLabel} htmlFor="display-name">{t('settings.displayName')}</label>
              <input
                id="display-name"
                className={styles.textInput}
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={100}
              />
              <span className={styles.saveStatus} aria-live="polite">
                {nameSaveStatus === 'saving' && t('settings.saving')}
                {nameSaveStatus === 'saved' && t('settings.saved')}
              </span>
            </div>

            <form className={styles.subForm} onSubmit={handleEmailSubmit}>
              <h3 className={styles.subTitle}>{t('settings.changeEmail')}</h3>
              <p className={styles.currentValue}>{t('settings.currentEmail', { email: user?.email })}</p>
              <input
                type="email"
                className={styles.textInput}
                placeholder={t('settings.newEmailPlaceholder')}
                value={emailForm.newEmail}
                onChange={(e) => setEmailForm((f) => ({ ...f, newEmail: e.target.value }))}
                required
              />
              <input
                type="password"
                className={styles.textInput}
                placeholder={t('settings.currentPasswordPlaceholder')}
                value={emailForm.currentPassword}
                onChange={(e) => setEmailForm((f) => ({ ...f, currentPassword: e.target.value }))}
                required
              />
              <button type="submit" className={styles.submitBtn}>{t('settings.changeEmail')}</button>
              {emailMsg && (
                <p className={emailMsg.type === 'error' ? styles.msgError : styles.msgOk}>{emailMsg.text}</p>
              )}
            </form>

            <form className={styles.subForm} onSubmit={handlePasswordSubmit}>
              <h3 className={styles.subTitle}>{t('settings.changePassword')}</h3>
              <input
                type="password"
                className={styles.textInput}
                placeholder={t('settings.currentPasswordPlaceholder')}
                value={pwForm.currentPassword}
                onChange={(e) => setPwForm((f) => ({ ...f, currentPassword: e.target.value }))}
                required
              />
              <input
                type="password"
                className={styles.textInput}
                placeholder={t('settings.newPasswordPlaceholder')}
                value={pwForm.newPassword}
                onChange={(e) => setPwForm((f) => ({ ...f, newPassword: e.target.value }))}
                required
              />
              <span className={styles.hint}>{t('auth.passwordHint')}</span>
              <input
                type="password"
                className={styles.textInput}
                placeholder={t('settings.confirmPasswordPlaceholder')}
                value={pwForm.confirmPassword}
                onChange={(e) => setPwForm((f) => ({ ...f, confirmPassword: e.target.value }))}
                required
              />
              <button type="submit" className={styles.submitBtn}>{t('settings.changePassword')}</button>
              {pwMsg && (
                <p className={pwMsg.type === 'error' ? styles.msgError : styles.msgOk}>{pwMsg.text}</p>
              )}
            </form>

            <div className={styles.dangerZone}>
              <h3 className={styles.subTitle}>{t('settings.deleteAccountTitle')}</h3>
              <p className={styles.hint}>{t('settings.deleteAccountHint')}</p>
              <button className={styles.deleteBtn} onClick={() => setShowDelete(true)}>
                {t('settings.deleteAccountBtn')}
              </button>
            </div>

            <button className={styles.logoutBtn} onClick={logout}>{t('nav.logout')}</button>
          </section>

          {/* ── Teams (ROADMAP Phase 2) ──────────────────────────── */}
          <section id="teams" className={styles.section}>
            <h2>{t('settings.nav.teams')}</h2>
            <p className={styles.hint}>{t('settings.teams.intro')}</p>

            {teamsError && <p className={styles.msgError}>⚠️ {teamsError}</p>}

            <form className={styles.subForm} onSubmit={handleCreateTeam}>
              <h3 className={styles.subTitle}>{t('settings.teams.createTitle')}</h3>
              <input
                className={styles.textInput}
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                placeholder={t('settings.teams.namePlaceholder')}
                maxLength={80}
                aria-label={t('settings.teams.namePlaceholder')}
              />
              <button type="submit" className={styles.submitBtn} disabled={!newTeamName.trim()}>
                {t('settings.teams.createBtn')}
              </button>
            </form>

            {teams.length === 0 ? (
              <p className={styles.hint}>{t('settings.teams.noTeams')}</p>
            ) : (
              <ul className={styles.teamList} role="list">
                {teams.map((team) => (
                  <li key={team._id} className={styles.teamRow}>
                    <button
                      type="button"
                      className={styles.teamHeader}
                      onClick={() => handleToggleTeam(team._id)}
                      aria-expanded={expandedTeamId === team._id}
                    >
                      <span>{team.name}</span>
                      <span className={styles.roleBadge}>{t(`settings.teams.role.${team.role}`)}</span>
                    </button>

                    {expandedTeamId === team._id && (
                      <div className={styles.teamDetail}>
                        {team.role === 'owner' && (
                          <form className={styles.subForm} onSubmit={(e) => handleInvite(e, team._id)}>
                            <h3 className={styles.subTitle}>{t('settings.teams.inviteTitle')}</h3>
                            <input
                              type="email"
                              className={styles.textInput}
                              value={inviteForm.email}
                              onChange={(e) => setInviteForm((f) => ({ ...f, email: e.target.value }))}
                              placeholder={t('settings.teams.inviteEmailPlaceholder')}
                              aria-label={t('settings.teams.inviteEmailPlaceholder')}
                            />
                            <select
                              className={styles.select}
                              value={inviteForm.role}
                              onChange={(e) => setInviteForm((f) => ({ ...f, role: e.target.value }))}
                              aria-label={t('settings.teams.inviteRoleAriaLabel')}
                            >
                              <option value="coach">{t('settings.teams.role.coach')}</option>
                              <option value="member">{t('settings.teams.role.member')}</option>
                            </select>
                            <button type="submit" className={styles.submitBtn} disabled={!inviteForm.email.trim()}>
                              {t('settings.teams.inviteBtn')}
                            </button>
                          </form>
                        )}

                        <ul className={styles.memberList} role="list">
                          {(membersByTeam[team._id] ?? []).map((m) => (
                            <li key={m._id} className={styles.memberRow}>
                              <span className={styles.memberEmail}>{m.email}</span>
                              {team.role === 'owner' ? (
                                <>
                                  <select
                                    className={styles.select}
                                    value={m.role}
                                    onChange={(e) => handleRoleChange(team._id, m._id, e.target.value)}
                                    aria-label={t('settings.teams.rowRoleAriaLabel', { email: m.email })}
                                  >
                                    <option value="owner">{t('settings.teams.role.owner')}</option>
                                    <option value="coach">{t('settings.teams.role.coach')}</option>
                                    <option value="member">{t('settings.teams.role.member')}</option>
                                  </select>
                                  <button
                                    className={styles.smallBtnDanger}
                                    onClick={() => handleRemoveMember(team._id, m._id)}
                                    aria-label={t('settings.teams.removeMemberAriaLabel', { email: m.email })}
                                  >
                                    🗑
                                  </button>
                                </>
                              ) : (
                                <span className={styles.roleBadge}>{t(`settings.teams.role.${m.role}`)}</span>
                              )}
                            </li>
                          ))}
                        </ul>

                        <div className={styles.teamActions}>
                          {team.role === 'owner' ? (
                            <button className={styles.smallBtnDanger} onClick={() => handleDeleteTeam(team._id)}>
                              {t('settings.teams.deleteBtn')}
                            </button>
                          ) : (
                            <button className={styles.smallBtnDanger} onClick={() => handleLeaveTeam(team._id)}>
                              {t('settings.teams.leaveBtn')}
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* ── Daten: Export/Import ─────────────────────────────── */}
          <section id="daten" className={styles.section}>
            <h2>{t('settings.nav.data')}</h2>

            <div className={styles.field}>
              <h3 className={styles.subTitle}>{t('settings.gdprTitle')}</h3>
              <p className={styles.hint}>{t('settings.gdprHint')}</p>
              <button className={styles.submitBtn} onClick={handleShowMyData} disabled={myDataLoading}>
                {myDataLoading ? t('settings.gdprLoading') : showMyData ? t('settings.gdprHide') : t('settings.gdprShow')}
              </button>
              {myDataError && <p className={styles.msgError}>⚠️ {myDataError}</p>}
              {showMyData && myData && (
                <pre className={styles.dataPreview}>{JSON.stringify(myData, null, 2)}</pre>
              )}
            </div>

            <div className={styles.field}>
              <h3 className={styles.subTitle}>{t('settings.exportTitle')}</h3>
              <p className={styles.hint}>{t('settings.exportHint')}</p>
              <button className={styles.submitBtn} onClick={handleExport} disabled={exporting}>
                {exporting ? t('settings.exportingBtn') : t('settings.exportBtn')}
              </button>
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
              <button type="submit" className={styles.submitBtn} disabled={!importFile || importing}>
                {importing ? t('settings.importingBtn') : t('settings.importBtn')}
              </button>
              {backupError && <p className={styles.msgError}>⚠️ {backupError}</p>}
              {importResult && (
                <p className={styles.msgOk}>
                  {t('settings.importResult', { imported: importResult.imported, skipped: importResult.skipped })}
                </p>
              )}
            </form>
          </section>

          {/* ── Admin ────────────────────────────────────────────── */}
          {isAdmin && (
            <section id="admin" className={styles.section}>
              <h2>{t('settings.adminTitle')}</h2>
              {adminError && <p className={styles.msgError}>⚠️ {adminError}</p>}
              <table className={styles.userTable}>
                <thead>
                  <tr><th>{t('settings.colEmail')}</th><th>{t('settings.colRole')}</th><th>{t('settings.colRegistered')}</th><th></th></tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td>{u.email}</td>
                      <td>{u.role}</td>
                      <td>{formatDate(u.created_at)}</td>
                      <td className={styles.userActions}>
                        {u.id !== user.id && (
                          <>
                            <button className={styles.smallBtn} onClick={() => handleToggleRole(u)}>
                              {u.role === 'admin' ? t('settings.demoteBtn') : t('settings.promoteBtn')}
                            </button>
                            <button className={styles.smallBtnDanger} onClick={() => handleDeleteUser(u.id)}>
                              {t('settings.deleteBtn')}
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className={styles.subForm}>
                <h3 className={styles.subTitle}>{t('settings.autoBackupsTitle')}</h3>
                {backupConfigError && <p className={styles.msgError}>⚠️ {backupConfigError}</p>}
                {backupConfig && (
                  <>
                    <label className={styles.checkboxRow}>
                      <input
                        type="checkbox"
                        checked={!!backupConfig.enabled}
                        onChange={(e) => patchBackupConfig({ enabled: e.target.checked })}
                      />
                      {t('settings.enableBackups')}
                    </label>

                    <div className={styles.field}>
                      <label className={styles.fieldLabel} htmlFor="backup-schedule">{t('settings.schedule')}</label>
                      <select
                        id="backup-schedule"
                        className={styles.select}
                        value={backupConfig.schedule}
                        onChange={(e) => patchBackupConfig({ schedule: e.target.value })}
                      >
                        <option value="daily">{t('settings.scheduleDaily')}</option>
                        <option value="weekly">{t('settings.scheduleWeekly')}</option>
                      </select>
                    </div>

                    <div className={styles.field}>
                      <label className={styles.fieldLabel} htmlFor="backup-retention">{t('settings.retention')}</label>
                      <input
                        id="backup-retention"
                        type="number"
                        className={styles.textInput}
                        min={1}
                        max={90}
                        value={backupConfig.retention}
                        onChange={(e) => patchBackupConfig({ retention: parseInt(e.target.value, 10) || 1 })}
                      />
                    </div>
                  </>
                )}
              </div>
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

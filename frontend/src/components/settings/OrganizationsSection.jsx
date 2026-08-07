/**
 * OrganizationsSection – Vereine anlegen/verwalten (ROADMAP Phase 2 –
 * reine Verwaltungsebene über Teams), UI/UX-Audit Stufe 3 – aus der
 * vormals 1011-Zeilen-SettingsPage.jsx ausgelagert, reines Verschieben
 * ohne Logik-Änderung.
 */
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, Trash2 } from 'lucide-react';
import useAuthStore from '../../store/authStore.js';
import { useOrganizations } from '../../hooks/useOrganizations.js';
import Button from '../common/Button.jsx';
import styles from '../../pages/SettingsPage.module.css';

export default function OrganizationsSection() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const {
    organizations, error: orgsError,
    fetchOrganizations, createOrganization, deleteOrganization,
    fetchMembers: fetchOrgMembers, inviteMember: inviteOrgMember,
    updateMemberRole: updateOrgMemberRole, removeMember: removeOrgMember,
  } = useOrganizations();
  useEffect(() => { fetchOrganizations().catch(() => {}); }, [fetchOrganizations]);

  const [newOrgName,    setNewOrgName]    = useState('');
  const [expandedOrgId, setExpandedOrgId] = useState(null);
  const [membersByOrg,  setMembersByOrg]  = useState({});
  const [orgInviteForm, setOrgInviteForm] = useState({ email: '', role: 'member' });

  const handleCreateOrg = async (e) => {
    e.preventDefault();
    const trimmed = newOrgName.trim();
    if (!trimmed) return;
    try {
      await createOrganization(trimmed);
      setNewOrgName('');
    } catch { /* error via hook */ }
  };

  const handleToggleOrg = async (orgId) => {
    if (expandedOrgId === orgId) { setExpandedOrgId(null); return; }
    setExpandedOrgId(orgId);
    if (!membersByOrg[orgId]) {
      try {
        const members = await fetchOrgMembers(orgId);
        setMembersByOrg((prev) => ({ ...prev, [orgId]: members }));
      } catch { /* error via hook */ }
    }
  };

  const handleOrgInvite = async (e, orgId) => {
    e.preventDefault();
    const trimmed = orgInviteForm.email.trim();
    if (!trimmed) return;
    try {
      const member = await inviteOrgMember(orgId, { email: trimmed, role: orgInviteForm.role });
      setMembersByOrg((prev) => ({ ...prev, [orgId]: [...(prev[orgId] ?? []), member] }));
      setOrgInviteForm({ email: '', role: 'member' });
    } catch { /* error via hook */ }
  };

  const handleOrgRoleChange = async (orgId, memberId, role) => {
    try {
      const updated = await updateOrgMemberRole(orgId, memberId, role);
      setMembersByOrg((prev) => ({
        ...prev,
        [orgId]: (prev[orgId] ?? []).map((m) => m._id === memberId ? updated : m),
      }));
    } catch { /* error via hook */ }
  };

  const handleRemoveOrgMember = async (orgId, memberId) => {
    try {
      await removeOrgMember(orgId, memberId);
      setMembersByOrg((prev) => ({
        ...prev,
        [orgId]: (prev[orgId] ?? []).filter((m) => m._id !== memberId),
      }));
    } catch { /* error via hook */ }
  };

  const handleDeleteOrg = async (orgId) => {
    try {
      await deleteOrganization(orgId);
      setExpandedOrgId((prev) => prev === orgId ? null : prev);
    } catch { /* error via hook */ }
  };

  const handleLeaveOrg = async (orgId) => {
    const myMembership = (membersByOrg[orgId] ?? []).find((m) => m.userId === user.id);
    if (!myMembership) return;
    try {
      await removeOrgMember(orgId, myMembership._id);
      await fetchOrganizations();
      setExpandedOrgId((prev) => prev === orgId ? null : prev);
    } catch { /* error via hook */ }
  };

  return (
    <section className={styles.section}>
      <h2>{t('settings.nav.organizations')}</h2>
      <p className={styles.hint}>{t('settings.organizations.intro')}</p>

      {orgsError && <p className={styles.msgError}><AlertTriangle size={16} aria-hidden="true" /> {orgsError}</p>}

      <form className={styles.subForm} onSubmit={handleCreateOrg}>
        <h3 className={styles.subTitle}>{t('settings.organizations.createTitle')}</h3>
        <input
          className={styles.textInput}
          value={newOrgName}
          onChange={(e) => setNewOrgName(e.target.value)}
          placeholder={t('settings.organizations.namePlaceholder')}
          maxLength={80}
          aria-label={t('settings.organizations.namePlaceholder')}
        />
        <Button type="submit" variant="primary" size="md" className={styles.submitBtn} disabled={!newOrgName.trim()}>
          {t('settings.organizations.createBtn')}
        </Button>
      </form>

      {organizations.length === 0 ? (
        <p className={styles.hint}>{t('settings.organizations.noOrganizations')}</p>
      ) : (
        <ul className={styles.teamList} role="list">
          {organizations.map((org) => (
            <li key={org._id} className={styles.teamRow}>
              <Button
                type="button"
                variant="ghost"
                size="md"
                className={styles.teamHeader}
                onClick={() => handleToggleOrg(org._id)}
                aria-expanded={expandedOrgId === org._id}
              >
                <span>{org.name}</span>
                <span className={styles.roleBadge}>{t(`settings.organizations.role.${org.role}`)}</span>
              </Button>

              {expandedOrgId === org._id && (
                <div className={styles.teamDetail}>
                  {org.role === 'admin' && (
                    <form className={styles.subForm} onSubmit={(e) => handleOrgInvite(e, org._id)}>
                      <h3 className={styles.subTitle}>{t('settings.organizations.inviteTitle')}</h3>
                      <input
                        type="email"
                        className={styles.textInput}
                        value={orgInviteForm.email}
                        onChange={(e) => setOrgInviteForm((f) => ({ ...f, email: e.target.value }))}
                        placeholder={t('settings.organizations.inviteEmailPlaceholder')}
                        aria-label={t('settings.organizations.inviteEmailPlaceholder')}
                      />
                      <select
                        className={styles.select}
                        value={orgInviteForm.role}
                        onChange={(e) => setOrgInviteForm((f) => ({ ...f, role: e.target.value }))}
                        aria-label={t('settings.organizations.inviteRoleAriaLabel')}
                      >
                        <option value="admin">{t('settings.organizations.role.admin')}</option>
                        <option value="member">{t('settings.organizations.role.member')}</option>
                      </select>
                      <Button type="submit" variant="primary" size="md" className={styles.submitBtn} disabled={!orgInviteForm.email.trim()}>
                        {t('settings.organizations.inviteBtn')}
                      </Button>
                    </form>
                  )}

                  <ul className={styles.memberList} role="list">
                    {(membersByOrg[org._id] ?? []).map((m) => (
                      <li key={m._id} className={styles.memberRow}>
                        <span className={styles.memberEmail}>{m.email}</span>
                        {org.role === 'admin' ? (
                          <>
                            <select
                              className={styles.select}
                              value={m.role}
                              onChange={(e) => handleOrgRoleChange(org._id, m._id, e.target.value)}
                              aria-label={t('settings.organizations.rowRoleAriaLabel', { email: m.email })}
                            >
                              <option value="admin">{t('settings.organizations.role.admin')}</option>
                              <option value="member">{t('settings.organizations.role.member')}</option>
                            </select>
                            <Button
                              variant="danger"
                              size="sm"
                              iconOnly
                              className={styles.smallBtnDanger}
                              onClick={() => handleRemoveOrgMember(org._id, m._id)}
                              aria-label={t('settings.organizations.removeMemberAriaLabel', { email: m.email })}
                            >
                              <Trash2 size={16} aria-hidden="true" />
                            </Button>
                          </>
                        ) : (
                          <span className={styles.roleBadge}>{t(`settings.organizations.role.${m.role}`)}</span>
                        )}
                      </li>
                    ))}
                  </ul>

                  <div className={styles.teamActions}>
                    {org.role === 'admin' ? (
                      <Button variant="danger" size="sm" className={styles.smallBtnDanger} onClick={() => handleDeleteOrg(org._id)}>
                        {t('settings.organizations.deleteBtn')}
                      </Button>
                    ) : (
                      <Button variant="danger" size="sm" className={styles.smallBtnDanger} onClick={() => handleLeaveOrg(org._id)}>
                        {t('settings.organizations.leaveBtn')}
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

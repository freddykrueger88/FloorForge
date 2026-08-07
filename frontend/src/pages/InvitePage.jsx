/**
 * InvitePage – Öffentliche Vorschau einer Board-Einladung (kein Login
 * nötig). Fetch-Muster analog SharePage.jsx, Darstellung über die
 * globalen auth-*-Klassen (styles/auth.css) für einen zu Login/Register
 * konsistenten Look.
 */
import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { AlertTriangle } from 'lucide-react';
import useAuthStore from '../store/authStore.js';
import logo from '../assets/openfloorball_logo_cropped.png';

export default function InvitePage() {
  const { t } = useTranslation();
  const { token } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const [invite,  setInvite ] = useState(null);
  const [error,   setError  ] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`/api/invite/${token}`)
      .then(async (res) => {
        const json = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(json.message ?? t('invite.notFoundOrExpired'));
        return json.data;
      })
      .then((data) => { if (!cancelled) setInvite(data); })
      .catch((err) => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [token, t]);

  const handleLogoutAndRegister = async () => {
    await logout();
    navigate(`/register?email=${encodeURIComponent(invite.email)}`, { replace: true });
  };

  return (
    <main className="auth-page" role="main">
      <div className="auth-card" id="main-content">
        <img src={logo} alt="OpenFloorball" className="auth-logo" />
        <h1 className="auth-title">{t('invite.title')}</h1>

        {loading && <p className="auth-hint">{t('invite.loading')}</p>}

        {!loading && (error || !invite) && (
          <>
            <div role="alert" className="auth-error">
              <span><AlertTriangle size={16} aria-hidden="true" /> {error ?? t('invite.notFoundOrExpired')}</span>
            </div>
            <p className="auth-switch">
              <Link to="/login">{t('invite.backToLogin')}</Link>
            </p>
          </>
        )}

        {!loading && invite && user && user.email !== invite.email && (
          <>
            <p className="auth-hint">
              {t('invite.loggedInAsOther', { currentEmail: user.email, invitedEmail: invite.email })}
            </p>
            <button type="button" className="btn btn-primary btn-full" onClick={handleLogoutAndRegister}>
              {t('invite.logoutAndRegister')}
            </button>
          </>
        )}

        {!loading && invite && (!user || user.email === invite.email) && (
          <>
            <p className="auth-hint">
              {t('invite.invitedAs', {
                boardName: invite.boardName,
                permission: invite.permission === 'write' ? t('boardShare.permissionWrite') : t('boardShare.permissionRead'),
                inviterName: invite.inviterName ?? t('invite.someone'),
              })}
            </p>
            <Link
              to={`/register?email=${encodeURIComponent(invite.email)}`}
              className="btn btn-primary btn-full"
            >
              {t('invite.registerCta')}
            </Link>
          </>
        )}
      </div>
    </main>
  );
}

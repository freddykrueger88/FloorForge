import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import api from '../utils/api.js';
import useAuthStore from '../store/authStore.js';

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const setUser = useAuthStore((s) => s.setUser);
  const from = location.state?.from?.pathname || '/boards';

  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    try {
      const res = await api.post('/auth/login', form);
      setUser(res.data.data.user);
      navigate(from, { replace: true });
    } catch (e) {
      const details = e.response?.data?.details;
      const detailMsg = Array.isArray(details) ? details.map((d) => d.message).join(' ') : null;
      setErr(detailMsg || e.response?.data?.message || t('auth.loginError'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page" role="main">

      <div className="auth-card" id="main-content">
        {/* Logo */}
        <div className="auth-logo" aria-label="OpenFloorball">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
            <rect width="48" height="48" rx="10" fill="var(--color-primary)"/>
            <text x="24" y="33" textAnchor="middle" fill="white"
              fontFamily="var(--font-display)" fontSize="22" fontWeight="700">FF</text>
          </svg>
          <span className="auth-app-name">OpenFloorball</span>
        </div>
        <p className="auth-slogan">{t('auth.slogan')}</p>

        <h1 className="auth-title">{t('auth.loginTitle')}</h1>

        {err && (
          <div role="alert" className="auth-error">
            <span>{err}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="email">{t('auth.email')}</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="coach@example.com"
              aria-describedby={err ? 'auth-error' : undefined}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">{t('auth.password')}</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? t('auth.loggingIn') : t('auth.loginBtn')}
          </button>
        </form>

        <p className="auth-switch">
          {t('auth.noAccount')}{' '}
          <Link to="/register">{t('auth.registerLink')}</Link>
        </p>
      </div>
    </main>
  );
}

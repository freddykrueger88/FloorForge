import { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import useAuthStore from './store/authStore.js';
import { apiFetch } from './utils/apiFetch.js';
import { applyGlobalPreferences } from './utils/applyPreferences.js';
import ColorBlindFilters from './components/a11y/ColorBlindFilters.jsx';
import LiveRegion from './components/a11y/LiveRegion.jsx';
import Footer from './components/layout/Footer.jsx';
import './styles/tokens.css';
import './styles/base.css';
import './styles/auth.css';
import '@fontsource/opendyslexic/400.css';
import '@fontsource/opendyslexic/700.css';

const LoginPage      = lazy(() => import('./pages/LoginPage.jsx'));
const RegisterPage   = lazy(() => import('./pages/RegisterPage.jsx'));
const Dashboard      = lazy(() => import('./pages/Dashboard.jsx'));
const BoardsPage     = lazy(() => import('./pages/BoardsPage.jsx'));
const BoardEditorPage = lazy(() => import('./pages/BoardEditorPage.jsx'));
const SharePage       = lazy(() => import('./pages/SharePage.jsx'));
const SettingsPage    = lazy(() => import('./pages/SettingsPage.jsx'));
const PrivacyPage     = lazy(() => import('./pages/PrivacyPage.jsx'));
const RulesPage       = lazy(() => import('./pages/RulesPage.jsx'));
const NotFound       = lazy(() => import('./pages/NotFound.jsx'));

function PrivateRoute({ children }) {
  const user = useAuthStore((s) => s.user);
  const location = useLocation();
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}

function PublicRoute({ children }) {
  const user = useAuthStore((s) => s.user);
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}

const Loader = () => {
  const { t } = useTranslation();
  return (
    <div className="page-loader" role="status" aria-live="polite">
      <span className="sr-only">{t('settings.loadingPage')}</span>
      <div className="spinner" aria-hidden="true" />
    </div>
  );
};

export default function App() {
  const user = useAuthStore((s) => s.user);
  const [booted, setBooted] = useState(false);

  // Sitzung anhand des HttpOnly-Cookies wiederherstellen (fetchMe() wurde
  // bisher nirgends aufgerufen – jeder Seiten-Reload hat dadurch visuell
  // ausgeloggt, obwohl das Cookie noch gültig war)
  useEffect(() => {
    useAuthStore.getState().fetchMe().finally(() => setBooted(true));
  }, []);

  // Globale Darstellungs-/Barrierefreiheits-Einstellungen laden, sobald
  // eine Session besteht (Issue #18)
  useEffect(() => {
    if (!user) return;
    apiFetch('/api/settings').then(applyGlobalPreferences).catch(() => {});
  }, [user]);

  if (!booted) return <Loader />;

  return (
    <BrowserRouter>
      <ColorBlindFilters />
      <LiveRegion />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login"    element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/boards" element={<PrivateRoute><BoardsPage /></PrivateRoute>} />
          <Route path="/board/:id" element={<PrivateRoute><BoardEditorPage /></PrivateRoute>} />
          <Route path="/settings" element={<PrivateRoute><SettingsPage /></PrivateRoute>} />
          <Route path="/share/:token" element={<SharePage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/rules" element={<RulesPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Footer />
    </BrowserRouter>
  );
}

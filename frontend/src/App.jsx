import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import useAuthStore from './store/authStore.js';
import './styles/tokens.css';
import './styles/base.css';
import './styles/auth.css';

const LoginPage      = lazy(() => import('./pages/LoginPage.jsx'));
const RegisterPage   = lazy(() => import('./pages/RegisterPage.jsx'));
const Dashboard      = lazy(() => import('./pages/Dashboard.jsx'));
const BoardsPage     = lazy(() => import('./pages/BoardsPage.jsx'));
const BoardEditorPage = lazy(() => import('./pages/BoardEditorPage.jsx'));
const SharePage       = lazy(() => import('./pages/SharePage.jsx'));
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

const Loader = () => (
  <div className="page-loader" role="status" aria-live="polite">
    <span className="sr-only">Wird geladen…</span>
    <div className="spinner" aria-hidden="true" />
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login"    element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/boards" element={<PrivateRoute><BoardsPage /></PrivateRoute>} />
          <Route path="/board/:id" element={<PrivateRoute><BoardEditorPage /></PrivateRoute>} />
          <Route path="/share/:token" element={<SharePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

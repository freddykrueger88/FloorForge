import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from '@store/authStore';

// Pages (werden in späteren Issues implementiert)
import Dashboard from '@pages/Dashboard';
import LoginPage from '@pages/LoginPage';
import NotFound from '@pages/NotFound';

// Geschützte Route
const PrivateRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--color-surface-2)',
            color: 'var(--color-text)',
            border: '1px solid var(--color-border)',
          },
        }}
      />
      <Routes>
        {/* Öffentliche Routen */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/share/:token" element={<div>Share-View (Issue #16)</div>} />

        {/* Geschützte Routen */}
        <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/board/:id" element={<PrivateRoute><div>Board Editor (Issue #6)</div></PrivateRoute>} />
        <Route path="/settings" element={<PrivateRoute><div>Einstellungen (Issue #18)</div></PrivateRoute>} />
        <Route path="/settings/:section" element={<PrivateRoute><div>Einstellungen (Issue #18)</div></PrivateRoute>} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main role="main" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text)' }}>
      <h1>404</h1>
      <p>Seite nicht gefunden.</p>
      <Link to="/">Zur Startseite</Link>
    </main>
  );
}

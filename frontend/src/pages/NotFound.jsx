import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main role="main" id="main-content" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text)' }}>
      <a href="#main-content" className="sr-only sr-only-focusable">Zum Inhalt springen</a>
      <h1>404</h1>
      <p>Seite nicht gefunden.</p>
      <Link to="/">Zur Startseite</Link>
    </main>
  );
}

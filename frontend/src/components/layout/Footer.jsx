/**
 * Footer – globaler Datenschutz-Link auf allen Seiten (Issue #20, DSGVO)
 */
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <Link to="/privacy">Datenschutz</Link>
    </footer>
  );
}

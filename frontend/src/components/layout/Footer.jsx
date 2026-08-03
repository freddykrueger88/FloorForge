/**
 * Footer – globaler Datenschutz-Link auf allen Seiten (Issue #20, DSGVO)
 */
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './Footer.module.css';

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className={styles.footer}>
      <Link to="/privacy">{t('footer.privacyLink')}</Link>
      <Link to="/rules">{t('footer.rulesLink')}</Link>
    </footer>
  );
}

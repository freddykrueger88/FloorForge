/**
 * ErrorBoundary – fängt Rendering-Fehler irgendwo im Komponentenbaum ab
 * (React unterstützt das nur als Klassenkomponente, kein Hook-Äquivalent).
 * Ohne das riss JEDER unbehandelte Fehler – inkl. eines fehlgeschlagenen
 * lazy-chunk-Imports nach einem Deploy, z.B. wenn der Service Worker noch
 * eine alte index.html mit inzwischen ungültigen Asset-Hashes ausliefert –
 * die komplette App auf einen weißen Bildschirm ohne jede Erklärung runter.
 */
import { Component } from 'react';
import { withTranslation } from 'react-i18next';
import styles from './ErrorBoundary.module.css';

class ErrorBoundaryBase extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info?.componentStack);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;
    const { t } = this.props;
    return (
      <main className={styles.wrap} role="alert">
        <h1 className={styles.title}>{t('errorBoundary.title')}</h1>
        <p className={styles.message}>{t('errorBoundary.message')}</p>
        <button type="button" className={styles.reloadBtn} onClick={this.handleReload}>
          {t('errorBoundary.reloadButton')}
        </button>
      </main>
    );
  }
}

export default withTranslation()(ErrorBoundaryBase);

/**
 * RulesPage – IFF-Regelwerk-Zusammenfassung (Issue #25)
 * Öffentlich erreichbar, kein Login nötig (analog zu PrivacyPage/SharePage).
 */
import { useTranslation } from 'react-i18next';
import { IFF_FIELDS } from '../constants/fieldConfig.js';
import styles from './RulesPage.module.css';

export default function RulesPage() {
  const { t } = useTranslation();
  return (
    <main className={styles.page} id="main-content">
      <a href="#main-content" className="sr-only sr-only-focusable">{t('accessibility.skipToContent')}</a>
      <header className={styles.header}>
        <h1 className={styles.title}>{t('rules.title')}</h1>
      </header>

      <div className={styles.content}>
        <section className={styles.section}>
          <p>{t('rules.intro')}</p>
          <p>
            <a href="https://floorball.sport/game/rules/" target="_blank" rel="noopener noreferrer">
              {t('rules.sourceLink')}
            </a>
          </p>
        </section>

        <section className={styles.section}>
          <h2>{t('rules.fieldTypes.title')}</h2>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>{t('rules.fieldTypes.colType')}</th>
                <th>{t('rules.fieldTypes.colDimensions')}</th>
                <th>{t('rules.fieldTypes.colPlayers')}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{t('field.large')}</td>
                <td>{IFF_FIELDS.large.width} × {IFF_FIELDS.large.height} m</td>
                <td>{t('rules.fieldTypes.largePlayers')}</td>
              </tr>
              <tr>
                <td>{t('field.small')}</td>
                <td>{IFF_FIELDS.small.width} × {IFF_FIELDS.small.height} m</td>
                <td>{t('rules.fieldTypes.smallPlayers')}</td>
              </tr>
              <tr>
                <td>{t('field.street')}</td>
                <td>{IFF_FIELDS.street.width} × {IFF_FIELDS.street.height} m</td>
                <td>{t('rules.fieldTypes.streetPlayers')}</td>
              </tr>
              <tr>
                <td>{t('field.3v3')}</td>
                <td>{IFF_FIELDS['3v3'].width} × {IFF_FIELDS['3v3'].height} m</td>
                <td>{t('rules.fieldTypes.threeVThreePlayers')}</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className={styles.section}>
          <h2>{t('rules.ball.title')}</h2>
          <p>{t('rules.ball.body')}</p>
        </section>

        <section className={styles.section}>
          <h2>{t('rules.teamColors.title')}</h2>
          <p>{t('rules.teamColors.body')}</p>
        </section>

        <section className={styles.section}>
          <h2>{t('rules.positions.title')}</h2>
          <p>{t('rules.positions.intro')}</p>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>{t('rules.positions.colPosition')}</th>
                <th>{t('rules.positions.colCount')}</th>
                <th>{t('rules.positions.colDescription')}</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>{t('rules.positions.goalkeeper')}</td><td>1</td><td>{t('rules.positions.goalkeeperDesc')}</td></tr>
              <tr><td>{t('rules.positions.defender')}</td><td>2</td><td>{t('rules.positions.defenderDesc')}</td></tr>
              <tr><td>{t('rules.positions.centre')}</td><td>1</td><td>{t('rules.positions.centreDesc')}</td></tr>
              <tr><td>{t('rules.positions.attacker')}</td><td>2</td><td>{t('rules.positions.attackerDesc')}</td></tr>
            </tbody>
          </table>
        </section>

        <section className={styles.section}>
          <p className={styles.sourceNote}>{t('rules.sourceNote')}</p>
        </section>
      </div>
    </main>
  );
}

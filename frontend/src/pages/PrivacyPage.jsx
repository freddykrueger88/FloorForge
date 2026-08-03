/**
 * PrivacyPage – Datenschutzerklärung (Issue #20, DSGVO)
 * Öffentlich erreichbar, kein Login nötig (analog zu SharePage).
 */
import styles from './PrivacyPage.module.css';

export default function PrivacyPage() {
  return (
    <main className={styles.page} id="main-content">
      <header className={styles.header}>
        <h1 className={styles.title}>Datenschutzerklärung</h1>
      </header>

      <div className={styles.content}>
        <section className={styles.section}>
          <h2>Betreiber</h2>
          <p>
            FloorForge ist selbst gehostete Software. Betreiber dieser Instanz ist
            der Administrator, der diesen Server eingerichtet hat – nicht die
            Entwickler der Software. Alle Daten verbleiben ausschließlich auf
            diesem Server; es findet keine Übertragung an Dritte statt.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Welche Daten werden gespeichert?</h2>
          <ul>
            <li>Konto: E-Mail-Adresse, Anzeigename, Passwort (verschlüsselt gehasht), Rolle</li>
            <li>Spielfelder: Namen, Notizen, Frames (Positionen/Formationen), Sturm-/Defensivreihen</li>
            <li>Einstellungen: Darstellungs- und Barrierefreiheits-Präferenzen</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>Zweck &amp; Speicherdauer</h2>
          <p>
            Die Daten dienen ausschließlich der Bereitstellung der App-Funktionalität
            (Taktiktafel, Spielfeld-Verwaltung). Sie werden gespeichert, solange dein
            Konto besteht, und vollständig gelöscht, sobald du dein Konto löschst
            (Einstellungen → Konto → Account löschen).
          </p>
        </section>

        <section className={styles.section}>
          <h2>Deine Rechte</h2>
          <p>Du kannst jederzeit in den Einstellungen (Bereich „Daten“):</p>
          <ul>
            <li><strong>Einsehen</strong> (Art. 15 DSGVO) – alle gespeicherten Daten direkt anzeigen lassen</li>
            <li><strong>Exportieren</strong> (Art. 20 DSGVO) – alle Daten als ZIP herunterladen</li>
            <li><strong>Berichtigen</strong> (Art. 16 DSGVO) – Name, E-Mail und Passwort jederzeit ändern</li>
            <li><strong>Löschen</strong> (Art. 17 DSGVO) – Konto samt aller Daten unwiderruflich entfernen</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>Share-Links</h2>
          <p>
            Erstellst du einen Share-Link zu einem Spielfeld, sind darüber ohne Login
            der Spielname sowie alle Frames/Positionen und Formationen einsehbar –
            keine Kontodaten. Share-Links laufen automatisch nach einer begrenzten
            Zeit ab und werden danach ungültig.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Keine Drittanbieter, kein Tracking</h2>
          <p>
            FloorForge bindet keine externen Analyse- oder Tracking-Dienste ein. Es
            werden keine Daten an Dritte weitergegeben. Das einzige Cookie ist ein
            technisch notwendiges, httpOnly-gesichertes Sitzungs-Cookie zur Anmeldung.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Sicherheit</h2>
          <p>
            Die Datenbank ist nur innerhalb des internen Docker-Netzwerks erreichbar,
            nicht von außen. Für den Zugriff auf diese App über das Internet wird der
            Betrieb hinter einem Reverse-Proxy mit HTTPS empfohlen. Zugriffs-Logs
            enthalten keine vollständigen IP-Adressen (anonymisiert).
          </p>
        </section>
      </div>
    </main>
  );
}

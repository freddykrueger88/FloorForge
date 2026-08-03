# FloorForge – Projektrichtlinien

## Datensparsamkeit (DSGVO Art. 5 Abs. 1c)

Bei jeder neuen Funktion, jedem neuen Feld, Log-Statement, Export oder
externen Dienst gilt: nur das speichern/loggen/zurückgeben/erlauben, was
für den konkreten Zweck tatsächlich gebraucht wird.

- Keine personenbezogenen Daten (E-Mail, Klarname, IP) in Logs, wenn eine
  User-ID zur Nachverfolgung reicht (siehe `anonymizeIp.js`, Issue #20).
  Vor dem Hinzufügen eines `logger.info/warn/error`-Aufrufs mit
  Nutzerbezug: reicht `req.user.id` statt E-Mail/Name?
- Log-Dateien brauchen eine Größen-/Rotationsgrenze (`maxsize`/`maxFiles`
  in `backend/src/utils/logger.js`) – kein unbegrenztes Wachstum, sonst
  überdauern gelöschte Accounts unbegrenzt lange in alten Log-Einträgen.
- Neue DB-Spalten oder API-Response-Felder kritisch hinterfragen: wird das
  wirklich gebraucht, oder reicht ein Ableiten zur Laufzeit?
- Keine externen Dienste/CDNs (Fonts, Analytics, Tracking) einbinden ohne
  aktuell tatsächlich genutzten Zweck – auch nicht "für später" in CSP
  o.ä. vorhalten (siehe entfernter `fontSrc: 'https://api.fontshare.com'`,
  der nie tatsächlich genutzt wurde).
- Aufbewahrungsfristen wo möglich technisch durchsetzen (z.B. automatisch
  ablaufende Share-Links, Issue #16), nicht nur dokumentieren.

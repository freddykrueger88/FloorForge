/**
 * mailer – optionaler SMTP-Versand (Issue #51 Folge-Feature)
 *
 * Ohne SMTP_HOST bleibt die App voll funktionsfähig, es wird nur keine
 * Mail verschickt (self-hosted – nicht jede Instanz braucht/will einen
 * konfigurierten Mailserver). sendMail() wirft nie, ein Versandfehler
 * darf den eigentlichen API-Aufruf (z.B. Kollaborator hinzufügen) nicht
 * zum Scheitern bringen.
 */
import nodemailer from 'nodemailer';
import pool from '../db/pool.js';
import logger from './logger.js';

let transporter;
let transporterConfigured = false;

function getTransporter() {
  if (transporterConfigured) return transporter;
  transporterConfigured = true;
  if (!process.env.SMTP_HOST) {
    transporter = null;
    return null;
  }
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD }
      : undefined,
  });
  return transporter;
}

// Vom Betreiber gewünscht: Benachrichtigung an alle Admins bei jeder
// Neuregistrierung, mit variierendem, augenzwinkerndem Text statt immer
// derselben trockenen Formulierung – rein kosmetisch, kein Datenschutz-
// oder Sicherheitsaspekt.
const NEW_USER_TEMPLATES = [
  (who) => ({
    subject: '🎉 Neuzugang im Kader!',
    text: `${who} hat sich gerade bei OpenFloorball registriert. Vielleicht der nächste Meistertrainer, vielleicht jemand, der nur mal reinschnuppert – so oder so: ein neues Gesicht auf der Taktiktafel.`,
  }),
  (who) => ({
    subject: '🥍 Frischfleisch registriert',
    text: `${who} ist ab sofort bei OpenFloorball dabei. Die Kreide kann eingemottet werden, die digitale Taktiktafel hat wieder Zuwachs.`,
  }),
  (who) => ({
    subject: '🚨 Ein wilder Nutzer erscheint!',
    text: `${who} hat sich soeben registriert. Kein Grund zur Sorge – vermutlich nur ein Coach, kein Hacker. Vermutlich.`,
  }),
  (who) => ({
    subject: '⚡ Zack, neuer Account!',
    text: `${who} ist jetzt Teil der OpenFloorball-Familie. Die Taktiktafel wartet schon ungeduldig auf die ersten Spielzüge.`,
  }),
  (who) => ({
    subject: '📋 Neue Anmeldung',
    text: `Willkommen an Bord, ${who}! Noch ein Coach mehr, der jetzt Spielzüge zeichnen kann, statt sie mit wild fuchtelnden Armen zu erklären.`,
  }),
  (who) => ({
    subject: '🏑 Ping! Neuer Trainer im Anmarsch',
    text: `${who} hat sich gerade bei OpenFloorball angemeldet. Die Statistik von "Trainer, die Taktikbesprechungen am Whiteboard vergeigen" sinkt hoffentlich gleich um eins.`,
  }),
];

// Benachrichtigt alle Admins per Mail über eine Neuregistrierung – außer
// beim allerersten Nutzer (der wird selbst automatisch Admin, sich
// selbst über die eigene Registrierung zu benachrichtigen wäre unnötig).
export async function notifyAdminsOfNewUser({ email, name }, { isFirstUser }) {
  if (isFirstUser) return;
  try {
    const admins = await pool.query("SELECT email FROM users WHERE role = 'admin'");
    if (admins.rows.length === 0) return;

    const who = name ? `${name} (${email})` : email;
    const template = NEW_USER_TEMPLATES[Math.floor(Math.random() * NEW_USER_TEMPLATES.length)](who);

    await Promise.all(admins.rows.map((admin) => sendMail({ to: admin.email, ...template })));
  } catch (err) {
    // Darf eine Registrierung nie zum Scheitern bringen (analog sendMail selbst).
    logger.error('[notifyAdminsOfNewUser]', err);
  }
}

export async function sendMail({ to, subject, text }) {
  const t = getTransporter();
  if (!t) return;
  try {
    await t.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject,
      text,
    });
  } catch (err) {
    // Datensparsamkeit: Empfänger-E-Mail nicht mitloggen, der Fehler
    // selbst (z.B. Auth-/Verbindungsproblem) reicht zur Diagnose.
    logger.error('E-Mail-Versand fehlgeschlagen:', err);
  }
}

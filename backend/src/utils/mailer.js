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

/**
 * Mailer — Nodemailer transport.
 * If SMTP env vars are missing, logs to console in development (so flows still work).
 */

import nodemailer from "nodemailer";

export async function sendMail(opts: { to: string; subject: string; html: string }) {
  const host = process.env.EMAIL_HOST;
  const port = process.env.EMAIL_PORT ? Number(process.env.EMAIL_PORT) : 587;
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  const from = process.env.EMAIL_FROM ?? user ?? "noreply@drive-luxury-wheels.local";

  if (!host || !user || !pass) {
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.log("[mail:dev]", opts.to, opts.subject);
    }
    return { skipped: true };
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  await transporter.sendMail({ from, to: opts.to, subject: opts.subject, html: opts.html });
  return { skipped: false };
}

/**
 * Lightweight structured logging for production (Render) and development.
 * Avoids extra dependencies (pino/winston) while keeping JSON-parseable lines in prod.
 */

type LogLevel = "debug" | "info" | "warn" | "error";

const LEVEL_ORDER: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

function configuredLevel(): LogLevel {
  const raw = (process.env.LOG_LEVEL ?? "").toLowerCase();
  if (raw === "debug" || raw === "info" || raw === "warn" || raw === "error") return raw;
  return process.env.NODE_ENV === "production" ? "info" : "debug";
}

function shouldLog(level: LogLevel): boolean {
  return LEVEL_ORDER[level] >= LEVEL_ORDER[configuredLevel()];
}

function basePayload(level: LogLevel, msg: string, extra?: Record<string, unknown>) {
  return {
    ts: new Date().toISOString(),
    level,
    msg,
    service: "drive-luxury-wheels-api",
    env: process.env.NODE_ENV ?? "development",
    ...extra,
  };
}

function write(level: LogLevel, msg: string, extra?: Record<string, unknown>) {
  if (!shouldLog(level)) return;
  const line = basePayload(level, msg, extra);
  const text = process.env.NODE_ENV === "production" ? JSON.stringify(line) : `[${line.ts}] ${level.toUpperCase()} ${msg}${extra ? ` ${JSON.stringify(extra)}` : ""}`;
  // eslint-disable-next-line no-console
  console[level === "debug" ? "log" : level === "info" ? "log" : level](text);
}

export const logger = {
  debug: (msg: string, extra?: Record<string, unknown>) => write("debug", msg, extra),
  info: (msg: string, extra?: Record<string, unknown>) => write("info", msg, extra),
  warn: (msg: string, extra?: Record<string, unknown>) => write("warn", msg, extra),
  error: (msg: string, extra?: Record<string, unknown>) => write("error", msg, extra),
};

type LogLevel = "info" | "warn" | "error";

const SENSITIVE_KEYS = [
  "password",
  "token",
  "secret",
  "authorization",
  "key",
  "creditcard",
  "api_key",
  "apikey",
  "private_key",
  "access_token",
  "refresh_token",
  "razorpay_signature",
];

const redactSecrets = (obj: unknown): unknown => {
  if (obj === null || obj === undefined || typeof obj !== "object") {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(redactSecrets);
  }
  const redacted: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    const lowerKey = key.toLowerCase();
    if (SENSITIVE_KEYS.some((sensitive) => lowerKey.includes(sensitive))) {
      redacted[key] = "[REDACTED]";
    } else if (typeof value === "object" && value !== null) {
      redacted[key] = redactSecrets(value);
    } else {
      redacted[key] = value;
    }
  }
  return redacted;
};

const writeLog = (
  level: LogLevel,
  message: string,
  meta?: Record<string, unknown>
) => {
  const cleanMeta = meta ? (redactSecrets(meta) as Record<string, unknown>) : {};
  const payload = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...cleanMeta,
  };

  const line = JSON.stringify(payload);

  if (level === "error") {
    console.error(line);
    return;
  }

  console.log(line);
};

export const logger = {
  info: (message: string, meta?: Record<string, unknown>) =>
    writeLog("info", message, meta),

  warn: (message: string, meta?: Record<string, unknown>) =>
    writeLog("warn", message, meta),

  error: (message: string, meta?: Record<string, unknown>) =>
    writeLog("error", message, meta),
};
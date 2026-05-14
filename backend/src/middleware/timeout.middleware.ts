import type { NextFunction, Request, Response } from "express";

/**
 * Aborts slow requests so hung upstream services cannot tie up the Node process (Render / small dynos).
 * Timeout is configurable via `API_REQUEST_TIMEOUT_MS` (default 30s).
 */
export function requestTimeoutMiddleware(timeoutMs: number) {
  return (req: Request, res: Response, next: NextFunction) => {
    const t = setTimeout(() => {
      if (!res.headersSent) {
        res.status(408).json({
          success: false,
          message: "Request timeout",
          data: null as null,
        });
      }
    }, timeoutMs);

    res.on("finish", () => clearTimeout(t));
    res.on("close", () => clearTimeout(t));
    next();
  };
}

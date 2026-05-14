/**
 * Typed HTTP errors — middleware maps these to JSON responses with correct status codes.
 */

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: unknown,
  ) {
    super(message);
    this.name = "AppError";
  }
}

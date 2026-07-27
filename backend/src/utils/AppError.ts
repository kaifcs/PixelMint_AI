export class AppError extends Error {
  public readonly statusCode: number;
  public readonly details?: unknown;
  public readonly exposeDetails: boolean;

  constructor(message: string, statusCode = 500, details?: unknown, exposeDetails = false) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.details = details;
    this.exposeDetails = exposeDetails;
  }
}

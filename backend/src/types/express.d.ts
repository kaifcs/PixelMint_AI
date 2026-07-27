import type { AuthenticatedUser } from "../utils/types.js";

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
      rawBody?: Buffer;
    }
  }
}

export {};

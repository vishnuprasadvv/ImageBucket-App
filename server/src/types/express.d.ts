import { Request } from 'express';

declare global {
  namespace Express {
    interface User {
      id: string;
    }

    interface Request {
      user?: User; // Update the Request interface
    }
  }
}
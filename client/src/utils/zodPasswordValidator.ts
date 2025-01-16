import * as z from 'zod';

export const strongPasswordSchema = z
  .string()
  .min(6, { message: "Password must be at least 6 characters long" })
  .regex(/[A-Z]/, { message: "Password must include at least one uppercase letter" })
  .regex(/[a-z]/, { message: "Password must include at least one lowercase letter" })
  .regex(/[0-9]/, { message: "Password must include at least one digit" })
  .regex(/[@$!%*?&]/, { message: "Password must include at least one special character (@$!%*?&)" });

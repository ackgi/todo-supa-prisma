// src/server/dtos/auth.dto.ts
import { z } from "zod";

export const LoginInput = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  redirectedFrom: z
    .string()
    .optional()
    .nullable()
    .transform((v) => (v ?? undefined)),
});

export type LoginInput = z.infer<typeof LoginInput>;

export const LoginResult = z.object({
  redirectTo: z.string(),
});
export type LoginResult = z.infer<typeof LoginResult>;

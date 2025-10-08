import { z } from "zod";

export const signupPostRequestBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(4),
});

export const loginPostRequestBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(4),
})

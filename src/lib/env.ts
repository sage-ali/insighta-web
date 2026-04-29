import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_API_BASE_URL: z.string().url(),
  FRONTEND_URL: z.string().url().optional(),
  CLIENT_TYPE: z.string().default("web").optional(),
});

export const env = envSchema.parse({
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  // These are only needed on the server side, optional for client
  FRONTEND_URL: process.env.FRONTEND_URL || undefined,
  CLIENT_TYPE: process.env.CLIENT_TYPE || "web",
});

export type Env = z.infer<typeof envSchema>;

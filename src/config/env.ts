import z from "zod";

export const envSchema = z.object({
    NODE_ENV: z.enum(['development','test','production']).default('development'),
    PORT: z.coerce.number().int().positive().default(3000),
    DATABASE_URL: z.url(),
    JWT_SECRET: z.string().min(32),
    JWT_EXPIRES_IN: z.string().default('15m'),
    REDIS_URL: z.url().optional(),
});

export type Env = z.infer<typeof envSchema>;
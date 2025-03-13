import { z } from "zod";
import { config } from "dotenv";
import { expand } from "dotenv-expand";

expand(config());

const zEnv = z
  .object({
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
    GITHUB_CLIENT_ID: z.string(),
    GITHUB_CLIENT_SECRET: z.string(),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),

    SITE: z.string().url().default("http://localhost:4321"),

    DATABASE_URL: z.string().url(),
    DATABASE_AUTH_TOKEN: z.string().optional(),
  })
  .superRefine(({ NODE_ENV, DATABASE_AUTH_TOKEN }, ctx) => {
    if (NODE_ENV === "production" && !DATABASE_AUTH_TOKEN) {
      ctx.addIssue({
        code: z.ZodIssueCode.invalid_type,
        expected: "string",
        received: "undefined",
        path: ["DATABASE_AUTH_TOKEN"],
        message: "DATABASE_AUTH_TOKEN is required in production",
      });
    }
  });

export type Environment = z.infer<typeof zEnv>;

export function parseEnv(data: any) {
  const { data: env, error } = zEnv.safeParse(data);

  if (error) {
    const errorMessage = `Invalid environment variables: ${error.flatten().fieldErrors}`;
    throw new Error(errorMessage);
  }

  return env;
}

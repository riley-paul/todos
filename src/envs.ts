import { z, type ZodError } from "zod";
import { config } from "dotenv";
import { expand } from "dotenv-expand";

expand(config());

const zEnv = z
  .object({
    NODE_ENV: z.enum(["development", "production"]).default("development"),
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

export type Env = z.infer<typeof zEnv>;

let env: Env;

try {
  env = zEnv.parse(process.env);
} catch (e) {
  const error = e as ZodError;
  console.error("❌ Invalid environment variables:");
  console.error(error.flatten());
  process.exit(1);
}

export default env;

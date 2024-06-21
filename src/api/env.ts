import { z, ZodError } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string(),
  DATABASE_AUTH_TOKEN: z.string(),
  GITHUB_CLIENT_ID: z.string(),
  GITHUB_CLIENT_SECRET: z.string(),
});

export type EnvSchema = z.infer<typeof envSchema>;

try {
  envSchema.parse(import.meta.env ?? process.env);
} catch (error) {
  if (error instanceof ZodError) {
    let message = "Missing required values in .env:\n\n";
    error.issues.map((issue) => {
      message += `${issue.path[0]}\n`;
      message += `  ${issue.message}\n\n`;
    });
    const e = new Error(message);
    e.stack = "";
    throw e;
  } else {
    console.log(error);
  }
}

export default envSchema.parse(import.meta.env ?? process.env);

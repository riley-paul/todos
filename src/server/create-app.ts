import { OpenAPIHono } from "@hono/zod-openapi";
import { notFound, onError } from "stoker/middlewares";
import { logger } from "hono/logger";
import type { AppBindings } from "./types";

export default function createApp() {
  const app = new OpenAPIHono<AppBindings>({ strict: false }).basePath("/api");
  app.use(logger());

  app.notFound(notFound);
  app.onError(onError);

  return app;
}

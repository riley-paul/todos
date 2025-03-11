import { OpenAPIHono } from "@hono/zod-openapi";
import { notFound, onError } from "stoker/middlewares";
import { logger } from "hono/logger";
import type { AppBindings } from "./types";

export function createRouter() {
  return new OpenAPIHono<AppBindings>({ strict: false });
}

export function createApp() {
  const app = createRouter().basePath("/api");
  app.use(logger());

  app.notFound(notFound);
  app.onError(onError);

  return app;
}

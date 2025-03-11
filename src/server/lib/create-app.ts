import { OpenAPIHono } from "@hono/zod-openapi";
import { notFound, onError } from "stoker/middlewares";
import { defaultHook } from "stoker/openapi";
import { logger } from "hono/logger";
import type { AppBindings } from "./types";
import { authMiddleware } from "../middleware";

export function createRouter() {
  return new OpenAPIHono<AppBindings>({ strict: false, defaultHook });
}

export function createApp() {
  const app = createRouter().basePath("/api");
  app.use(logger());
  app.use(authMiddleware);

  app.notFound(notFound);
  app.onError(onError);

  return app;
}

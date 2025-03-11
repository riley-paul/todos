import type { OpenAPIHono } from "@hono/zod-openapi";

export type AppBindings = {
  Bindings: {};
  Variables: {};
};

export type AppOpenApi = OpenAPIHono<AppBindings>;

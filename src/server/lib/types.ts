import type { OpenAPIHono, RouteConfig, RouteHandler } from "@hono/zod-openapi";

export type AppBindings = {
  Bindings: {};
  Variables: {};
};

export type AppOpenApi = OpenAPIHono<AppBindings>;

export type AppRouteHandler<R extends RouteConfig> = RouteHandler<
  R,
  AppBindings
>;

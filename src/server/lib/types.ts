import type { UserSelect } from "@/db/schema";
import type { UserSessionInfo } from "@/lib/types";
import type { OpenAPIHono, RouteConfig, RouteHandler } from "@hono/zod-openapi";

export type AppBindings = {
  Bindings: {};
  Variables: {
    user: UserSelect | null;
    session: UserSessionInfo | null;
  };
};

export type AppOpenApi = OpenAPIHono<AppBindings>;

export type AppRouteHandler<R extends RouteConfig> = RouteHandler<
  R,
  AppBindings
>;

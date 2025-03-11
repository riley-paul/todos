import configureOpenApi from "@/server/lib/configure-openapi";
import { createApp } from "@/server/lib/create-app";

import index from "@/server/routes/index.route";
import todos from "@/server/routes/todos/todos.index";

const app = createApp();

const routes = [index, todos];

configureOpenApi(app);
routes.forEach((route) => app.route("/", route));

export default app;

import configureOpenApi from "@/server/lib/configure-openapi";
import { createApp } from "@/server/lib/create-app";

import index from "@/server/routes/index.route";

const app = createApp();

const routes = [index];

configureOpenApi(app);
routes.forEach((route) => app.route("/", route));

export default app;

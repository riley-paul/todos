import configureOpenApi from "./configure-openapi";
import createApp from "./create-app";

const app = createApp();

configureOpenApi(app);

export default app;

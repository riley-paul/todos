import { createRouter } from "@/server/lib/create-app";
import * as handlers from "./todos.handlers";
import * as routes from "./todos.routes";

const router = createRouter().openapi(routes.list, handlers.list);

export default router;

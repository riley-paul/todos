import { createRoute } from "@hono/zod-openapi";
import { createRouter } from "@/server/lib/create-app";
import { jsonContent } from "stoker/openapi/helpers";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

const router = createRouter().openapi(
  createRoute({
    tags: ["index"],
    method: "get",
    path: "/",
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        createMessageObjectSchema("Hello, world!"),
        "Hello world endpoint",
      ),
    },
  }),
  (c) => {
    return c.json({ message: "Hello, world!" }, HttpStatusCodes.OK);
  },
);

export default router;

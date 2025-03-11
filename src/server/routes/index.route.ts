import { createRoute } from "@hono/zod-openapi";
import { createRouter } from "../lib/create-app";
import { z } from "zod";

const router = createRouter().openapi(
  createRoute({
    method: "get",
    path: "/",
    responses: {
      200: {
        description: "Hello, world!",
        content: {
          "application/json": {
            schema: z.object({ message: z.string() }),
          },
        },
      },
    },
  }),
  (c) => {
    return c.json({ message: "Hello, world!" }, 200);
  },
);

export default router;

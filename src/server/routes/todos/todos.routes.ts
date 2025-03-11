import { zTodoSelect } from "@/db/schema";
import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { z } from "zod";

const tags = ["Todos"];

export const list = createRoute({
  path: "/todos",
  method: "get",
  tags,
  request: { query: z.object({ listId: z.string().nullable() }) },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(z.array(zTodoSelect), "List of todos"),
  },
});

export type ListRoute = typeof list;

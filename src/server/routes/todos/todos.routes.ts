import { zTodoInsert, zTodoSelect } from "@/db/schema";
import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { z } from "zod";

const tags = ["Todos"];

export const list = createRoute({
  path: "/todos",
  method: "get",
  tags,
  request: {
    query: z.object({
      listId: z
        .string()
        .nullable()
        .transform((v) => (v === "null" ? null : v)),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(z.array(zTodoSelect), "List of todos"),
  },
});

export const create = createRoute({
  path: "/todos",
  method: "post",
  tags,
  request: {
    body: jsonContentRequired(zTodoInsert, "The todo to create"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({ id: z.string(), listId: z.string().nullable() }),
      "Id of created Todo",
    ),
  },
});

export type ListRoute = typeof list;
export type CreateRoute = typeof create;

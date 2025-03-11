import { zTodoInsert, zTodoSelect } from "@/db/schema";
import { notFoundSchema } from "@/lib/server/constants";
import { createRoute } from "@hono/zod-openapi";

import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import {
  createErrorSchema,
  createMessageObjectSchema,
  IdUUIDParamsSchema,
} from "stoker/openapi/schemas";
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
    [HttpStatusCodes.OK]: jsonContent(zTodoSelect, "The created task"),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(zTodoInsert),
      "The validation error(s)",
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(
      createMessageObjectSchema(HttpStatusPhrases.FORBIDDEN),
      "User not authorized",
    ),
  },
});

export const update = createRoute({
  path: "/todos/{id}",
  method: "patch",
  tags,
  request: { params: IdUUIDParamsSchema },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(zTodoSelect, "The updated task"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, "Task not found"),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(zTodoInsert).or(createErrorSchema(IdUUIDParamsSchema)),
      "The validation error(s)",
    ),
  },
});

export const remove = createRoute({
  path: "/todos/{id}",
  method: "delete",
  tags,
  request: { params: IdUUIDParamsSchema },
  responses: {
    [HttpStatusCodes.NO_CONTENT]: { description: "Task deleted" },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, "Task not found"),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdUUIDParamsSchema),
      "The validation error(s)",
    ),
  },
});

export type ListRoute = typeof list;
export type CreateRoute = typeof create;
export type UpdateRoute = typeof update;
export type RemoveRoute = typeof remove;

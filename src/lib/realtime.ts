import { z } from "astro/zod";
import {
  zListSelect,
  zListUserSelect,
  zTodoSelect,
  zUserSelect,
} from "./types";

import * as collections from "@/app/lib/collections";

export const zEntityType = z.enum(["list", "todo", "listUser", "user"]);
export type EntityType = z.infer<typeof zEntityType>;

const createOperationSchema = <T extends z.ZodObject>(dataSchema: T) => {
  return z.discriminatedUnion("type", [
    z.object({
      type: z.literal("insert"),
      data: dataSchema,
    }),
    z.object({
      type: z.literal("update"),
      id: z.string(),
      data: dataSchema,
    }),
    z.object({
      type: z.literal("delete"),
      id: z.string(),
    }),
  ]);
};

export const zPayload = z.discriminatedUnion("entity", [
  z.object({
    entity: z.literal("list"),
    operation: createOperationSchema(zListSelect),
  }),
  z.object({
    entity: z.literal("todo"),
    operation: createOperationSchema(zTodoSelect),
  }),
  z.object({
    entity: z.literal("listUser"),
    operation: createOperationSchema(zListUserSelect),
  }),
  z.object({
    entity: z.literal("user"),
    operation: createOperationSchema(zUserSelect),
  }),
]);
export type Payload = z.infer<typeof zPayload>;

export const handlePayload = (payload: Payload) => {
  switch (payload.entity) {
    case "list": {
      switch (payload.operation.type) {
        case "insert":
          collections.lists.utils.writeInsert(payload.operation.data);
          break;
        case "update":
          collections.lists.utils.writeUpdate(payload.operation.data);
          break;
        case "delete":
          collections.lists.utils.writeDelete(payload.operation.id);
          break;
      }
    }

    case "todo": {
      switch (payload.operation.type) {
        case "insert":
          collections.todos.utils.writeInsert(payload.operation.data);
          break;
        case "update":
          collections.todos.utils.writeUpdate(payload.operation.data);
          break;
        case "delete":
          collections.todos.utils.writeDelete(payload.operation.id);
          break;
      }
    }

    case "listUser": {
      switch (payload.operation.type) {
        case "insert":
          collections.listUsers.utils.writeInsert(payload.operation.data);
          break;
        case "update":
          collections.listUsers.utils.writeUpdate(payload.operation.data);
          break;
        case "delete":
          collections.listUsers.utils.writeDelete(payload.operation.id);
          break;
      }
    }

    case "user": {
      switch (payload.operation.type) {
        case "insert":
          collections.users.utils.writeInsert(payload.operation.data);
          break;
        case "update":
          collections.users.utils.writeUpdate(payload.operation.data);
          break;
        case "delete":
          collections.users.utils.writeDelete(payload.operation.id);
          break;
      }
    }
  }
};

import { z } from "astro/zod";
import {
  zListSelect,
  zListUserSelect,
  zTodoSelect,
  zUserSelect,
} from "./types";

import type { ActionAPIContext } from "astro:actions";
import { createDb } from "@/db";
import { Rest } from "ably";

const createOperationSchema = <T extends z.ZodObject>(dataSchema: T) => {
  return z.discriminatedUnion("type", [
    z.object({
      type: z.literal("insert"),
      data: z.union([dataSchema, dataSchema.array()]),
    }),
    z.object({
      type: z.literal("update"),
      data: z.union([dataSchema, dataSchema.array()]),
    }),
    z.object({
      type: z.literal("delete"),
      id: z.union([z.string(), z.string().array()]),
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

export async function notifyListUsers(
  c: ActionAPIContext,
  listId: string,
  payload: Payload,
) {
  const db = createDb(c.locals.env);
  const ably = new Rest({ key: c.locals.env.ABLY_API_KEY, clientId: "server" });

  const listUserIds = await db.query.ListUser.findMany({
    where: { listId },
    columns: { userId: true },
  }).then((lus) => lus.map((lu) => lu.userId));

  return Promise.all(
    listUserIds.map((id) => {
      const channel = ably.channels.get(`user:${id}`);
      return channel.publish("invalidate", payload);
    }),
  );
}

export async function notifyUser(
  c: ActionAPIContext,
  userId: string,
  payload: Payload,
) {
  const ably = new Rest({ key: c.locals.env.ABLY_API_KEY, clientId: "server" });
  const channel = ably.channels.get(`user:${userId}`);
  return channel.publish("invalidate", payload);
}

import { env } from "cloudflare:workers";
import { builder } from "../gql-builder";
import { createDb } from "@/db";
import * as tables from "@/db/schema";
import { eq } from "drizzle-orm";

const db = createDb(env);

const CreateListInput = builder.inputType("CreateListInput", {
  fields: (t) => ({
    name: t.string(),
  }),
});

builder.mutationFields((t) => ({
  createList: t.drizzleField({
    type: "List",
    args: { input: t.arg({ type: CreateListInput }) },
    nullable: true,
    resolve: async (query, root, { input }, ctx) => {
      const newList = await db.transaction(async (tx) => {
        const [newList] = await tx
          .insert(tables.List)
          .values({ name: input.name })
          .returning();
        await tx
          .insert(tables.ListUser)
          .values({ listId: newList.id, userId: ctx.userId, isPending: false });
        return newList;
      });

      return db.query.List.findFirst(
        query({ where: { id: { eq: newList.id } } }),
      );
    },
  }),

  deleteList: t.boolean({
    args: { listId: t.arg.id() },
    resolve: async (root, { listId }, ctx) => {
      const list = await db.query.List.findFirst({
        where: { id: { eq: listId } },
      });
      if (!list) throw new Error("List not found");

      const listUser = await db.query.ListUser.findFirst({
        where: {
          AND: [
            { listId: { eq: listId } },
            { userId: { eq: ctx.userId } },
            { isPending: { eq: false } },
          ],
        },
      });
      if (!listUser) throw new Error("You do not have access to this list");

      await db.delete(tables.List).where(eq(tables.List.id, listId));
      return true;
    },
  }),
}));

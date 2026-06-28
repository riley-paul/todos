import { builder } from "../gql-builder";
import { createDb } from "@/db";
import * as tables from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { LIST_SEPARATOR_ID } from "@/lib/constants";


const CreateListInput = builder.inputType("CreateListInput", {
  fields: (t) => ({
    name: t.string(),
  }),
});

const UpdateListInput = builder.inputType("UpdateListInput", {
  fields: (t) => ({
    name: t.string(),
  }),
});

builder.mutationFields((t) => ({
  createList: t.drizzleField({
    type: "List",
    args: { input: t.arg({ type: CreateListInput }) },
    nullable: true,
    resolve: async (query, _root, { input }, ctx) => {
      const db = createDb(ctx.env);
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

  updateList: t.drizzleField({
    type: "List",
    args: {
      listId: t.arg.id(),
      input: t.arg({ type: UpdateListInput }),
    },
    nullable: true,
    resolve: async (query, _root, { listId, input }, ctx) => {
      const db = createDb(ctx.env);
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

      await db
        .update(tables.List)
        .set({ name: input.name })
        .where(eq(tables.List.id, listId));
      return db.query.List.findFirst(query({ where: { id: { eq: listId } } }));
    },
  }),

  deleteList: t.boolean({
    args: { listId: t.arg.id() },
    resolve: async (_root, { listId }, ctx) => {
      const db = createDb(ctx.env);
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

  updateListSortShow: t.drizzleField({
    type: ["List"],
    args: { listIds: t.arg.idList() },
    resolve: async (query, _root, { listIds }, ctx) => {
      const db = createDb(ctx.env);
      const separatorIdx = listIds.indexOf(LIST_SEPARATOR_ID);

      const orderCase = sql.join(
        listIds.map((listId, idx) => sql`WHEN ${listId} THEN ${idx}`),
        sql` `,
      );

      const showCase = sql.join(
        listIds.map(
          (listId, idx) =>
            sql`WHEN ${listId} THEN ${
              separatorIdx === -1 || idx < separatorIdx ? 1 : 0
            }`,
        ),
        sql` `,
      );

      await db.run(sql`
       UPDATE ${tables.ListUser}
       SET
         "order" = CASE "listId" ${orderCase} END,
         "show" = CASE "listId" ${showCase} END
       WHERE "userId" = ${ctx.userId}
         AND "listId" IN (${sql.join(listIds, sql`, `)});
     `);

      return db.query.List.findMany(query({ where: { id: { in: listIds } } }));
    },
  }),
}));

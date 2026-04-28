import { createDb } from "@/db";
import { builder } from "../gql-builder";
import { getUserLists } from "../helpers";
import { env } from "cloudflare:workers";
import * as tables from "@/db/schema";
import { and, eq } from "drizzle-orm";

const db = createDb(env);

const CreateTodoInput = builder.inputType("CreateTodoInput", {
  fields: (t) => ({
    text: t.string(),
    listId: t.id(),
  }),
});

builder.mutationField("createTodo", (t) =>
  t.drizzleField({
    type: "List",
    args: { input: t.arg({ type: CreateTodoInput }) },
    nullable: true,
    resolve: async (query, root, { input }, ctx) => {
      const userLists = await getUserLists(ctx.userId);
      if (!userLists.has(input.listId)) {
        throw new Error("You do not have access to this list");
      }
      await db
        .insert(tables.Todo)
        .values({
          text: input.text,
          listId: input.listId,
          userId: ctx.userId,
        })
        .returning();

      return db.query.List.findFirst(
        query({ where: { id: { eq: input.listId } } }),
      );
    },
  }),
);

const DeleteTodoInput = builder.inputType("DeleteTodoInput", {
  fields: (t) => ({
    id: t.id(),
  }),
});

builder.mutationField("deleteTodo", (t) =>
  t.boolean({
    args: { input: t.arg({ type: DeleteTodoInput }) },
    nullable: true,
    resolve: async (root, { input }, ctx) => {
      const todo = await db.query.Todo.findFirst({
        where: { id: { eq: input.id } },
      });
      if (!todo) throw new Error("Todo not found");

      const userLists = await getUserLists(ctx.userId);
      if (!userLists.has(todo.listId)) {
        throw new Error("You do not have access to this todo");
      }

      await db.delete(tables.Todo).where(eq(tables.Todo.id, input.id));
      return true;
    },
  }),
);

const UpdateTodoInput = builder.inputType("UpdateTodoInput", {
  fields: (t) => ({
    id: t.id(),
    text: t.string({ required: false }),
    isCompleted: t.boolean({ required: false }),
    listId: t.id({ required: false }),
  }),
});

builder.mutationField("updateTodo", (t) =>
  t.drizzleField({
    type: "Todo",
    args: { input: t.arg({ type: UpdateTodoInput }) },
    nullable: true,
    resolve: async (query, root, { input }, ctx) => {
      const todo = await db.query.Todo.findFirst({
        where: { id: { eq: input.id } },
      });
      if (!todo) throw new Error("Todo not found");

      const userLists = await getUserLists(ctx.userId);
      if (!userLists.has(todo.listId)) {
        throw new Error("You do not have access to this todo");
      }
      if (input.listId && !userLists.has(input.listId)) {
        throw new Error("You cannot move to this list");
      }

      await db
        .update(tables.Todo)
        .set({
          text: input.text ?? undefined,
          isCompleted: input.isCompleted ?? undefined,
          listId: input.listId ?? undefined,
        })
        .where(eq(tables.Todo.id, input.id));

      return db.query.Todo.findFirst(
        query({ where: { id: { eq: input.id } } }),
      );
    },
  }),
);

builder.mutationFields((t) => ({
  deleteCompletedTodos: t.drizzleField({
    type: "List",
    args: { listId: t.arg.id() },
    nullable: true,
    resolve: async (query, root, { listId }, ctx) => {
      const userLists = await getUserLists(ctx.userId);
      if (!userLists.has(listId)) {
        throw new Error("You do not have access to this list");
      }

      await db
        .delete(tables.Todo)
        .where(
          and(
            eq(tables.Todo.listId, listId),
            eq(tables.Todo.isCompleted, true),
          ),
        );

      return db.query.List.findFirst(query({ where: { id: { eq: listId } } }));
    },
  }),
  uncheckCompletedTodos: t.drizzleField({
    type: "List",
    args: { listId: t.arg.id() },
    nullable: true,
    resolve: async (query, root, { listId }, ctx) => {
      const userLists = await getUserLists(ctx.userId);
      if (!userLists.has(listId)) {
        throw new Error("You do not have access to this list");
      }

      await db
        .update(tables.Todo)
        .set({ isCompleted: false })
        .where(
          and(
            eq(tables.Todo.listId, listId),
            eq(tables.Todo.isCompleted, true),
          ),
        );

      return db.query.List.findFirst(query({ where: { id: { eq: listId } } }));
    },
  }),
}));

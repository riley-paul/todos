import { createDb } from "@/db";
import { builder } from "../gql-builder";
import { getUserLists } from "../helpers";
import * as tables from "@/db/schema";
import { and, eq } from "drizzle-orm";

const CreateTodoInput = builder.inputType("CreateTodoInput", {
  fields: (t) => ({
    text: t.string(),
    listId: t.id(),
  }),
});

const DeleteTodoInput = builder.inputType("DeleteTodoInput", {
  fields: (t) => ({
    id: t.id(),
  }),
});

const UpdateTodoInput = builder.inputType("UpdateTodoInput", {
  fields: (t) => ({
    id: t.id(),
    text: t.string({ required: false }),
    isCompleted: t.boolean({ required: false }),
    listId: t.id({ required: false }),
  }),
});

builder.mutationFields((t) => ({
  createTodo: t.drizzleField({
    type: "List",
    args: { input: t.arg({ type: CreateTodoInput }) },
    nullable: true,
    resolve: async (query, _root, { input }, ctx) => {
      const db = createDb(ctx.env);
      const userLists = await getUserLists(ctx);
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

  updateTodo: t.drizzleField({
    type: "Todo",
    args: { input: t.arg({ type: UpdateTodoInput }) },
    nullable: true,
    resolve: async (query, _root, { input }, ctx) => {
      const db = createDb(ctx.env);
      const todo = await db.query.Todo.findFirst({
        where: { id: { eq: input.id } },
      });
      if (!todo) throw new Error("Todo not found");

      const userLists = await getUserLists(ctx);
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

  deleteTodo: t.boolean({
    args: { input: t.arg({ type: DeleteTodoInput }) },
    nullable: true,
    resolve: async (_root, { input }, ctx) => {
      const db = createDb(ctx.env);
      const todo = await db.query.Todo.findFirst({
        where: { id: { eq: input.id } },
      });
      if (!todo) throw new Error("Todo not found");

      const userLists = await getUserLists(ctx);
      if (!userLists.has(todo.listId)) {
        throw new Error("You do not have access to this todo");
      }

      await db.delete(tables.Todo).where(eq(tables.Todo.id, input.id));
      return true;
    },
  }),

  deleteCompletedTodos: t.drizzleField({
    type: "List",
    args: { listId: t.arg.id() },
    nullable: true,
    resolve: async (query, _root, { listId }, ctx) => {
      const db = createDb(ctx.env);
      const userLists = await getUserLists(ctx);
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
    resolve: async (query, _root, { listId }, ctx) => {
      const db = createDb(ctx.env);
      const userLists = await getUserLists(ctx);
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

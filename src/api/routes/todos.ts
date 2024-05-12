import { Hono } from "hono";
import { db } from "@/api/db";
import { todoInsertSchema, todos as todosTable } from "@/api/db/schema";
import { and, asc, desc, eq } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

const app = new Hono()
  .get("/", async (c) => {
    const todos = await db
      .select()
      .from(todosTable)
      .where(and(eq(todosTable.isDeleted, false)))
      .orderBy(asc(todosTable.isCompleted), desc(todosTable.createdAt));
    return c.json(todos);
  })

  .post("/", zValidator("json", todoInsertSchema), async (c) => {
    const data = c.req.valid("json");
    const todo = await db.insert(todosTable).values(data).returning();
    return c.json(todo);
  })

  .post(
    "/update",
    zValidator(
      "json",
      z.object({ id: z.string(), data: todoInsertSchema.partial() }),
    ),
    async (c) => {
      const { id, data } = c.req.valid("json");

      const matchingIds = await db
        .select()
        .from(todosTable)
        .where(eq(todosTable.id, id));
      if (matchingIds.length === 0) {
        return c.notFound();
      }

      const todo = await db
        .update(todosTable)
        .set(data)
        .where(eq(todosTable.id, id))
        .returning();
      return c.json(todo);
    },
  )

  .post(
    "/toggle-complete",
    zValidator("json", z.object({ id: z.string(), complete: z.boolean() })),
    async (c) => {
      const { id, complete } = c.req.valid("json");

      const matchingIds = await db
        .select()
        .from(todosTable)
        .where(eq(todosTable.id, id));
      if (matchingIds.length === 0) {
        return c.notFound();
      }

      await db
        .update(todosTable)
        .set({ isCompleted: complete })
        .where(eq(todosTable.id, id));
      return c.status(204);
    },
  )

  .post(
    "/delete",
    zValidator("json", z.object({ id: z.string() })),
    async (c) => {
      const { id } = c.req.valid("json");

      const matchingIds = await db
        .select()
        .from(todosTable)
        .where(eq(todosTable.id, id));
      if (matchingIds.length === 0) {
        return c.notFound();
      }

      await db
        .update(todosTable)
        .set({ isDeleted: true })
        .where(eq(todosTable.id, id));
      return c.status(204);
    },
  )

  .post("/delete-completed", async (c) => {
    await db
      .update(todosTable)
      .set({ isDeleted: true })
      .where(eq(todosTable.isCompleted, true));
    return c.status(204);
  });

export default app;

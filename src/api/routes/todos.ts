import { Hono } from "hono";
import { db } from "@/api/db";
import { todoInsertSchema, todosTable } from "@/api/db/schema";
import { and, asc, desc, eq } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

const app = new Hono()
  .get("/", async (c) => {
    const userId = c.get("user")?.id;
    if (!userId) {
      return c.json({ error: "Not authenticated" }, 401);
    }

    const todos = await db
      .select()
      .from(todosTable)
      .where(
        and(eq(todosTable.isDeleted, false), eq(todosTable.userId, userId)),
      )
      .orderBy(asc(todosTable.isCompleted), desc(todosTable.createdAt));
    return c.json(todos);
  })

  .post(
    "/",
    zValidator("json", todoInsertSchema.omit({ userId: true })),
    async (c) => {
      const userId = c.get("user")?.id;
      if (!userId) {
        return c.json({ error: "Not authenticated" }, 401);
      }

      const data = c.req.valid("json");
      const todo = await db
        .insert(todosTable)
        .values({ ...data, userId })
        .returning();
      return c.json(todo);
    },
  )

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
      return c.json({ success: true });
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
      return c.json({ success: true });
    },
  )

  .post("/delete-completed", async (c) => {
    await db
      .update(todosTable)
      .set({ isDeleted: true })
      .where(eq(todosTable.isCompleted, true));
    return c.json({ success: true });
  });

export default app;

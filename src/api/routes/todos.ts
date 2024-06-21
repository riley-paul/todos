import { Hono } from "hono";
import { Todo, and, asc, db, desc, eq } from "astro:db";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import authMiddleware from "@/api/helpers/auth-middleware.ts";
import { generateId } from "../helpers/generate-id";

const todoCreateSchema = z.custom<Omit<typeof Todo.$inferInsert, "userId">>();
const todoUpdateSchema = z.custom<Partial<typeof Todo.$inferInsert>>();

const app = new Hono()
  .use(authMiddleware)
  .get("/", async (c) => {
    const userId = c.get("user").id;
    const todos = await db
      .select()
      .from(Todo)
      .where(and(eq(Todo.isDeleted, false), eq(Todo.userId, userId)))
      .orderBy(asc(Todo.isCompleted), desc(Todo.createdAt));
    return c.json(todos);
  })

  .post("/", zValidator("json", todoCreateSchema), async (c) => {
    const userId = c.get("user").id;
    const data = c.req.valid("json");
    const todo = await db
      .insert(Todo)
      .values({ ...data, userId, id: generateId() })
      .returning();
    return c.json(todo);
  })

  .post(
    "/update",
    zValidator("json", z.object({ id: z.string(), data: todoUpdateSchema })),
    async (c) => {
      const { id, data } = c.req.valid("json");
      const matchingIds = await db.select().from(Todo).where(eq(Todo.id, id));
      if (matchingIds.length === 0) {
        return c.notFound();
      }
      const todo = await db
        .update(Todo)
        .set(data)
        .where(eq(Todo.id, id))
        .returning();
      return c.json(todo);
    },
  )
  .post(
    "/toggle-complete",
    zValidator("json", z.object({ id: z.string(), complete: z.boolean() })),
    async (c) => {
      const { id, complete } = c.req.valid("json");
      const matchingIds = await db.select().from(Todo).where(eq(Todo.id, id));
      if (matchingIds.length === 0) {
        return c.notFound();
      }
      await db
        .update(Todo)
        .set({ isCompleted: complete })
        .where(eq(Todo.id, id));
      return c.json({ success: true });
    },
  )

  .post(
    "/delete",
    zValidator("json", z.object({ id: z.string() })),
    async (c) => {
      const { id } = c.req.valid("json");
      const matchingIds = await db.select().from(Todo).where(eq(Todo.id, id));
      if (matchingIds.length === 0) {
        return c.notFound();
      }
      await db.update(Todo).set({ isDeleted: true }).where(eq(Todo.id, id));
      return c.json({ success: true });
    },
  )
  .post("/delete-completed", async (c) => {
    await db
      .update(Todo)
      .set({ isDeleted: true })
      .where(eq(Todo.isCompleted, true));
    return c.json({ success: true });
  });

export default app;

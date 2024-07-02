import { Hono } from "hono";
import { Todo, and, asc, db, desc, eq } from "astro:db";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import authMiddleware from "@/api/helpers/auth-middleware.ts";
import { generateId } from "../helpers/generate-id";
import { validIdSchema } from "../lib/validators";
import { like } from "drizzle-orm";

const todoCreateSchema = z.custom<Omit<typeof Todo.$inferInsert, "userId">>();
const todoUpdateSchema = z.custom<Partial<typeof Todo.$inferInsert>>();

const app = new Hono()
  .use(authMiddleware)
  .get("/", async (c) => {
    const userId = c.get("user").id;

    const hashtags = await db
      .select({ text: Todo.text })
      .from(Todo)
      .where(
        and(
          eq(Todo.isDeleted, false),
          eq(Todo.userId, userId),
          like(Todo.text, "%#%"),
        ),
      )
      .then((rows) => rows.map((row) => row.text))
      .then((texts) =>
        texts.reduce((acc, val) => {
          const matches = val.match(/#[a-zA-Z0-9]+/g);
          if (matches) {
            matches.forEach((match) => {
              acc.add(match);
            });
          }
          return acc;
        }, new Set<string>()),
      )
      .then((set) => Array.from(set));

    const todos = await db
      .select()
      .from(Todo)
      .where(and(eq(Todo.isDeleted, false), eq(Todo.userId, userId)))
      .orderBy(asc(Todo.isCompleted), desc(Todo.createdAt));
    return c.json({ todos, hashtags });
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
    zValidator(
      "json",
      z.object({ id: validIdSchema(Todo), data: todoUpdateSchema }),
    ),
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
    zValidator(
      "json",
      z.object({ id: validIdSchema(Todo), complete: z.boolean() }),
    ),
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
    zValidator("json", z.object({ id: validIdSchema(Todo) })),
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

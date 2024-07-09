import { Hono } from "hono";
import { Todo, and, asc, db, desc, eq, like } from "astro:db";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import authMiddleware from "@/api/helpers/auth-middleware.ts";
import { generateId } from "../helpers/generate-id";
import { validIdSchema } from "../lib/validators";

const todoCreateSchema = z.custom<Omit<typeof Todo.$inferInsert, "userId">>();
const todoUpdateSchema = z.custom<Partial<typeof Todo.$inferInsert>>();

const todoIdValidator = zValidator(
  "param",
  z.object({ id: validIdSchema(Todo) }),
);

const app = new Hono()
  .use(authMiddleware)
  .get(
    "/",
    zValidator("query", z.object({ tag: z.string().optional() })),
    async (c) => {
      const userId = c.get("user").id;
      const { tag } = c.req.valid("query");
      const todos = await db
        .select()
        .from(Todo)
        .where(
          and(
            eq(Todo.isDeleted, false),
            eq(Todo.userId, userId),
            tag ? like(Todo.text, `%#${tag}%`) : undefined,
          ),
        )
        .orderBy(asc(Todo.isCompleted), desc(Todo.createdAt));
      return c.json(todos);
    },
  )

  .get("/hashtags", async (c) => {
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
      .then((set) => Array.from(set))
      .then((arr) => arr.map((text) => text.replace("#", "")));
    return c.json(hashtags);
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

  .patch(
    "/:id",
    zValidator("json", todoUpdateSchema),
    todoIdValidator,
    async (c) => {
      const userId = c.get("user").id;
      const { id } = c.req.valid("param");
      const data = c.req.valid("json");
      const todo = await db
        .update(Todo)
        .set(data)
        .where(and(eq(Todo.id, id), eq(Todo.userId, userId)))
        .returning();
      return c.json(todo);
    },
  )

  .delete("/:id", todoIdValidator, async (c) => {
    const userId = c.get("user").id;
    const { id } = c.req.valid("param");
    await db
      .update(Todo)
      .set({ isDeleted: true })
      .where(and(eq(Todo.id, id), eq(Todo.userId, userId)));
    return c.json({ success: true });
  })

  .delete("/completed", async (c) => {
    const userId = c.get("user").id;
    await db
      .update(Todo)
      .set({ isDeleted: true })
      .where(and(eq(Todo.isCompleted, true), eq(Todo.userId, userId)));
    return c.json({ success: true });
  });

export default app;

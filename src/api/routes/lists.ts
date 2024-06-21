import { Hono } from "hono";
import { and, asc, db, desc, eq, List, Todo } from "astro:db";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import authMiddleware from "@/api/helpers/auth-middleware.ts";

const app = new Hono()
  .use(authMiddleware)
  .get("/", async (c) => {
    const userId = c.get("user").id;
    const lists = await db
      .select()
      .from(List)
      .where(eq(List.userId, userId))
      .orderBy(desc(List.createdAt));
    return c.json(lists);
  })

  .get("/:id", zValidator("param", z.object({ id: z.string() })), async (c) => {
    const userId = c.get("user").id;
    const listId = c.req.valid("param").id;

    const list = await db
      .select()
      .from(List)
      .where(and(eq(List.userId, userId), eq(List.id, listId)))
      .then((rows) => rows[0]);

    const todos = await db
      .select()
      .from(Todo)
      .where(and(eq(Todo.isDeleted, false), eq(Todo.userId, userId)))
      .orderBy(asc(Todo.isCompleted), desc(Todo.createdAt));

    return c.json({ ...list, todos });
  });

// .post("/", zValidator("json", listCreateSchema), async (c) => {
//   const userId = c.get("user").id;
//   const data = c.req.valid("json");
//   const todo = await db
//     .insert(Todo)
//     .values({ ...data, userId, id: generateId() })
//     .returning();
//   return c.json(todo);
// });

// .post(
//   "/update",
//   zValidator("json", z.object({ id: z.string(), data: todoUpdateSchema })),
//   async (c) => {
//     const { id, data } = c.req.valid("json");
//     const matchingIds = await db.select().from(Todo).where(eq(Todo.id, id));
//     if (matchingIds.length === 0) {
//       return c.notFound();
//     }
//     const todo = await db
//       .update(Todo)
//       .set(data)
//       .where(eq(Todo.id, id))
//       .returning();
//     return c.json(todo);
//   },
// )

// .post(
//   "/delete",
//   zValidator("json", z.object({ id: z.string() })),
//   async (c) => {
//     const { id } = c.req.valid("json");
//     const matchingIds = await db.select().from(Todo).where(eq(Todo.id, id));
//     if (matchingIds.length === 0) {
//       return c.notFound();
//     }
//     await db.update(Todo).set({ isDeleted: true }).where(eq(Todo.id, id));
//     return c.json({ success: true });
//   },
// );

export default app;

import env from "@/envs-runtime";
import { createDb } from "..";
import { List, ListUser, Todo, User } from "../schema";
import { and, eq, isNull } from "drizzle-orm";
import { writeFile } from "node:fs/promises";

const exportData = async () => {
  env.NODE_ENV = "production";
  const db = createDb(env);

  const result = await db
    .select({
      id: User.id,
      displayName: User.name,
      photoUrl: User.avatarUrl,
      email: User.email,
      createdAt: User.createdAt,
      createdBy: User.id,
    })
    .from(User)
    .then((users) =>
      Promise.all(
        users.map(async (user) => {
          console.log(user.displayName);
          const lists = await db
            .select({
              id: List.id,
              name: List.name,
              createdAt: List.createdAt,
            })
            .from(List)
            .innerJoin(ListUser, eq(ListUser.listId, List.id))
            .where(eq(ListUser.userId, user.id))
            .then((lists) =>
              Promise.all(
                lists.map(async (list) => {
                  const todos = await db
                    .select({
                      id: Todo.id,
                      text: Todo.text,
                      done: Todo.isCompleted,
                      createdAt: Todo.createdAt,
                      createdBy: Todo.userId,
                    })
                    .from(Todo)
                    .where(
                      and(eq(Todo.userId, user.id), eq(Todo.listId, list.id)),
                    );
                  return { ...list, createdBy: user.id, order: 0, todos };
                }),
              ),
            );

          lists.push({
            id: crypto.randomUUID(),
            name: "Inbox",
            createdAt: new Date().toString(),
            createdBy: user.id,
            order: 0,
            todos: await db
              .select({
                id: Todo.id,
                text: Todo.text,
                done: Todo.isCompleted,
                createdAt: Todo.createdAt,
                createdBy: Todo.userId,
              })
              .from(Todo)
              .where(and(eq(Todo.userId, user.id), isNull(Todo.listId))),
          });

          return { ...user, lists };
        }),
      ),
    );

  writeFile("./data-export.json", JSON.stringify(result, null, 2));
};

exportData().catch(console.error);

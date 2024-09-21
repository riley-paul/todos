import type { TodoSelect } from "@/lib/types";
import type { ActionAPIContext } from "astro/actions/runtime/utils.js";
import { ActionError } from "astro:actions";
import {
  and,
  asc,
  db,
  desc,
  eq,
  like,
  not,
  or,
  SharedTag,
  Todo,
  User,
} from "astro:db";
import { inArray } from "drizzle-orm";

export const isAuthorized = (context: ActionAPIContext) => {
  const user = context.locals.user;
  if (!user) {
    throw new ActionError({
      code: "UNAUTHORIZED",
      message: "You are not logged in.",
    });
  }
  return user;
};

type GetTodoProps = {
  tag?: string;
  c: ActionAPIContext;
};

const todoContainsTag = (tag: string) => like(Todo.text, `%#${tag}%`);
const todoHasNoTag = not(like(Todo.text, "%#%"));

const filterTodoByTag = (tag: string | undefined) =>
  or(
    tag ? todoContainsTag(tag) : undefined,
    tag === "~" ? todoHasNoTag : undefined,
  );

export const queryTodos = async ({
  tag,
  c,
}: GetTodoProps): Promise<TodoSelect[]> => {
  const userId = isAuthorized(c).id;
  const sharedTags = await db
    .select()
    .from(SharedTag)
    .where(or(eq(SharedTag.id, userId), eq(SharedTag.sharedUserId, userId)));

  const sharedTagNames = sharedTags.map(({ tag }) => tag);
  const sharedTagUserIds = [
    ...sharedTags.map(({ userId }) => userId),
    ...sharedTags.map(({ sharedUserId }) => sharedUserId),
  ];

  const todos = await db
    .select()
    .from(Todo)
    .where(
      and(
        eq(Todo.isDeleted, false),
        or(eq(Todo.userId, userId), inArray(Todo.userId, sharedTagUserIds)),
        filterTodoByTag(tag),
        or(...sharedTagNames.map(todoContainsTag)),
      ),
    )
    .innerJoin(User, eq(User.id, Todo.userId))
    .orderBy(asc(Todo.isCompleted), desc(Todo.createdAt))
    .then((rows) =>
      rows.map(({ Todo, User }) => ({
        ...Todo,
        user: User,
        isShared: User.id !== userId,
      })),
    );
  return todos;
};

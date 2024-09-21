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

const todoContainsTag = (tag: string) => like(Todo.text, `%#${tag}%`);
const todoHasNoTag = not(like(Todo.text, "%#%"));

const filterTodoByTag = (tag: string | undefined) => {
  if (tag === "~") return todoHasNoTag;
  if (tag) return todoContainsTag(tag);
  return;
};

type GetTodoProps = {
  tag: string | undefined;
  c: ActionAPIContext;
};

export const queryTodos = async ({
  tag,
  c,
}: GetTodoProps): Promise<TodoSelect[]> => {
  const userId = isAuthorized(c).id;
  const sharedTags = await db
    .select()
    .from(SharedTag)
    .where(
      and(
        eq(SharedTag.isPending, false),
        or(eq(SharedTag.userId, userId), eq(SharedTag.sharedUserId, userId)),
      ),
    );

  const sharedTagCriteria = () => {
    if (!sharedTags.length) return;
    return or(
      ...sharedTags.map(({ userId, tag }) =>
        and(eq(Todo.userId, userId), todoContainsTag(tag)),
      ),
    );
  };

  const todos = await db
    .select()
    .from(Todo)
    .where(
      and(
        or(eq(Todo.userId, userId), sharedTagCriteria()),
        eq(Todo.isDeleted, false),
        filterTodoByTag(tag),
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

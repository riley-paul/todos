import type { TagSelect, TodoSelect } from "@/lib/types";
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

const querySharedTags = (userId: string) =>
  db
    .select()
    .from(SharedTag)
    .where(
      and(
        eq(SharedTag.isPending, false),
        or(eq(SharedTag.userId, userId), eq(SharedTag.sharedUserId, userId)),
      ),
    );

export const filterTodoBySharedTag = async (userId: string) => {
  const sharedTags = await querySharedTags(userId);

  if (sharedTags.length === 0) return;

  return or(
    ...sharedTags.map(({ userId, sharedUserId, tag }) =>
      and(
        or(eq(Todo.userId, userId), eq(Todo.userId, sharedUserId)),
        todoContainsTag(tag),
      ),
    ),
  );
};

export const queryTodos = async (
  tag: string | undefined,
  userId: string,
): Promise<TodoSelect[]> => {
  const sharedTagCriteria = await filterTodoBySharedTag(userId);

  const todos = await db
    .select()
    .from(Todo)
    .where(
      and(
        or(eq(Todo.userId, userId), sharedTagCriteria),
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

export const queryHashtags = async (userId: string): Promise<TagSelect[]> => {
  const todos = await queryTodos(undefined, userId);
  const areUntaggedTodos = todos.some((todo) => !todo.text.includes("#"));

  const tags = todos.reduce((acc, todo) => {
    const matches = todo.text.match(/#[a-zA-Z0-9]+/g);
    matches?.forEach((match) => {
      acc.add(match);
    });
    return acc;
  }, new Set<string>());

  const sharedTags = await querySharedTags(userId).then((rows) =>
    rows.map((row) => row.tag),
  );

  const hashtags: TagSelect[] = Array.from(tags)
    .map((tag) => tag.replace("#", ""))
    .map((tag) => ({
      tag,
      isShared: sharedTags.includes(tag),
    }));

  if (areUntaggedTodos) {
    hashtags.unshift({ tag: "~", isShared: false });
  }

  return hashtags;
};

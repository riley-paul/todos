import { createDb } from "@/db";
import type { BuilderContext } from "./gql-builder";

export const getUserLists = async (
  ctx: BuilderContext,
): Promise<Set<string>> => {
  const db = createDb(ctx.env);
  const listUsers = await db.query.ListUser.findMany({
    where: { userId: ctx.userId },
  });
  return new Set(listUsers.map((lu) => lu.listId));
};

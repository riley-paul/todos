import { createDb } from "@/db";
import { env } from "cloudflare:workers";

const db = createDb(env);

export const getUserLists = async (userId: string): Promise<Set<string>> => {
  const listUsers = await db.query.ListUser.findMany({ where: { userId } });
  return new Set(listUsers.map((lu) => lu.listId));
};

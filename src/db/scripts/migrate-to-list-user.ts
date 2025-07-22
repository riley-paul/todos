import env from "@/envs-runtime";
import { createDb } from "..";
import { List, ListShare, ListUser } from "../schema";

const migrateToListUser = async () => {
  const db = createDb(env);
  const lists = await db.select().from(List);
  const listShares = await db.select().from(ListShare);

  await Promise.all(
    lists.map((list) =>
      db.insert(ListUser).values({
        listId: list.id,
        userId: list.userId,
        isAdmin: true,
        isPending: false,
      }),
    ),
  );

  await Promise.all(
    listShares.map((listShare) =>
      db.insert(ListUser).values({
        listId: listShare.listId,
        userId: listShare.sharedUserId,
      }),
    ),
  );

  console.log("✅ Migration to ListUser completed successfully.");
};

migrateToListUser();

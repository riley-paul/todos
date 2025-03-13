import env from "@/envs-runtime";
import { createDb } from ".";
import { User, List, ListShare, Todo } from "./schema";

export const deleteAllData = async () => {
  const db = createDb(env);
  await Promise.all([
    db.delete(User),
    db.delete(List),
    db.delete(ListShare),
    db.delete(Todo),
  ]);
};

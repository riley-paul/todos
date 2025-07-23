import env from "@/envs-runtime";
import { createDb } from "..";
import { User, List, ListUser, Todo } from "../schema";

export const deleteAllData = async () => {
  const db = createDb(env);
  await Promise.all([
    db.delete(ListUser),
    db.delete(User),
    db.delete(List),
    db.delete(Todo),
  ]);
};

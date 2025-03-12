import db from ".";
import { User, List, ListShare, Todo } from "./schema";

export const deleteAllData = async () => {
  await Promise.all([
    db.delete(User),
    db.delete(List),
    db.delete(ListShare),
    db.delete(Todo),
  ]);
};

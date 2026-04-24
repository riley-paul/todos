import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

const relations = defineRelations(schema, (r) => ({
  User: {
    lists: r.many.List({
      from: r.User.id.through(r.ListUser.userId),
      to: r.List.id.through(r.ListUser.listId),
    }),
  },
  List: {
    todos: r.many.Todo({
      from: r.List.id,
      to: r.Todo.listId,
    }),
    users: r.many.User({
      from: r.List.id.through(r.ListUser.listId),
      to: r.User.id.through(r.ListUser.userId),
    }),
    listUser: r.one.ListUser({
      from: r.List.id,
      to: r.ListUser.listId,
    }),
  },
  Todo: {
    author: r.one.User({
      from: r.Todo.userId,
      to: r.User.id,
    }),
    list: r.one.List({
      from: r.Todo.listId,
      to: r.List.id,
    }),
  },
}));

export default relations;

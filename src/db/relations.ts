import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

const relations = defineRelations(schema, (r) => ({
  User: {
    lists: r.many.List({
      from: r.User.id.through(r.ListUser.userId),
      to: r.List.id.through(r.ListUser.listId),
    }),
    listUsers: r.many.ListUser({
      from: r.User.id,
      to: r.ListUser.userId,
    }),
    sessions: r.many.UserSession({
      from: r.User.id,
      to: r.UserSession.userId,
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
    listUser: r.many.ListUser({
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
    users: r.many.User({
      from: r.Todo.listId.through(r.ListUser.listId),
      to: r.User.id.through(r.ListUser.userId),
    }),
  },
}));

export default relations;

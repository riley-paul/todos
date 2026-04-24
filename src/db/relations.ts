import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

// export const relations = defineRelations({ users, groups, usersToGroups },
//   (r) => ({
//     users: {
//       groups: r.many.groups({
//         from: r.users.id.through(r.usersToGroups.userId),
//         to: r.groups.id.through(r.usersToGroups.groupId),
//       }),
//     },
//     groups: {
//       participants: r.many.users(),
//     },
// //   posts: {
//   author: r.one.users({
//     from: r.posts.authorId,
//     to: r.users.id,
//   }),
//   comments: r.many.comments(),
// },
// users: {
//   posts: r.many.posts(),
// },
// comments: {
//   post: r.one.posts({
//     from: r.comments.postId,
//     to: r.posts.id,
//   }),
// },
//   })
// );

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

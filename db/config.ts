import { NOW, column, defineDb, defineTable } from "astro:db";

const User = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    email: column.text({ unique: true }),

    githubId: column.number({ unique: true, optional: true }),
    githubUsername: column.text({ unique: true, optional: true }),

    googleId: column.text({ unique: true, optional: true }),

    name: column.text(),
    avatarUrl: column.text({ optional: true }),
    createdAt: column.text({ default: NOW }),
  },
});

const UserSession = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    userId: column.text({ references: () => User.columns.id }),
    expiresAt: column.number(),
    createdAt: column.text({ default: NOW }),
  },
});

const List = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    userId: column.text({ references: () => User.columns.id }),
    name: column.text(),
    createdAt: column.text({ default: NOW }),
  },
});

const ListShares = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    listId: column.text({ references: () => List.columns.id }),
    userId: column.text({ references: () => User.columns.id }),
    sharedUserId: column.text({ references: () => User.columns.id }),
    isPending: column.boolean({ default: true }),
    createdAt: column.text({ default: NOW }),
  },
});

const Todo = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    userId: column.text({ references: () => User.columns.id }),
    listId: column.text({
      references: () => List.columns.id,
      optional: true,
    }),
    sortOrder: column.number({ default: 0 }),
    text: column.text(),
    isCompleted: column.boolean({ default: false }),
    isDeleted: column.boolean({ default: false }),
    createdAt: column.text({ default: NOW }),
  },
});

const SharedTag = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    tag: column.text(),
    isPending: column.boolean({ default: true }),
    userId: column.text({ references: () => User.columns.id }),
    sharedUserId: column.text({ references: () => User.columns.id }),
    createdAt: column.text({ default: NOW }),
  },
});

// https://astro.build/db/config
export default defineDb({
  tables: {
    User,
    List,
    ListShares,
    UserSession,
    Todo,
    SharedTag,
  },
});

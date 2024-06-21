import { NOW, column, defineDb, defineTable } from "astro:db";

const User = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    githubId: column.number({ unique: true }),
    username: column.text({ unique: true }),
    name: column.text(),
    avatarUrl: column.text(),
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

const Todo = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    userId: column.text({ references: () => User.columns.id }),
    text: column.text(),
    isCompleted: column.boolean({ default: false }),
    isDeleted: column.boolean({ default: false }),
    createdAt: column.text({ default: NOW }),
  },
});

// https://astro.build/db/config
export default defineDb({
  tables: {
    User,
    UserSession,
    Todo,
  },
});

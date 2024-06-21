import { NOW, column, defineDb, defineTable } from "astro:db";

const User = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    githubId: column.number({ unique: true }),
    username: column.text({ unique: true }),
    name: column.text(),
    avatarUrl: column.text(),
    createdAt: column.date({ default: NOW }),
  },
});

const UserSession = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    userId: column.text({ references: () => User.columns.id }),
    expiresAt: column.number(),
    createdAt: column.date({ default: NOW }),
  },
});

const Todo = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    text: column.text(),
    completed: column.boolean({ default: false }),
    createdAt: column.date({ default: NOW }),
    userId: column.text({ references: () => User.columns.id }),
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

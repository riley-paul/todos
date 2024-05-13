import { db } from ".";
import { type TodoInsert, todosTable } from "./schema";

const todos: TodoInsert[] = [
  {
    text: "Buy milk",
    userId: "1",
  },
  {
    text: "Buy eggs",
    userId: "1",
  },
  {
    text: "Buy bread",
    userId: "1",
  },
  {
    text: "Learn TypeScript",
    userId: "1",
    isCompleted: true,
  },
  {
    text: "Learn React",
    userId: "1",
    isCompleted: true,
  },
  {
    text: "Learn Hono",
    userId: "1",
  },
  {
    text: "Finish the project",
    userId: "1",
  },
];

async function seed() {
  await db.delete(todosTable);
  await db.insert(todosTable).values(todos);
}

seed()
  .then(() => {
    console.log("Seeded todos");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

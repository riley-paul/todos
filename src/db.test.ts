import { db, User } from "astro:db";
import { expect, test } from "vitest";
import { v4 as uuid } from "uuid";

test("db", async () => {
  const [user] = await db
    .insert(User)
    .values({
      id: uuid(),
      email: "rileypaul96@gmail.com",
      name: "Riley Paul",
    })
    .returning();

  expect(user).toBeDefined();
});

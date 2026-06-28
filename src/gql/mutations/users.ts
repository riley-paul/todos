import { env } from "cloudflare:workers";
import { builder } from "../gql-builder";
import { createDb } from "@/db";
import * as tables from "@/db/schema";
import { eq } from "drizzle-orm";

const db = createDb(env);

const UpdateUserInput = builder.inputType("UpdateUserInput", {
  fields: (t) => ({
    settingGroupCompleted: t.boolean(),
  }),
});

builder.mutationFields((t) => ({
  updateUser: t.drizzleField({
    type: "User",
    args: { input: t.arg({ type: UpdateUserInput }) },
    nullable: true,
    resolve: async (query, root, { input }, ctx) => {
      const [updatedUser] = await db
        .update(tables.User)
        .set(input)
        .where(eq(tables.User.id, ctx.userId))
        .returning();

      return db.query.User.findFirst(
        query({ where: { id: { eq: updatedUser.id } } }),
      );
    },
  }),

  deleteUser: t.boolean({
    resolve: async (root, args, ctx) => {
      await db.delete(tables.User).where(eq(tables.User.id, ctx.userId));
      return true;
    },
  }),
}));

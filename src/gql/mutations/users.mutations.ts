import { builder } from "../gql-builder";
import * as tables from "@/db/schema";
import { eq } from "drizzle-orm";
import { createDb } from "@/db";

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
    resolve: async (query, _root, { input }, ctx) => {
      const db = createDb(ctx.env);
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
    resolve: async (_root, _args, ctx) => {
      const db = createDb(ctx.env);
      await db.delete(tables.User).where(eq(tables.User.id, ctx.userId));
      return true;
    },
  }),
}));

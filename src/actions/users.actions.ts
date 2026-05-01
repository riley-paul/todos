import { ensureAuthorized } from "@/api/helpers";
import { createDb } from "@/db";
import { zUserSettings, type UserSelect, type UserSettings } from "@/lib/types";
import { defineAction } from "astro:actions";
import { env } from "cloudflare:workers";
import * as tables from "@/db/schema";
import { eq } from "drizzle-orm";

const db = createDb(env);

export const populate = defineAction({
  handler: async (c): Promise<UserSelect[]> => {
    return db.query.User.findMany({
      columns: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
      },
    });
  },
});

export const update = defineAction({
  input: zUserSettings,
  handler: async (input, c): Promise<UserSettings> => {
    const userId = ensureAuthorized(c).id;

    console.log("Updating user with input", input);

    const [settings] = await db
      .update(tables.User)
      .set(input)
      .where(eq(tables.User.id, userId))
      .returning({
        settingGroupCompleted: tables.User.settingGroupCompleted,
      });
    return settings;
  },
});

export const remove = defineAction({
  handler: async (c) => {
    const userId = ensureAuthorized(c).id;
    await db.delete(tables.User).where(eq(tables.User.id, userId));
    return true;
  },
});

import { Lucia } from "lucia";
import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import { GitHub, Google } from "arctic";
import {
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
} from "astro:env/server";
import { User, UserSession, type UserSelect } from "@/db/schema";
import db from "@/db";

// @ts-ignore
const adapter = new DrizzleSQLiteAdapter(db, UserSession, User);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      // set to `true` when using HTTPS
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: async (user) => {
    return user;
  },
});

// IMPORTANT!
declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

type DatabaseUserAttributes = Omit<UserSelect, "id">;

export const github = new GitHub(GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET);

export const google = new Google(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  import.meta.env.SITE + "/login/google/callback",
);

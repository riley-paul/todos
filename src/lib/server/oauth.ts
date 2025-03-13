import { GitHub, Google } from "arctic";
import type { APIContext } from "astro";
import { z } from "zod";

export const createGithub = (context: APIContext) => {
  const { env } = context.locals.runtime;
  return new GitHub(
    env.GITHUB_CLIENT_ID,
    env.GITHUB_CLIENT_SECRET,
    env.SITE + "/login/github/callback",
  );
};

export const createGoogle = (context: APIContext) => {
  const { env } = context.locals.runtime;
  return new Google(
    env.GOOGLE_CLIENT_ID,
    env.GOOGLE_CLIENT_SECRET,
    env.SITE + "/login/google/callback",
  );
};

// Get the user's email from the GitHub API
// https://docs.github.com/en/rest/reference/users#get-the-authenticated-user

const zGithubUser = z.object({
  id: z.number(),
  login: z.string(),
  name: z.string(),
  avatar_url: z.string(),
});

const zGithubEmail = z.object({
  email: z.string(),
  primary: z.boolean(),
  verified: z.boolean(),
  visibility: z.string().nullable(),
});

export const getGithubUser = async (accessToken: string) => {
  const fetchInit: RequestInit = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "User-Agent": "Todos/1.0",
    },
  };

  const getUser = async () => {
    const res = await fetch("https://api.github.com/user", fetchInit);
    if (!res.ok) {
      const errorText = await res.text();
      console.error(
        "Failed to fetch user:",
        res.status,
        res.statusText,
        errorText,
      );
      throw new Error("Failed to fetch user");
    }
    return zGithubUser.parse(await res.json());
  };

  const getEmails = async () => {
    const res = await fetch("https://api.github.com/user/emails", fetchInit);
    if (!res.ok) throw new Error("Failed to fetch emails");
    return z.array(zGithubEmail).parse(await res.json());
  };

  const [user, emails] = await Promise.all([getUser(), getEmails()]);

  const primaryEmail = emails.find((email) => email.primary && email.verified);
  if (!primaryEmail) throw new Error("Primary email not found");

  return {
    ...user,
    email: primaryEmail.email,
  };
};

const zGoogleUser = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
  picture: z.string(),
});

export const getGoogleUser = async (accessToken: string) => {
  const fetchInit: RequestInit = {
    headers: { Authorization: `Bearer ${accessToken}` },
  };

  const res = await fetch(
    "https://www.googleapis.com/oauth2/v1/userinfo",
    fetchInit,
  );
  if (!res.ok) throw new Error("Failed to fetch user");
  return zGoogleUser.parse(await res.json());
};

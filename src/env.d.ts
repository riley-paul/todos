/// <reference path="../.astro/types.d.ts" />
/// <reference path="../.astro/env.d.ts" />
/// <reference path="../.astro/actions.d.ts" />
/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    session: import("./lib/types").UserSessionInfo | null;
    user: import("./lib/types").UserSelect | null;
  }
}

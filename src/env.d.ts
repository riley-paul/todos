/// <reference types="astro/client" />
/// <reference types="vite-plugin-pwa/react" />
/// <reference types="vite-plugin-pwa/client" />
/// <reference types="vite-plugin-pwa/info" />

type KVNamespace = import("@cloudflare/workers-types").KVNamespace;
type ENV = {} & import("./envs").Environment;

// use a default runtime configuration (advanced mode).
type Runtime = import("@astrojs/cloudflare").Runtime<ENV>;
declare namespace App {
  interface Locals extends Runtime {
    session: import("./lib/types").UserSessionInfo | null;
    user: import("./lib/types").UserSelect | null;
  }
}

declare module "virtual:pwa-register" {
  import type { RegisterSWOptions } from "vite-plugin-pwa/types";

  export type { RegisterSWOptions };

  export function registerSW(
    options?: RegisterSWOptions,
  ): (reloadPage?: boolean) => Promise<void>;
}

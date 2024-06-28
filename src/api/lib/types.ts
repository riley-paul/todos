import type { User, Todo } from "astro:db";

export type TableUnion = typeof User | typeof Todo;

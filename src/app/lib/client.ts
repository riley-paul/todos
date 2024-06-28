import type { AppType } from "@/api";
import { hc } from "hono/client";

export const api = hc<AppType>("/").api;

import type { AppType } from "@/api";
import { QueryClient } from "@tanstack/react-query";
import { hc } from "hono/client";

export const api = hc<AppType>("/").api;
export const client = new QueryClient();

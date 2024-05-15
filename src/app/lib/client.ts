import type { AppType } from "@/api";
import { hc } from "hono/client";

const client = hc<AppType>("/");
const api = client.api;

export default api;

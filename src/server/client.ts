import type { AppType } from ".";
import { hc } from "hono/client";

const client = hc<AppType>("/api/");
export default client;

import hono from "@/server/index";
import type { APIRoute } from "astro";

export const ALL: APIRoute = ({ request }) => hono.fetch(request);

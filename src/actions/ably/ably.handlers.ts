import type { ActionHandler } from "astro:actions";
import { isAuthorized } from "../helpers";

const getApiKey: ActionHandler<any, string> = async (c) => {
  isAuthorized(c);
  return c.locals.runtime.env.ABLY_API_KEY;
};

const ablyHandlers = { getApiKey };
export default ablyHandlers;

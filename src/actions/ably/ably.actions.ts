import { defineAction } from "astro:actions";
import ablyHandlers from "./ably.handlers";

const getApiKey = defineAction({
  handler: ablyHandlers.getApiKey,
});

const ablyActions = { getApiKey };
export default ablyActions;

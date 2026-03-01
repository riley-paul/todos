import { defineAction } from "astro:actions";
import * as listUserInputs from "./list-users.inputs";
import * as listUserHandlers from "./list-users.handlers";

// export const create = defineAction({
//   input: listUserInputs.create,
//   handler: listUserHandlers.create,
// });

// export const remove = defineAction({
//   input: listUserInputs.remove,
//   handler: listUserHandlers.remove,
// });

// export const update = defineAction({
//   input: listUserInputs.update,
//   handler: listUserHandlers.update,
// });

export const populate = defineAction({
  input: listUserInputs.populate,
  handler: listUserHandlers.populate,
});

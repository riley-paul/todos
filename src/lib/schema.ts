import { builder } from "./builder";

builder.queryType({
  fields: (t) => ({
    hello: t.string({
      resolve: () => "world",
    }),
  }),
});

export const schema = builder.toSchema();

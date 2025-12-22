import type { Db } from "@/db";
import { buildSchema } from "drizzle-graphql";
import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
} from "graphql";

export function createSchema(db: Db) {
  const { entities } = buildSchema(db);

  const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: "Query",

      fields: {
        ...entities.queries,

        user: {
          // You can reuse and customize types from original schema
          type: new GraphQLList(
            new GraphQLNonNull(entities.types.UserSelectItem),
          ),
          args: {
            // You can reuse inputs as well
            where: {
              type: entities.inputs.UserFilters,
            },
          },
          resolve: async (source, args, context, info) => {
            // Your custom logic goes here...
            return "result";
          },
        },
      },
    }),
    mutation: new GraphQLObjectType({
      name: "Mutation",
      fields: entities.mutations,
    }),
    types: [
      ...Object.values(entities.types),
      ...Object.values(entities.inputs),
    ],
  });

  return schema;
}

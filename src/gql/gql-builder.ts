import { createDb } from "@/db";
import { env } from "cloudflare:workers";
import SchemaBuilder from "@pothos/core";
import DrizzlePlugin from "@pothos/plugin-drizzle";
import { getTableConfig } from "drizzle-orm/sqlite-core";
import relations from "@/db/relations";

type DrizzleRelations = typeof relations;

interface PothosTypes {
  DrizzleRelations: DrizzleRelations;
  Context: { userId: string };
  DefaultFieldNullability: false;
  DefaultInputFieldRequiredness: true;
}

const db = createDb(env);

export const builder = new SchemaBuilder<PothosTypes>({
  plugins: [DrizzlePlugin],
  defaultFieldNullability: false,
  defaultInputFieldRequiredness: true,
  drizzle: {
    client: db,
    getTableConfig,
    relations,
  },
});

builder.queryType({});
builder.mutationType({});

export type Builder = typeof builder;

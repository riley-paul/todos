import type { CodegenConfig } from "@graphql-codegen/cli";
import env from "./src/envs-runtime";

const config: CodegenConfig = {
  schema: {
    "http://localhost:4321/graphql": {
      headers: {
        Authorization: `Bearer ${env.API_KEY}`,
      },
    },
  },
  documents: ["src/**/*.graphql"],
  generates: {
    "./src/app/gql/": {
      preset: "client",
    },
  },
  config: {
    useTypeImports: true,
  },
};
export default config;

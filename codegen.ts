import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "http://localhost:4321/graphql",
  documents: ["src/**/*.graphql"],
  generates: {
    "./src/app/gql/": {
      preset: "client",
      plugins: ["typescript", "typescript-operations"],
    },
  },
  config: {
    useTypeImports: true,
  },
};
export default config;

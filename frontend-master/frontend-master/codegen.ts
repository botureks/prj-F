import { CodegenConfig } from "@graphql-codegen/cli";

import dotenv from "dotenv";

console.log("CODEGEN CONFIG LOADED");

dotenv.config({
  path: '.env.local'
});

console.log("GRAPHQL_URL:", process.env.GRAPHQL_URL);

const config: CodegenConfig = {
  schema: process.env.GRAPHQL_URL,
  documents: ["src/**/*.ts"],
  overwrite: true,
  ignoreNoDocuments: true,
  generates: {
    "./src/shared/api/generated/": {
      preset: "client",
      plugins: [],
      config: {
        avoidOptionals: false,
        dedupeFragments: true
      },
      presetConfig: {
        gqlTagName: "gql",
        fragmentMasking: false
      },
    },
  }
};

export default config;
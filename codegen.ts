import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "../nutrichat-backend/src/typeDefs/**/*.graphql",
  documents: "graphql/operations/**/*.graphql",
  generates: {
    "./generated/graphql.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-react-apollo",
      ],
      config: {
        withComponent: false,
        withHOC: false,
        withHooks: true,
        withMutationFn: true,
        withResultType: true,
        maybeValue: "T",
        preResolveTypes: true,
      },
    },
  },
};

export default config;

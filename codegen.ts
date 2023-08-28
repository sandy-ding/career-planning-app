import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "http://localhost:4000/api/graphql",
  documents: "src/graphql/queries/*.graphql",
  generates: {
    "src/graphql/generated/": {
      preset: "client",
      plugins: [
        {
          "typescript-react-query": {
            documentVariablePrefix: "I",
            fragmentVariablePrefix: "I",
          },
        },
      ],
    },
    "./graphql.schema.json": {
      plugins: ["introspection"],
    },
  },
};

export default config;

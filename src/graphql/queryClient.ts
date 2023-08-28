import { QueryClient } from "@tanstack/react-query";
import { GraphQLClient } from "graphql-request";

export const queryClient = new QueryClient();

function getSessionToken() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
}

type AuthHeaderProps = {
  authorization?: string;
};

export const getDataSource = () => {
  const token = getSessionToken();
  return {
    endpoint: "http://localhost:4000/api/graphql",
    fetchParams: {
      headers: {
        "Content-Type": "application/json",
        ...(token && { authorization: `Bear ${token}` }),
      },
    },
  };
};

export const gqlClient = new GraphQLClient(
  "http://localhost:4000/api/graphql",
  {
    headers: () => {
      const authHeaders = {} as AuthHeaderProps;

      return {
        "Content-Type": "application/json",
        ...authHeaders,
      };
    },
  }
);

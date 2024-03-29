import { QueryClient } from "@tanstack/react-query";
import { GraphQLClient } from "graphql-request";

const endpoint = `http://${
  process.env.ENDPOINT || "localhost"
}:4000/api/graphql`;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // default: true
    },
  },
});

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
    // endpoint: "http://121.41.169.130:4000/api/graphql",
    endpoint,
    fetchParams: {
      headers: {
        "Content-Type": "application/json",
        ...(token && { authorization: `Bear ${token}` }),
      },
    },
  };
};

export const gqlClient = new GraphQLClient(endpoint, {
  headers: () => {
    const authHeaders = {} as AuthHeaderProps;
    return {
      "Content-Type": "application/json",
      ...authHeaders,
    };
  },
});

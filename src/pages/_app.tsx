import Layout from "@/components/Layout/Layout";
import "./globals.css";
import { queryClient } from "@/graphql/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";

export default function MyApp({ Component, pageProps }: AppProps) {
  const { asPath } = useRouter();

  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </QueryClientProvider>
  );
}

import "./globals.css";
import { queryClient } from "@/graphql/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import { Layout, Typography } from "antd";
import { useEffect } from "react";

const { Title } = Typography;
const { Header, Content, Footer } = Layout;

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout className="bg-white">
        <Header className="bg-blue-50">
          <Title level={5} className="text-center">
            职业生涯测试
          </Title>
        </Header>
        <Content className="w-full max-w-screen-xl mx-auto p-8">
          <Component {...pageProps} />
        </Content>
        {/* <Footer /> */}
      </Layout>
    </QueryClientProvider>
  );
}

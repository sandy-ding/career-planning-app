import "./globals.css";
import { queryClient } from "@/graphql/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import { Layout, Typography } from "antd";

const { Title } = Typography;
const { Header, Content, Footer } = Layout;

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout className="bg-white">
        <Header className="bg-blue-50 flex justify-center items-center">
          <Title level={4} className="my-2">
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

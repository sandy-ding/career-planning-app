import { ReactElement } from "react";
import { ConfigProvider } from "antd";

export default function Layout({ children }: { children: ReactElement }) {
  return (
    <ConfigProvider
      theme={{
        token: {
          fontSize: 22,
          colorTextHeading: "#1A4FA3",
        },
        components: {
          Button: {
            defaultColor: "#1A4FA3",
            paddingInlineLG: 48,
            contentFontSizeLG: 24,
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}

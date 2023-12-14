import { ReactElement, useEffect, useState } from "react";
import { Card, ConfigProvider } from "antd";

export default function Layout({ children }: { children: ReactElement }) {
  return (
    <ConfigProvider
      theme={{
        token: {
          fontSize: 16,
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
      {/* <MenuContext.Provider value={{ menu, setMenu }}>
        <div className="relative flex min-h-screen flex-col">
          <Header />
          <div className="flex-1">
            <div className="px-8 flex-1 items-start md:gap-2 lg:gap-4">
              {/* <Navbar /> */}
      {/* <main className="h-full">
                <Card
                  className="border-0 h-full px-20"
                  bodyStyle={{ height: "100%" }}
                >
                  {children}
                </Card>
              </main>
            </div>
          </div>
        </div> */}
      {children}
      {/* // </MenuContext.Provider> */}
    </ConfigProvider>
  );
}

import { ReactElement, useState } from "react";
import Header from "./Header";
import Navbar from "./Navbar";
import { Card, ConfigProvider } from "antd";
import { MenuContext } from "@/hooks/MenuContext";

export default function Layout({ children }: { children: ReactElement }) {
  const [menu, setMenu] = useState("1");
  return (
    <ConfigProvider
      theme={{
        token: {
          fontSize: 16,
        },
        components: {
          Menu: {
            subMenuItemBg: "#ffffff",
            itemHoverBg: "#ffffff",
            itemActiveBg: "#ffffff",
          },
          Statistic: {
            contentFontSize: 20,
          },
        },
      }}
    >
      <MenuContext.Provider value={{ menu, setMenu }}>
        <div className="relative flex min-h-screen flex-col">
          <Header />
          <div className="flex-1">
            <div className="px-8 flex-1 items-start md:gap-2 lg:gap-4">
              {/* <Navbar /> */}
              <main className="h-full">
                <Card
                  className="border-0 h-full px-20"
                  bodyStyle={{ height: "100%" }}
                >
                  {children}
                </Card>
              </main>
            </div>
          </div>
        </div>
      </MenuContext.Provider>
    </ConfigProvider>
  );
}

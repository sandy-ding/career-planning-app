import { Button } from "antd";
import Image from "next/image";
import { useRouter } from "next/router";
import { ReactElement } from "react";

interface IProps {
  title?: string;
  hideLogout?: boolean;
  children?: ReactElement[];
}

export default function Header({ title, hideLogout, children }: IProps) {
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="sticky top-0 z-50 w-full border-b bg-white text-primary-700">
      <div className="px-8 flex h-14 items-center justify-between">
        <div className="mr-4 flex">
          <div className="mr-6 flex items-center space-x-2">
            <Image src="/logo.png" alt="me" width="32" height="32" />
            <div>{title}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {children}
          {!hideLogout && (
            <Button
              type="link"
              className="text-primary-700 text-base"
              onClick={logout}
            >
              退出
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

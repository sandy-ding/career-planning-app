import { useRouter } from "next/router";
import Header from "@/components/Layout/Header";
import { Button } from "antd";
import classNames from "classnames";
import Image from "next/image";

interface IProps {
  headerTitle: string;
  title: string;
  btnUrl: string;
  bgImage: string;
  className?: string;
}

export default function Entry({
  title,
  headerTitle,
  btnUrl,
  bgImage,
  className,
}: IProps) {
  const router = useRouter();

  return (
    <div className="h-screen flex flex-col bg-white">
      <Header title={headerTitle}>
        <Image src="/user.png" alt="user" width="32" height="32" />
      </Header>

      <div className={classNames("pl-20 pt-5 grow bg-primary-200", className)}>
        <div
          className={classNames(
            "flex h-full bg-right bg-no-repeat bg-contain",
            bgImage
          )}
        >
          <div className="w-1/2 text-center">
            <div className="my-40 text-6xl text-primary-700">{title}</div>
            <Button
              htmlType="submit"
              size="large"
              shape="round"
              className="mb-10"
              onClick={() => router.push(btnUrl)}
            >
              开始测试
            </Button>
          </div>
        </div>
      </div>

      <div className="sticky h-14 bottom-0 z-50 w-full" />
    </div>
  );
}

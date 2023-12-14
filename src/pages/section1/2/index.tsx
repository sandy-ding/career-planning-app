import { useRouter } from "next/router";
import Header from "@/components/Layout/Header";
import { Button } from "antd";
import { ossUrl } from "@/utils";
import classNames from "classnames";

const sections = [
  {
    header: "智力测验",
    title: "你的智力有多高？",
    bg: "bg-[url(https://career-planning-app.oss-cn-beijing.aliyuncs.com/section1.svg)]",
  },
  {
    header: "人格测验",
    title: "你了解自己的人格吗？",
  },
  {
    header: "职业兴趣测验",
    title: "你喜欢什么职业呢？",
  },
];

export default function Index() {
  const router = useRouter();
  const sectionNo = Number(router.query.sectionNo) - 1 || 1;

  console.log({ sectionNo });
  return (
    <div className="h-screen flex flex-col bg-white">
      <Header title="智力测验" />
      <div className="px-20 pt-10 grow bg-primary-200 ">
        <div
          className={classNames("flex h-full bg-right bg-no-repeat bg-contain")}
          style={{
            // backgroundPosition: "right",
            // backgroundRepeat: "no-repeat",
            // backgroundSize: "contain",
            background: `url(https://career-planning-app.oss-cn-beijing.aliyuncs.com/section${sectionNo}.svg)`,
          }}
        >
          <div className="w-1/2 text-center">
            <div className="my-40 text-6xl text-primary-700">
              {sections[sectionNo].title}
              {/* 你的智力有多高？ */}
            </div>
            <Button
              htmlType="submit"
              size="large"
              shape="round"
              onClick={() => router.push("/section1/overview")}
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

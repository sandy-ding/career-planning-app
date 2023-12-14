import { useRouter } from "next/router";
import Header from "@/components/Layout/Header";
import { Button } from "antd";

export default function Index() {
  const router = useRouter();

  return (
    <div className="h-screen bg-primary-200">
      <Header title="智力测验" />
      <div className="flex p-20">
        <div className="w-1/2 min-w-[400px] text-center">
          <div className="my-40 text-6xl text-primary-700">
            你的智力有多高？
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
        <div></div>
      </div>
    </div>
  );
}

import { useRouter } from "next/router";
import { Button } from "antd";
import { useSubmitAnswerMutation } from "@/graphql/generated/graphql";
import { getDataSource } from "@/graphql/queryClient";
import Header from "@/components/Layout/Header";
import Progress from "@/components/Progress";

export default function Section1() {
  const router = useRouter();
  const { mutateAsync } = useSubmitAnswerMutation(getDataSource());

  const onClick = async () => {
    await mutateAsync({
      input: {
        questionId: "1.2",
        endTime: Date.now(),
      },
    }).then(() => {
      router.push("/section1/unit3");
    });
  };

  return (
    <div className="flex flex-col h-screen bg-primary-200">
      <Header title="语言能力" />
      <Progress
        currentIndex={4}
        currentPercent={1}
        titles={["具体推理", "抽象推理"]}
      />
      <div className="grow flex flex-col gap-10 px-10 justify-evenly items-center bg-primary-200">
        <div className="w-3/5 p-20 py-10 bg-white text-center leading-8">
          您已经完成了该模块所有问题
          <br />
          接下来，我们将进入下一个模块！
        </div>
        <div className="flex gap-4">
          <Button
            size="large"
            type="text"
            className="!text-primary-700"
            onClick={router.back}
          >
            返回
          </Button>
          <Button size="large" onClick={onClick}>
            继续
          </Button>
        </div>
      </div>
    </div>
  );
}

import { useRouter } from "next/router";
import { useSubmitAnswerMutation } from "@/graphql/generated/graphql";
import { getDataSource } from "@/graphql/queryClient";
import Overview from "@/components/Overview";

const overview = {
  title: "逻辑推理能力",
  description:
    "逻辑推理能力是指对各种事物关系的分析推理能力，涉及对图形和文字材料的理解、比较、演绎和归纳等，包括形象/具体推理（图形推理）和抽象推理（言语推理）两大类。<br/><br/>测试提示：逻辑推理测验共计20道单项选择题，每题只有一个最佳选项，答对一题得一分，答错不计分。请您<strong>尽快</strong>做出回答。下面开始测试。",
};

export default function Section1() {
  const router = useRouter();
  const { mutateAsync } = useSubmitAnswerMutation(getDataSource());

  const onClick = async () => {
    await mutateAsync({
      input: {
        questionId: "1.2",
        startTime: Date.now(),
      },
    }).then(() => {
      router.push(`${router.asPath}/question`);
    });
  };

  return <Overview {...overview} onClick={onClick} />;
}

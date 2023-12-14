import { useRouter } from "next/router";
import { useSubmitAnswerMutation } from "@/graphql/generated/graphql";
import { getDataSource } from "@/graphql/queryClient";
import Overview from "@/components/Overview";

const overview = {
  title: "数学能力",
  description:
    "数学能力是指一个人在数学领域的技能和知识水平，包括对数学概念、运算方法、问题解决和推理能力的理解和应用。通过数学能力的测量，可以评估一个人在数学领域的能力水平和潜力。高得分表明个体具备扎实的数学基础知识，良好的数学思维和解题能力，以及对数学概念和方法的深入理解。<br/><br/>测试提示：数学能力测验包括数学运算和数学思维逻辑推理2个模块。每个模块8题，限时8分钟。共计16题。答对一题得一分，答错不计分。接下来，开始数学能力测试。",
};

export default function Section1() {
  const router = useRouter();
  const { mutateAsync } = useSubmitAnswerMutation(getDataSource());

  const onClick = async () => {
    await mutateAsync({
      input: {
        questionId: "1.4",
        startTime: Date.now(),
      },
    }).then(() => {
      router.push(`${router.asPath}/question`);
    });
  };

  return <Overview {...overview} onClick={onClick} />;
}

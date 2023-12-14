import { useRouter } from "next/router";
import { useSubmitAnswerMutation } from "@/graphql/generated/graphql";
import { getDataSource } from "@/graphql/queryClient";
import Overview from "@/components/Overview";

const overview = {
  title: "语言能力",
  description:
    "语言能力是对语言掌握的能力，包括言语理解和言语表达。言语理解强调对文字材料内涵的快速理解和把握，通过词汇理解和句子理解来衡量。言语表达强调语言文字的交流与运用，通过语句填空、语句排序和语句续写来衡量。<br/><br/>测试提示：语言能力测验总计26道单项选择题，每道题只有一个最佳选项，答对一题得一分，答错不计分。接下来，开始语言能力测试。",
};

export default function Section1() {
  const router = useRouter();
  const { mutateAsync } = useSubmitAnswerMutation(getDataSource());

  const onClick = async () => {
    await mutateAsync({
      input: {
        questionId: "1.1",
        startTime: Date.now(),
      },
    }).then(() => {
      router.push(`${router.asPath}/question`);
    });
  };

  return <Overview {...overview} onClick={onClick} />;
}

import { useRouter } from "next/router";
import { useSubmitAnswerMutation } from "@/graphql/generated/graphql";
import { getDataSource } from "@/graphql/queryClient";
import { useContext, useState } from "react";
import questions from "./index.json";
import Intro from "@/components/Intro";
import RadioForm from "@/components/RadioForm";
import { MenuContext } from "@/hooks/MenuContext";
import { Stage } from "@/types";

const section = 1;

const intro = {
  title: "一、语言能力",
  description:
    "语言能力是对语言掌握的能力，包括言语理解和言语表达。言语理解强调对文字材料内涵的快速理解和把握，通过词汇理解和句子理解来衡量。言语表达强调语言文字的交流与运用，通过语句填空、语句排序和语句续写来衡量。",
  prompt:
    "测试提示：语言能力测验总计26道单项选择题，每道题只有一个最佳选项，答对一题得一分，答错不计分。接下来，开始语言能力测试。",
};

export default function Section1() {
  const router = useRouter();
  const [questionNo, setQuestionNo] = useState(0);
  const [stage, setStage] = useState(Stage.Intro);
  const [time, setTime] = useState(0);
  const { mutate } = useSubmitAnswerMutation(getDataSource());
  const { setMenu } = useContext(MenuContext);

  const onFinish = (values: { [k: string]: string }) => {
    const questionId = questions[questionNo]._id;
    const currentTime = performance.now();
    mutate({
      input: {
        questionId,
        answer: values[questionId],
        time: currentTime - time,
      },
    });
    if (questionNo === questions.length - 1) {
      router.push(`${section + 1}`);
      setMenu(`${section + 1}`);
    } else {
      setQuestionNo(questionNo + 1);
      setMenu(questions[questionNo + 1].menuId);
      setTime(currentTime);
    }
  };

  return stage === Stage.Intro ? (
    <Intro
      {...intro}
      onClick={() => {
        setStage(Stage.Main);
        setTime(performance.now());
        setMenu(questions[questionNo].menuId);
      }}
    />
  ) : (
    <RadioForm question={questions[questionNo]} onFinish={onFinish} />
  );
}

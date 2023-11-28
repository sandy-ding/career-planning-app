import { useRouter } from "next/router";
import { useSubmitAnswerMutation } from "@/graphql/generated/graphql";
import { getDataSource } from "@/graphql/queryClient";
import { useContext, useEffect, useState } from "react";
import questions from "./index.json";
import Intro from "@/components/Intro";
import RadioForm from "@/components/RadioForm";
import { MenuContext } from "@/hooks/MenuContext";
import { Stage } from "@/types";

const intro = {
  title: "十七、职业兴趣量表",
  description:
    "您好！本测验包含两部分内容，请您根据自己的真实感受来填写以下问题，每道题目仅选择一个最佳选项，请您根据自己情况进行5点评分：1完全不符合，2不符合，3一般符合，4符合，5完全符合。测验共180题，所有问题的答案没有对错、好坏之分。",
};

const intro1 = {
  title: "第一部分",
  description:
    "此部分专门测试对某类知识的感兴趣程度，请根据您自身的真实情况作答。",
};

const intro2 = {
  title: "第二部分",
  description:
    "此部分专门测试对某类工作的喜好程度，请根据您自身的真实情况作答。",
};

export default function Section16() {
  const router = useRouter();
  const [questionNo, setQuestionNo] = useState(0);
  const [stage, setStage] = useState(Stage.Intro);
  const { mutate } = useSubmitAnswerMutation(getDataSource());

  const { setMenu } = useContext(MenuContext);
  useEffect(() => setMenu("17"), []);

  const onFinish = (values: { [k: string]: string }) => {
    const questionId = `${237 + questionNo}`;
    mutate({
      input: {
        questionId,
        answer: values[questionId],
      },
    });
    if (questionNo === 89) {
      setMenu("17.2");
      setStage(Stage.Intro2);
      setQuestionNo(questionNo + 1);
    }
    if (questionNo === questions.length - 1) {
      router.push("18");
    } else {
      setQuestionNo(questionNo + 1);
    }
  };

  return (
    <>
      {stage === Stage.Intro ? (
        <Intro
          {...intro}
          onClick={() => {
            setStage(Stage.Intro1);
            setMenu("17.1");
          }}
        />
      ) : stage === Stage.Intro1 ? (
        <Intro
          {...intro1}
          onClick={() => {
            setStage(Stage.Main);
          }}
        />
      ) : stage === Stage.Intro2 ? (
        <Intro
          {...intro2}
          onClick={() => {
            setStage(Stage.Main);
          }}
        />
      ) : (
        <RadioForm
          question={{
            _id: `${237 + questionNo}`,
            label: questions[questionNo],
            options: [
              {
                value: "1",
                label: "1 完全不符合",
              },
              {
                value: "2",
                label: "2 不符合",
              },
              {
                value: "3",
                label: "3 一般符合",
              },
              {
                value: "4",
                label: "4 符合",
              },
              {
                value: "5",
                label: "5 完全符合",
              },
            ],
          }}
          onFinish={onFinish}
        />
      )}
    </>
  );
}

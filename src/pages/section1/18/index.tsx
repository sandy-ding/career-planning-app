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
  title: "十八、人格测评量表",
  description:
    "您好！本测验请根据自己的真实感受来填写以下问题，每道题目仅选择一个最佳选项，请根据自己的情况进行5点评分：1非常不符合，2不符合，3一般，4符合，5非常符合。测验共144题，所有答案没有对错、好坏之分。",
};

const reverseList = [];
export default function Section16() {
  const router = useRouter();
  const [questionNo, setQuestionNo] = useState(0);
  const [stage, setStage] = useState(Stage.Intro);
  const { mutate } = useSubmitAnswerMutation(getDataSource());

  const question = questions[questionNo];
  const questionId = question._id;

  const { setMenu } = useContext(MenuContext);
  useEffect(() => setMenu("18"), []);

  const onFinish = (values: { [k: string]: string }) => {
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
            setStage(Stage.Main);
          }}
        />
      ) : (
        <RadioForm
          question={{
            _id: questionId,
            label: `${questionNo + 1}．${question.label}`,
            options: question.isReverse
              ? [
                  {
                    value: "5",
                    label: "1 完全不符合",
                  },
                  {
                    value: "4",
                    label: "2 不符合",
                  },
                  {
                    value: "3",
                    label: "3 一般符合",
                  },
                  {
                    value: "2",
                    label: "4 符合",
                  },
                  {
                    value: "1",
                    label: "5 完全符合",
                  },
                ]
              : [
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

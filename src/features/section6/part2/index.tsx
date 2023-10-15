import React, { ReactElement, useState } from "react";
import { useSubmitAnswerMutation } from "@/graphql/generated/graphql";
import { getDataSource } from "@/graphql/queryClient";
import questions from "./index.json";
import Intro from "@/components/Intro";
import { useRouter } from "next/router";
import CheckboxForm from "@/components/CheckboxForm";

enum Stage {
  Intro,
  Main,
}

interface IProps {
  onFinish: () => void;
}

const intro = {
  title: "2. 三维空间旋转",
  description:
    "下面每道题的最左边有一个标准图形，右边的 4 个图形中总有两个与左边的标准图形是一样的(只是呈现的角度不同)，请你找出哪两个图形与左边的标准图形一样。",
};

export default function Part2(props: IProps) {
  const router = useRouter();
  const [time, setTime] = useState(0);
  const [stage, setStage] = useState(Stage.Intro);
  const [questionNo, setQuestionNo] = useState(0);
  const { mutate } = useSubmitAnswerMutation(getDataSource());

  const onFinish = (values: { [k: string]: string }) => {
    const questionId = questions[questionNo]._id;
    console.log("Success:", values, questionNo, questionId);
    mutate({
      input: {
        questionId,
        answer: JSON.stringify(values[questionId]),
      },
    });
    if (questionNo === questions.length - 1) {
      props.onFinish();
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
            setTime(performance.now());
          }}
        />
      ) : (
        <>
          <div>请你找出哪两个图形与左边的标准图形一样。</div>
          <CheckboxForm question={questions[questionNo]} onFinish={onFinish} />
        </>
      )}
    </>
  );
}

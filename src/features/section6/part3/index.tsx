import React, { ReactElement, useState } from "react";
import { useSubmitAnswerMutation } from "@/graphql/generated/graphql";
import { getDataSource } from "@/graphql/queryClient";
import questions from "./index.json";
import Intro from "@/components/Intro";
import Countdown from "antd/lib/statistic/Countdown";
import RadioForm from "@/components/RadioForm";

enum Stage {
  Intro,
  Main,
}

interface IProps {
  onFinish: () => void;
}

const intro = {
  title: "3. 空间想象",
  description:
    "您将在电脑界面上回答一系列问题，请尽量在8分钟内完成，8分钟后将直接进入下一段测验。现在，请按照界面上的指示进行作答。",
};

export default function Part2(props: IProps) {
  const [stage, setStage] = useState(Stage.Intro);
  const [questionNo, setQuestionNo] = useState(0);
  const { mutate } = useSubmitAnswerMutation(getDataSource());
  const [countdown, setCountdown] = useState<number>(0);

  const onFinish = (values: { [k: string]: string }) => {
    const questionId = questions[questionNo]._id;
    console.log("Success:", values, questionNo, questionId);
    mutate({
      input: {
        questionId,
        answer: values[questionId],
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
            setCountdown(Date.now() + 8 * 60 * 1000);
          }}
        />
      ) : (
        <div className="h-full">
          <div className="flex justify-end mt-4 h-10 text-xl">
            倒计时
            <Countdown
              value={countdown}
              format="m:ss"
              className="float-right leading-8 !text-xl"
              onFinish={() => {
                props.onFinish();
              }}
            />
          </div>
          <RadioForm question={questions[questionNo]} onFinish={onFinish} />
        </div>
      )}
    </>
  );
}

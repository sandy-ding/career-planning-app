import { useRouter } from "next/router";
import { useSubmitAnswerMutation } from "@/graphql/generated/graphql";
import { getDataSource } from "@/graphql/queryClient";
import { useMemo, useState } from "react";
import questions from "./index.json";
import RadioForm from "@/components/RadioForm";
import Header from "@/components/Layout/Header";

import Progress from "@/components/Progress";
import { Stage } from "@/types";
import Overview from "@/components/Overview";
import UnitEnd from "@/components/UnitEnd";

const unitNo = 7;
const unitId = "G";
const overview = {
  title: "机械能力",
  description:
    "机械能力是对实际情境中的机械关系和物理定律的理解能力。它包括速度、力和杠杆、流体、滑轮、热力学、电力、齿轮、车轮、声学、光学这10个主题。机械能力强的人，擅长运用基本的物理知识解决现实生活中的问题。<br/><br/>测试提示：本测验为单项选择题，每题只有一个最佳选项，每答对一题得一分，答错不计分。下面开始测试吧！",
  audioUrl: "https://career-planning-app.oss-cn-beijing.aliyuncs.com/1-7.mp3",
};

export default function Index() {
  const router = useRouter();
  const dataSource = getDataSource();

  const [time, setTime] = useState(Date.now());
  const [stage, setStage] = useState(Stage.Intro);
  const [questionNo, setQuestionNo] = useState(1);
  const { mutateAsync: submitAnswer } = useSubmitAnswerMutation(dataSource);

  const questionIndex = useMemo(() => questionNo - 1, [questionNo]);
  const questionId = `${unitId}.${questionNo}`;

  const isLast = questionIndex === questions.length - 1;

  const onChange = async (value: string) => {
    const currentTime = Date.now();
    await submitAnswer({
      input: {
        questionId,
        answer: value,
        duration: currentTime - time,
      },
    });
    setTime(currentTime);
    goNext();
  };

  const goNext = () => {
    if (isLast) {
      setStage(Stage.End);
    }
    setQuestionNo(questionNo + 1);
  };

  const onStart = async () => {
    setTime(Date.now());
    setStage(Stage.Question);
  };

  const onEnd = async () => {
    router.push(`${unitNo + 1}`);
  };

  return (
    <div className="flex flex-col h-screen bg-primary-200">
      <Header title={overview.title} />
      {stage === Stage.Intro ? (
        <Overview {...overview} onClick={onStart} />
      ) : (
        <>
          <Progress
            currentIndex={0}
            currentPercent={questionIndex / questions.length}
            titles={[""]}
          />
          {stage === Stage.Question ? (
            <div className="grow flex gap-10 px-10 items-center bg-primary-200">
              <div className="grow w-3/5 h-[calc(100%-80px)] p-20 py-10 bg-white">
                <RadioForm
                  name={questionId}
                  question={questions[questionIndex]}
                  onChange={onChange}
                />
              </div>
            </div>
          ) : (
            <UnitEnd goNext={onEnd} />
          )}
        </>
      )}
    </div>
  );
}

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
import QuizEnd from "@/components/QuizEnd";
import Encouragement from "@/components/Encouragement";

const unitId = "R";
const overview = {
  title: "职业兴趣测验",
  description:
    "您好！本测验包含两部分内容，请您根据自己的真实感受来填写以下问题，每道题目仅选择一个最佳选项，请您根据自己情况进行5点评分：1完全不符合，2不符合，3一般符合，4符合，5完全符合。测验共180题，所有问题的答案没有对错、好坏之分。",
  audioUrl: "https://career-planning-app.oss-cn-beijing.aliyuncs.com/3-1.mp3",
};
const overview1 = {
  title: "第一部分",
  description:
    "此部分专门测试对某类知识的感兴趣程度，请根据您自身的真实情况作答。",
};
const overview2 = {
  title: "第二部分",
  description:
    "此部分专门测试对某类工作的喜好程度，请根据您自身的真实情况作答。",
};

export default function Index() {
  const dataSource = getDataSource();

  const [partNo, setPartNo] = useState(1);
  const [stage, setStage] = useState(Stage.Intro);
  const [questionNo, setQuestionNo] = useState(1);
  const [time, setTime] = useState(Date.now());
  const { mutateAsync: submitAnswer } = useSubmitAnswerMutation(dataSource);

  const partIndex = useMemo(() => partNo - 1, [partNo]);
  const questionIndex = useMemo(() => questionNo - 1, [questionNo]);
  const questionId = `${unitId}${partNo}.${questionNo}`;

  const isLast = questionNo === questions[partIndex].length;

  const onChange = async (value: string) => {
    await submitAnswer({
      input: {
        questionId,
        answer: value,
        duration: Date.now() - time,
      },
    });
    if (questionNo % 25 === 0) {
      setStage(Stage.Encouragement);
    } else {
      goNext();
    }
  };

  const goNext = () => {
    if (isLast) {
      setStage(Stage.End);
    }
    setQuestionNo(questionNo + 1);
    setTime(Date.now());
  };

  const onStart = () => {
    setStage(Stage.Question);
    setTime(Date.now());
  };

  const onEnd = async () => {
    setStage(Stage.PartIntro);
    setPartNo(2);
    setQuestionNo(1);
  };

  const notIntroStage = stage !== Stage.Intro && stage !== Stage.PartIntro;
  return (
    <div className="flex flex-col h-screen bg-primary-200">
      <Header title={overview.title} />

      <>
        {stage === Stage.Intro && (
          <Overview {...overview} onClick={() => setStage(Stage.PartIntro)} />
        )}
        {notIntroStage && (
          <Progress
            currentIndex={partIndex}
            currentPercent={questionIndex / questions[partIndex].length}
            titles={["第一部分", "第二部分"]}
          />
        )}
        {stage === Stage.Encouragement && (
          <Encouragement
            index={questionNo / 25 - 1}
            onClick={() => {
              setStage(Stage.Question);
              goNext();
            }}
          />
        )}
        {stage === Stage.PartIntro && partNo === 1 && (
          <Overview {...overview1} onClick={onStart} />
        )}
        {stage === Stage.PartIntro && partNo === 2 && (
          <Overview {...overview2} onClick={onStart} />
        )}

        {stage === Stage.Question && (
          <div className="grow flex gap-10 px-10 items-center bg-primary-200">
            <div className="grow w-3/5 h-[calc(100%-80px)] p-20 py-10 bg-white">
              <RadioForm
                isHorizontal
                isTextCenter
                name={questionId}
                question={{
                  _id: questionId,
                  label: questions[partIndex][questionIndex],
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
                onChange={onChange}
              />
            </div>
          </div>
        )}
        {stage === Stage.End &&
          (partNo === 1 ? (
            <UnitEnd goNext={onEnd} />
          ) : (
            <QuizEnd goNext={() => {}} />
          ))}
      </>
    </div>
  );
}

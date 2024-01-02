import { useRouter } from "next/router";
import {
  useAnswerQuery,
  useSubmitAnswerMutation,
} from "@/graphql/generated/graphql";
import { getDataSource } from "@/graphql/queryClient";
import { useMemo, useState } from "react";
import Image from "next/image";
import questions from "./index.json";
import RadioForm from "@/components/RadioForm";
import Header from "@/components/Layout/Header";
import Progress from "@/components/Progress";
import { Stage } from "@/types";
import Loading from "@/components/Loading";
import Overview from "@/components/Overview";
import UnitEnd from "@/components/UnitEnd";
import Countdown from "antd/lib/statistic/Countdown";
import { getCountdown } from "@/utils";

const sectionNo = 1;
const unitNo = 12;
const unitId = `${sectionNo}.${unitNo}`;
const overview = {
  title: "美术能力",
  description:
    "美术能力是指一个人在视觉艺术领域的技能和才能。美术能力不仅包括绘画和绘图的技能，还包括对颜色、形状、纹理等视觉元素的理解，以及能够用艺术媒介表达思想和情感的能力。<br/><br/>测试提示：美术能力测验通过线段的宽窄和实图大小2个部分来衡量，限时8分钟，共10题，答对一题得一分，答错不计分。接下来，开始测试。",
  audioUrl: "https://carerer-planning.oss-cn-shanghai.aliyuncs.com/1-12.mp3",
};
const countdownDuration = 1000 * 60 * 8;

export default function Index() {
  const router = useRouter();
  const dataSource = getDataSource();

  const [partNo, setPartNo] = useState(1);
  const [time, setTime] = useState(Date.now());
  const [stage, setStage] = useState(Stage.Intro);
  const [questionNo, setQuestionNo] = useState(1);
  const [countdown, setCountdown] = useState<number>();
  const { mutateAsync: submitAnswer } = useSubmitAnswerMutation(dataSource);

  const isQuestionStage = stage === Stage.Question;
  const partIndex = useMemo(() => partNo - 1, [partNo]);
  const questionIndex = useMemo(() => questionNo - 1, [questionNo]);
  const questionId = `${unitId}.${partNo}.${questionNo}`;

  const { isLoading } = useAnswerQuery(
    dataSource,
    {
      questionId: unitId,
    },
    {
      onSuccess(data) {
        if (data?.answer?.startTime) {
          setStage(Stage.Question);
          setCountdown(data.answer?.startTime + countdownDuration);
        }
      },
    }
  );

  const isLast =
    partIndex === questions.length - 1 &&
    questionIndex === questions[partIndex].length - 1;

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
    } else if (questionIndex === questions[partIndex].length - 1) {
      setPartNo(partNo + 1);
      setQuestionNo(1);
    } else {
      setQuestionNo(questionNo + 1);
    }
  };

  const { mutateAsync: submitUnit } = useSubmitAnswerMutation(getDataSource());

  const onStart = async () => {
    const currentTime = Date.now();
    await submitUnit({
      input: {
        questionId: unitId,
        startTime: Date.now(),
      },
    }).then((data) => {
      setCountdown(
        (data.submitAnswer?.startTime || currentTime) + countdownDuration
      );
      setStage(Stage.Question);
      setTime(currentTime);
    });
  };

  const onEnd = async () => {
    router.push(`${unitNo + 1}`);
  };

  const onFinish = async () => {
    setStage(Stage.End);
  };

  return (
    <div className="flex flex-col h-screen bg-primary-200">
      <Header title={overview.title}>
        <>
          {!isLoading &&
            (stage === Stage.End ? (
              <div className="leading-8 text-[28px]">
                {getCountdown((countdown || 0) - Date.now())}
              </div>
            ) : (
              !!countdown && (
                <Countdown
                  value={countdown}
                  format="m:ss"
                  className="leading-8"
                  onFinish={onFinish}
                />
              )
            ))}
        </>
        <Image src="/countdown.png" alt="user" width="32" height="32" />
      </Header>
      {isLoading ? (
        <Loading />
      ) : stage === Stage.Intro ? (
        <Overview {...overview} onClick={onStart} />
      ) : (
        <>
          <Progress
            currentIndex={isQuestionStage ? partIndex : questions.length - 1}
            currentPercent={
              isQuestionStage ? questionIndex / questions[partIndex].length : 1
            }
            titles={["具体推理", "抽象推理"]}
          />
          {stage === Stage.Question ? (
            <div className="grow flex gap-10 px-10 items-center bg-primary-200">
              <div className="grow w-3/5 h-[calc(100%-80px)] p-20 py-10 bg-white">
                {isLoading ? (
                  <Loading />
                ) : (
                  <RadioForm
                    name={questionId}
                    question={questions[partIndex][questionIndex]}
                    onChange={onChange}
                    className={"!w-[350px]"}
                  />
                )}
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

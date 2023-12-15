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
import Overview from "@/components/Overview";
import UnitEnd from "@/components/UnitEnd";
import Countdown from "antd/lib/statistic/Countdown";
import Loading from "@/components/Loading";
import { getCountdown } from "@/utils";

const sectionNo = 1;
const unitNo = 2;
const unitId = `${sectionNo}.${unitNo}`;
const overview = {
  title: "逻辑推理能力",
  description:
    "逻辑推理能力是指对各种事物关系的分析推理能力，涉及对图形和文字材料的理解、比较、演绎和归纳等，包括形象/具体推理（图形推理）和抽象推理（言语推理）两大类。<br/><br/>测试提示：逻辑推理测验共计20道单项选择题，每题只有一个最佳选项，答对一题得一分，答错不计分。请您<strong>尽快</strong>做出回答。下面开始测试。",
};
const countdownDuration = 1000 * 60 * 30;

export default function Index() {
  const router = useRouter();
  const dataSource = getDataSource();

  const [partNo, setPartNo] = useState(1);
  const [stage, setStage] = useState(Stage.Intro);
  const [questionNo, setQuestionNo] = useState(1);
  const [countdown, setCountdown] = useState<number>(0);
  const [time, setTime] = useState(Date.now());
  const { mutateAsync: submitAnswer } = useSubmitAnswerMutation(dataSource);

  const partIndex = useMemo(() => partNo - 1, [partNo]);
  const questionIndex = useMemo(() => questionNo - 1, [questionNo]);
  const questionId = `${unitId}.${partNo}.${questionNo}`;

  const { data, isLoading } = useAnswerQuery(
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
      setQuestionNo(questionNo + 1);
    } else if (questionIndex === questions[partIndex].length - 1) {
      setPartNo(partNo + 1);
      setQuestionNo(1);
    } else {
      setQuestionNo(questionNo + 1);
    }
  };

  const { mutateAsync } = useSubmitAnswerMutation(getDataSource());

  const onStart = async () => {
    const currentTime = Date.now();
    await mutateAsync({
      input: {
        questionId: unitId,
        startTime: currentTime,
      },
    }).then((data) =>
      setCountdown(
        (data?.submitAnswer?.startTime || currentTime) + countdownDuration
      )
    );
    setTime(currentTime);
    setStage(Stage.Question);
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
                {getCountdown(countdown - Date.now())}
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
            currentIndex={partIndex}
            currentPercent={questionIndex / questions[partIndex].length}
            titles={["具体推理", "抽象推理"]}
          />
          {stage === Stage.Question ? (
            <div className="grow flex gap-10 px-10 items-center bg-primary-200">
              <div className="grow w-3/5 h-[calc(100%-80px)] p-20 py-10 bg-white">
                <RadioForm
                  name={questionId}
                  defaultValue={data?.answer?.answer}
                  question={questions[partIndex][questionIndex]}
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

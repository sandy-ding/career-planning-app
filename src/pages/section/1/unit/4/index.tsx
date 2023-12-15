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
const unitNo = 4;
const unitId = `${sectionNo}.${unitNo}`;
const overview = {
  title: "数学能力",
  description:
    "数学能力是指一个人在数学领域的技能和知识水平，包括对数学概念、运算方法、问题解决和推理能力的理解和应用。通过数学能力的测量，可以评估一个人在数学领域的能力水平和潜力。高得分表明个体具备扎实的数学基础知识，良好的数学思维和解题能力，以及对数学概念和方法的深入理解。<br/><br/>测试提示：数学能力测验包括数学运算和数学思维逻辑推理2个模块。每个模块8题，限时8分钟。共计16题。答对一题得一分，答错不计分。接下来，开始数学能力测试。",
};
const countdownDuration = 1000 * 60 * 8;

export default function Index() {
  const router = useRouter();
  const dataSource = getDataSource();

  const [stage, setStage] = useState(Stage.Intro);
  const [partNo, setPartNo] = useState(1);
  const [questionNo, setQuestionNo] = useState(1);

  const [time, setTime] = useState(Date.now());
  const [countdown, setCountdown] = useState<number>(
    Date.now() + countdownDuration
  );
  const { mutateAsync: submitAnswer } = useSubmitAnswerMutation(dataSource);

  const partIndex = useMemo(() => partNo - 1, [partNo]);
  const questionIndex = useMemo(() => questionNo - 1, [questionNo]);
  const partId = `${unitId}.${partNo}`;
  const questionId = `${partId}.${questionNo}`;

  const { isLoading } = useAnswerQuery(
    dataSource,
    {
      questionId: partId,
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

  const isLast = questionNo === questions[partIndex].length;

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

  const { mutateAsync } = useSubmitAnswerMutation(getDataSource());

  const onStart = async (qId: string) => {
    const currentTime = Date.now();
    await mutateAsync({
      input: {
        questionId: qId,
        startTime: currentTime,
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
    if (partNo === 1) {
      setPartNo(2);
      setQuestionNo(1);
      onStart(`${unitId}.2`);
    } else {
      router.push(`${unitNo + 1}`);
    }
  };

  const onFinish = async () => {
    if (partNo === 1) {
      setPartNo(partNo + 1);
      setQuestionNo(1);
    } else {
      setStage(Stage.End);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-primary-200">
      <Header title={overview.title}>
        <>
          {!isLoading &&
            stage !== Stage.Intro &&
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
        <Overview {...overview} onClick={() => onStart(partId)} />
      ) : (
        <>
          <Progress
            currentIndex={partIndex}
            currentPercent={questionIndex / questions[partIndex].length}
            titles={["数学运算", "数学思维逻辑推理"]}
          />
          {stage === Stage.Question ? (
            <div className="grow flex gap-10 px-10 items-center bg-primary-200">
              <div className="grow w-3/5 h-[calc(100%-80px)] p-20 py-10 bg-white">
                <RadioForm
                  name={questionId}
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

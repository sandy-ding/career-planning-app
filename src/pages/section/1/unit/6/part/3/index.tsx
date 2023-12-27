import { useRouter } from "next/router";
import {
  useAnswerQuery,
  useSubmitAnswerMutation,
} from "@/graphql/generated/graphql";
import { getDataSource } from "@/graphql/queryClient";
import { useMemo, useState } from "react";
import Image from "next/image";
import questions from "./index.json";
import Header from "@/components/Layout/Header";
import Progress from "@/components/Progress";
import { Stage } from "@/types";
import Loading from "@/components/Loading";
import Overview from "@/components/Overview";
import UnitEnd from "@/components/UnitEnd";
import Countdown from "antd/lib/statistic/Countdown";
import { getCountdown } from "@/utils";
import RadioImageForm from "@/components/RadioImageForm";

const sectionNo = 1;
const unitNo = 6;
const partNo = 3;
const unitId = `${sectionNo}.${unitNo}`;
const partId = `${unitId}.${partNo}`;
const overview = {
  title: "空间想象",
  description:
    "<strong>指导语</strong>：您将在电脑界面上回答一系列问题，请尽量在8分钟内完成，8分钟后将直接进入下一段测验。现在，请按照界面上的指示进行作答。",
  audioUrl: "https://carerer-planning.oss-cn-shanghai.aliyuncs.com/1-6-3.mp3",
};
const countdownDuration = 1000 * 60 * 8;

export default function Index() {
  const router = useRouter();
  const dataSource = getDataSource();
  const [stage, setStage] = useState(Stage.Intro);

  const [questionNo, setQuestionNo] = useState(1);
  const [countdown, setCountdown] = useState<number>(0);
  const [time, setTime] = useState<number>(Date.now());
  const { mutateAsync: submitAnswer } = useSubmitAnswerMutation(dataSource);

  const partIndex = useMemo(() => partNo - 1, [partNo]);
  const questionIndex = useMemo(() => questionNo - 1, [questionNo]);
  const questionId = `${unitId}.${partNo}.${questionNo}`;

  const { isLoading } = useAnswerQuery(
    dataSource,
    {
      questionId: partId,
    },
    {
      onSuccess(data) {
        if (data?.answer?.startTime) {
          setCountdown(data.answer?.startTime + countdownDuration);
        }
      },
    }
  );

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
    const currentTime = Date.now();
    await submitAnswer({
      input: {
        questionId: partId,
        startTime: currentTime,
      },
    }).then((data) => {
      setCountdown(
        (data?.submitAnswer?.startTime || currentTime) + countdownDuration
      );
    });
    setTime(currentTime);
    setStage(Stage.Question);
  };

  const onEnd = () => {
    router.push(`/section/${sectionNo}/unit/${unitNo + 1}`);
  };

  const onFinish = () => {
    setStage(Stage.End);
  };

  return (
    <div className="flex flex-col h-screen bg-primary-200">
      <Header title="空间能力">
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
        <Overview {...overview} onClick={onStart} />
      ) : (
        <>
          <Progress
            currentIndex={partIndex}
            currentPercent={questionIndex / questions.length}
            titles={["二维空间旋转", "三维空间旋转", "空间想象"]}
          />
          {stage === Stage.Question ? (
            <div className="grow w-full flex gap-10 px-10 items-center bg-primary-200">
              <div className="grow w-full h-[calc(100%-80px)] p-20 py-10 bg-white">
                <RadioImageForm
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

import { useRouter } from "next/router";
import {
  useAnswerQuery,
  useAnswersQuery,
  useSubmitAnswerMutation,
} from "@/graphql/generated/graphql";
import { getDataSource } from "@/graphql/queryClient";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import questions from "./index.json";
import RadioForm from "@/components/RadioForm";
import Header from "@/components/Layout/Header";
import { Button } from "antd";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Progress from "@/components/Progress";
import { Stage } from "@/types";
import Loading from "@/components/Loading";
import Overview from "@/components/Overview";
import UnitEnd from "@/components/UnitEnd";
import Countdown from "antd/lib/statistic/Countdown";

const sectionNo = 1;
const unitNo = 16;
const unitId = `${sectionNo}.${unitNo}`;
const overview = {
  title: "人际交往能力",
  description:
    "人际交往能力是指个体妥善处理组织内外关系的能力，包括与周围环境建立广泛联系、转化能力，以及正确处理上下左右关系的能力。<br/><br/>测试提示：人际交往能力测验包括人际交往礼仪和人际关系能力2个模块，共18道单选题，限时16分钟内完成。",
};

const overview1 = {
  title: "人际交往礼仪",
  description:
    "这是人际交往能力测验的第一段测验。<br/><br/>您将在电脑界面上回答一系列问题，屏幕只会呈现一道题，确认选项后将会自动进入下一题，右下角为答题卡，点击数字可进入相应题目。请尽力在8分钟内完成，8分钟后将直接入下一段测验。如果时间充裕，你也可以选择提交答题卡，提前进入下一段测验。<br/><br/>现在，请开始测验，按照界面上的指示进行作答。",
};

const overview2 = {
  title: "人际关系能力",
  description:
    "这是人际交往能力测验的第二段测验。<br/><br/>您将在电脑界面上回答一系列问题，屏幕只会呈现一道题，确认选项后将会自动进入下一题，右下角为答题卡，点击数字可进入相应题目。在这一部分中，选项没有正误之分，请不要过多考虑，凭你的真实想法或感受选择。（如果是现实中出现过的情况，则选择自己当时的做法；如果是没有出现过的情况，则设想在该情况下自己最可能做出的决定）<br/><br/>现在，请开始测验，按照界面上的指示进行作答。",
};

export default function Index() {
  const router = useRouter();
  const dataSource = getDataSource();

  const [partNo, setPartNo] = useState(1);
  const [stage, setStage] = useState(Stage.Intro);
  const [questionNo, setQuestionNo] = useState(1);
  const [countdown, setCountdown] = useState<number>();
  const { mutateAsync: submitAnswer } = useSubmitAnswerMutation(dataSource);

  const partIndex = useMemo(() => partNo - 1, [partNo]);
  const questionIndex = useMemo(() => questionNo - 1, [questionNo]);
  const partId = `${unitId}.${partNo}`;
  const questionId = `${partId}.${questionNo}`;
  const totalNum = questions[partIndex].length;

  useEffect(() => {
    const activeQuestionId = localStorage.getItem("activeQuestionId");
    if (activeQuestionId) {
      const activeIds = activeQuestionId?.split(".");
      setPartNo(Number(activeIds?.[2]));
      setQuestionNo(Number(activeIds?.[3]));
    }
  }, []);

  useEffect(() => {
    if (stage === Stage.Part1Main || stage === Stage.Part2Main) {
      localStorage.setItem("activeQuestionId", questionId);
    }
  }, [questionId, stage]);

  const {
    data: partData,
    isLoading: isLoadingUnit,
    refetch: refetchPartData,
  } = useAnswerQuery(
    dataSource,
    {
      questionId: partId,
    },
    {
      onSuccess(data) {
        if (data?.answer?.endTime) {
          if (partNo === 1) {
            setPartNo(2);
            setQuestionNo(1);
          } else {
            setStage(Stage.End);
          }
        } else if (data?.answer?.startTime) {
          setStage(stage + 1);
          setCountdown(data.answer?.startTime + 1000 * 60 * 8);
        }
      },
    }
  );

  const isLast = questionNo === questions[partIndex].length;

  const { data, isLoading } = useAnswerQuery(
    dataSource,
    {
      questionId,
    },
    {
      enabled: stage === Stage.Part1Main || stage === Stage.Part2Main,
    }
  );

  const {
    data: answers,
    isLoading: isLoadingAnswers,
    refetch,
  } = useAnswersQuery(
    dataSource,
    {
      questionId: `${partId}.`,
    },
    {
      enabled: isLast,
    }
  );

  const disableGoNext =
    isLast && (isLoadingAnswers || answers?.answers?.length !== totalNum);

  const onChange = async (value: string) => {
    if (value !== data?.answer?.answer) {
      await submitAnswer({
        input: {
          questionId,
          answer: value,
        },
      }).then(() => {
        if (isLast) {
          refetch();
        }
      });
    }
    if (!disableGoNext) {
      goNext();
    }
  };

  const goBack = () => {
    if (questionIndex === 0) {
      setPartNo(partNo - 1);
      setQuestionNo(questions[partIndex - 1].length);
    } else {
      setQuestionNo(questionNo - 1);
    }
  };

  const goNext = () => {
    if (isLast) {
      setStage(stage + 1);
    } else {
      setQuestionNo(questionNo + 1);
    }
  };

  const { mutateAsync: submitUnit } = useSubmitAnswerMutation(getDataSource());

  const onStart = async () => {
    await submitUnit({
      input: {
        questionId: partId,
        startTime: Date.now(),
      },
    }).then(() => {
      refetchPartData();
    });
  };

  const disableBack =
    !!partData?.answer?.endTime || (!!countdown && countdown < Date.now());

  const onEnd = async () => {
    if (!disableBack) {
      await submitUnit({
        input: {
          questionId: partId,
          endTime: Date.now(),
        },
      });
    }
    if (stage === Stage.Mid) {
      setStage(stage + 1);
      setPartNo(2);
      setQuestionNo(1);
      await submitUnit({
        input: {
          questionId: `${unitId}.2`,
          startTime: Date.now(),
        },
      }).then(() => refetchPartData());
    } else {
      router.push(`/section/${sectionNo + 1}/unit/1}`);
    }
    localStorage.removeItem("activeQuestionId");
  };

  const onFinish = async () => {
    await submitUnit({
      input: {
        questionId: partId,
        endTime: Date.now(),
      },
    }).then(async () => {
      if (partNo === 1) {
        setPartNo(partNo + 1);
        setQuestionNo(1);
        setStage(Stage.Mid);
      } else {
        setStage(Stage.End);
      }
      localStorage.removeItem("activeQuestionId");
    });
  };

  return (
    <div className="flex flex-col h-screen bg-primary-200">
      <Header title={overview.title}>
        {!!countdown ? (
          <Countdown
            value={countdown}
            format="m:ss"
            className="leading-8 !text-xl"
            onFinish={onFinish}
          />
        ) : (
          <></>
        )}
        <Image src="/countdown.png" alt="user" width="32" height="32" />
      </Header>
      {isLoadingUnit ? (
        <Loading />
      ) : stage === Stage.Intro ? (
        <Overview {...overview} onClick={() => setStage(Stage.Part1Intro)} />
      ) : stage === Stage.Part1Intro ? (
        <Overview {...overview1} onClick={onStart} />
      ) : stage === Stage.Part2Intro ? (
        <Overview {...overview2} onClick={onStart} />
      ) : (
        <>
          <Progress
            currentIndex={
              stage !== Stage.End ? partIndex : questions.length - 1
            }
            currentPercent={
              stage !== Stage.End
                ? questionIndex / questions[partIndex].length
                : 1
            }
            titles={["人际交往礼仪", "人际关系能力"]}
          />
          {stage === Stage.Part1Main || stage === Stage.Part2Main ? (
            <div className="grow flex gap-10 px-10 items-center bg-primary-200">
              <Button
                shape="circle"
                size="large"
                icon={<ArrowLeft size={36} />}
                onClick={goBack}
                disabled={questionIndex === 0}
              />
              <div className="grow w-3/5 h-[calc(100%-80px)] p-20 py-10 bg-white">
                {isLoading ? (
                  <Loading />
                ) : (
                  <RadioForm
                    name={questionId}
                    defaultValue={data?.answer?.answer}
                    question={questions[partIndex][questionIndex]}
                    onChange={onChange}
                  />
                )}
              </div>
              <Button
                shape="circle"
                size="large"
                icon={<ArrowRight size={36} />}
                onClick={goNext}
                disabled={disableGoNext}
              />
            </div>
          ) : (
            <UnitEnd
              disableBack={disableBack}
              goBack={() => setStage(stage - 1)}
              goNext={onEnd}
            />
          )}
        </>
      )}
    </div>
  );
}

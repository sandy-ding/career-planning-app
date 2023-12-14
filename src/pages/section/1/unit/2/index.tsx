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
import { getArrayLenSum } from "@/utils";
import Progress from "@/components/Progress";
import { Stage } from "@/types";
import Loading from "@/components/Loading";
import Overview from "@/components/Overview";
import UnitEnd from "@/components/UnitEnd";
import Countdown from "antd/lib/statistic/Countdown";

const sectionNo = 1;
const unitNo = 2;
const unitId = `${sectionNo}.${unitNo}`;
const overview = {
  title: "逻辑推理能力",
  description:
    "逻辑推理能力是指对各种事物关系的分析推理能力，涉及对图形和文字材料的理解、比较、演绎和归纳等，包括形象/具体推理（图形推理）和抽象推理（言语推理）两大类。<br/><br/>测试提示：逻辑推理测验共计20道单项选择题，每题只有一个最佳选项，答对一题得一分，答错不计分。请您<strong>尽快</strong>做出回答。下面开始测试。",
};

export default function Index() {
  const router = useRouter();
  const dataSource = getDataSource();

  const [partNo, setPartNo] = useState(1);
  const [stage, setStage] = useState(Stage.Intro);
  const [questionNo, setQuestionNo] = useState(1);
  const [countdown, setCountdown] = useState<number>();
  const { mutateAsync: submitAnswer } = useSubmitAnswerMutation(dataSource);

  const isQuestionStage = stage === Stage.Question;
  const partIndex = useMemo(() => partNo - 1, [partNo]);
  const questionIndex = useMemo(() => questionNo - 1, [questionNo]);
  const questionId = `${unitId}.${partNo}.${questionNo}`;
  const totalNum = getArrayLenSum(questions);

  useEffect(() => {
    const activeQuestionId = localStorage.getItem("activeQuestionId");
    if (activeQuestionId) {
      const activeIds = activeQuestionId?.split(".");
      setPartNo(Number(activeIds?.[2]));
      setQuestionNo(Number(activeIds?.[3]));
    }
  }, []);

  useEffect(() => {
    if (isQuestionStage) {
      localStorage.setItem("activeQuestionId", questionId);
    }
  }, [questionId, stage]);

  const {
    data: unitData,
    isLoading: isLoadingUnit,
    refetch: refetchUnit,
  } = useAnswerQuery(
    dataSource,
    {
      questionId: unitId,
    },
    {
      onSuccess(data) {
        if (data?.answer?.endTime) {
          setStage(Stage.End);
        } else if (data?.answer?.startTime) {
          setStage(Stage.Question);
          setCountdown(data.answer?.startTime + 1000 * 60 * 30);
        }
      },
    }
  );

  const isLast =
    partIndex === questions.length - 1 &&
    questionIndex === questions[partIndex].length - 1;

  const { data, isLoading } = useAnswerQuery(
    dataSource,
    {
      questionId,
    },
    {
      enabled: isQuestionStage,
    }
  );

  const {
    data: answers,
    isLoading: isLoadingAnswers,
    refetch,
  } = useAnswersQuery(
    dataSource,
    {
      questionId: `${unitId}.`,
    },
    {
      enabled: !!isLast,
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
    await submitUnit({
      input: {
        questionId: unitId,
        startTime: Date.now(),
      },
    }).then(() => refetchUnit());
    setStage(Stage.Question);
  };

  const disableBack =
    !!unitData?.answer?.endTime || (!!countdown && countdown < Date.now());

  const onEnd = async () => {
    if (!disableBack) {
      await submitUnit({
        input: {
          questionId: unitId,
          endTime: Date.now(),
        },
      });
    }

    router.push(`/section/${sectionNo}/unit/${unitNo + 1}`);
    localStorage.removeItem("activeQuestionId");
  };

  const onFinish = async () => {
    await submitUnit({
      input: {
        questionId: unitId,
        endTime: Date.now(),
      },
    }).then(() => {
      setStage(Stage.End);
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
              <Button
                shape="circle"
                size="large"
                icon={<ArrowLeft size={36} />}
                onClick={goBack}
                disabled={partIndex === 0 && questionIndex === 0}
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
              goBack={() => setStage(Stage.Question)}
              goNext={onEnd}
            />
          )}
        </>
      )}
    </div>
  );
}

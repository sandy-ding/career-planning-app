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
const unitNo = 4;
const unitId = `${sectionNo}.${unitNo}`;
const overview = {
  title: "数学能力",
  description:
    "数学能力是指一个人在数学领域的技能和知识水平，包括对数学概念、运算方法、问题解决和推理能力的理解和应用。通过数学能力的测量，可以评估一个人在数学领域的能力水平和潜力。高得分表明个体具备扎实的数学基础知识，良好的数学思维和解题能力，以及对数学概念和方法的深入理解。<br/><br/>测试提示：数学能力测验包括数学运算和数学思维逻辑推理2个模块。每个模块8题，限时8分钟。共计16题。答对一题得一分，答错不计分。接下来，开始数学能力测试。",
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
    if (isQuestionStage) {
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
          setStage(Stage.Question);
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
      setStage(partNo === 1 ? Stage.Mid : Stage.End);
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
      setStage(Stage.Question);
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
      setStage(Stage.Question);
      setPartNo(2);
      setQuestionNo(1);
      await submitUnit({
        input: {
          questionId: `${unitId}.2`,
          startTime: Date.now(),
        },
      }).then(() => refetchPartData());
    } else {
      router.push(`/section/${sectionNo}/unit/${unitNo + 1}`);
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
        <Overview {...overview} onClick={onStart} />
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
            titles={["数学运算", "数学思维逻辑推理"]}
          />
          {stage === Stage.Question ? (
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
              goBack={() => setStage(Stage.Question)}
              goNext={onEnd}
            />
          )}
        </>
      )}
    </div>
  );
}

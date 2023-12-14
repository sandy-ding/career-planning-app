import { useRouter } from "next/router";
import {
  useAnswerQuery,
  useAnswersQuery,
  useSubmitAnswerMutation,
} from "@/graphql/generated/graphql";
import { getDataSource } from "@/graphql/queryClient";
import { useEffect, useMemo, useState } from "react";
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
import QuizEnd from "@/components/QuizEnd";

const sectionNo = 3;
const unitNo = 1;
const unitId = `${sectionNo}.${unitNo}`;
const overview = {
  title: "职业兴趣测验",
  description:
    "您好！本测验包含两部分内容，请您根据自己的真实感受来填写以下问题，每道题目仅选择一个最佳选项，请您根据自己情况进行5点评分：1完全不符合，2不符合，3一般符合，4符合，5完全符合。测验共180题，所有问题的答案没有对错、好坏之分。",
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
  const router = useRouter();
  const dataSource = getDataSource();

  const [partNo, setPartNo] = useState(1);
  const [stage, setStage] = useState(Stage.Intro);
  const [questionNo, setQuestionNo] = useState(1);
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
      const part = Number(activeIds?.[2]);
      setPartNo(part);
      setQuestionNo(Number(activeIds?.[3]));
      setStage(part === 1 ? Stage.Part1Main : Stage.Part2Main);
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
          setStage(partNo === 1 ? Stage.Part1Main : Stage.Part2Main);
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

  const onEnd = async () => {
    await submitUnit({
      input: {
        questionId: partId,
        endTime: Date.now(),
      },
    });
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
      router.push("/result");
    }
    localStorage.removeItem("activeQuestionId");
  };

  return (
    <div className="flex flex-col h-screen bg-primary-200">
      <Header title={overview.title} />
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
            titles={["第一部分", "第二部分"]}
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
          ) : stage === Stage.Mid ? (
            <UnitEnd
              disableBack={!!partData?.answer?.endTime}
              goBack={() => setStage(stage - 1)}
              goNext={onEnd}
            />
          ) : (
            <QuizEnd
              disableBack={!!partData?.answer?.endTime}
              goBack={() => setStage(stage - 1)}
              goNext={onEnd}
            />
          )}
        </>
      )}
    </div>
  );
}

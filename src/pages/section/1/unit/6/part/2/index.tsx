import { useRouter } from "next/router";
import {
  useAnswerQuery,
  useAnswersQuery,
  useSubmitAnswerMutation,
} from "@/graphql/generated/graphql";
import { getDataSource } from "@/graphql/queryClient";
import { useEffect, useMemo, useState } from "react";
import questions from "./index.json";
import Header from "@/components/Layout/Header";
import { Button } from "antd";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Progress from "@/components/Progress";
import { Stage } from "@/types";
import Loading from "@/components/Loading";
import Overview from "@/components/Overview";
import UnitEnd from "@/components/UnitEnd";
import CheckboxForm from "@/components/CheckboxForm";

const sectionNo = 1;
const unitNo = 6;
const partNo = 2;
const unitId = `${sectionNo}.${unitNo}`;
const partId = `${unitId}.${partNo}`;
const overview = {
  title: "三维空间旋转",
  description:
    "下面每道题的最左边有一个标准图形，右边的 4 个图形中总有两个与左边的标准图形是一样的(只是呈现的角度不同)，请你找出哪两个图形与左边的标准图形一样。",
};

export default function Index() {
  const router = useRouter();
  const dataSource = getDataSource();

  const [stage, setStage] = useState(Stage.Intro);
  const [questionNo, setQuestionNo] = useState(1);
  const { mutateAsync: submitAnswer } = useSubmitAnswerMutation(dataSource);

  const isQuestionStage = stage === Stage.Question;
  const partIndex = useMemo(() => partNo - 1, [partNo]);
  const questionIndex = useMemo(() => questionNo - 1, [questionNo]);
  const questionId = `${partId}.${questionNo}`;
  const totalNum = questions.length;

  console.log({ questionNo });
  useEffect(() => {
    const activeQuestionId = localStorage.getItem("activeQuestionId");
    if (activeQuestionId) {
      const activeIds = activeQuestionId?.split(".");
      setQuestionNo(Number(activeIds?.[3]));
      setStage(Stage.Question);
    }
  }, []);

  useEffect(() => {
    if (isQuestionStage) {
      localStorage.setItem("activeQuestionId", questionId);
    }
  }, [questionId, stage]);

  const { data: unitData, isLoading: isLoadingUnit } = useAnswerQuery(
    dataSource,
    {
      questionId: partId,
    },
    {
      onSuccess(data) {
        if (data?.answer?.endTime) {
          setStage(Stage.End);
        } else if (data?.answer?.startTime) {
          setStage(Stage.Question);
        }
      },
    }
  );

  const isLast = questionIndex === questions.length - 1;

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
    setQuestionNo(questionNo - 1);
  };

  const goNext = () => {
    if (isLast) {
      setStage(Stage.End);
    } else if (questionIndex === questions.length - 1) {
      setQuestionNo(1);
    } else {
      setQuestionNo(questionNo + 1);
    }
  };

  const { mutateAsync } = useSubmitAnswerMutation(getDataSource());

  const onStart = async () => {
    await mutateAsync({
      input: {
        questionId: partId,
        startTime: Date.now(),
      },
    });
    setStage(Stage.Question);
  };

  const onEnd = async () => {
    await mutateAsync({
      input: {
        questionId: partId,
        endTime: Date.now(),
      },
    }).then(() => {
      router.push(`${partNo + 1}`);
      localStorage.removeItem("activeQuestionId");
    });
  };

  const onFinish = (values: { [k: string]: string }) => {
    mutateAsync({
      input: {
        questionId,
        answer: JSON.stringify(values[questionId]),
      },
    });
    if (questionNo === questions.length) {
      setStage(Stage.End);
    } else {
      setQuestionNo(questionNo + 1);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-primary-200">
      <Header title={overview.title} />
      {isLoadingUnit ? (
        <Loading />
      ) : stage === Stage.Intro ? (
        <Overview {...overview} onClick={onStart} />
      ) : (
        <>
          <Progress
            currentIndex={partIndex}
            currentPercent={
              isQuestionStage ? questionIndex / questions.length : 1
            }
            titles={["二维空间旋转", "三维空间旋转", "空间想象"]}
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
                  <>
                    <div>请你找出哪两个图形与左边的标准图形一样。</div>
                    <CheckboxForm
                      name={questionId}
                      defaultValue={
                        data?.answer?.answer && JSON.parse(data?.answer?.answer)
                      }
                      question={questions[questionIndex]}
                      onFinish={onFinish}
                    />
                  </>
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
              disableBack={!!unitData?.answer?.endTime}
              goBack={() => setStage(Stage.Question)}
              goNext={onEnd}
            />
          )}
        </>
      )}
    </div>
  );
}

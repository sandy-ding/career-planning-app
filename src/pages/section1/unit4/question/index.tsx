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
import { Button, Spin } from "antd";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getArrayLenSum } from "@/utils";
import Progress from "@/components/Progress";

const questionIdPrefix = "1.4.";

export default function Index() {
  const router = useRouter();
  const dataSource = getDataSource();

  const [partNo, setPartNo] = useState(1);
  const [questionNo, setQuestionNo] = useState(1);
  const { mutate } = useSubmitAnswerMutation(dataSource);

  const partIndex = useMemo(() => partNo - 1, [partNo]);
  const questionIndex = useMemo(() => questionNo - 1, [questionNo]);
  const questionId = `${questionIdPrefix}${partNo}.${questionNo}`;
  const totalNum = getArrayLenSum(questions);

  useEffect(() => {
    const activeQuestionId = localStorage.getItem("activeQuestionId");
    if (activeQuestionId) {
      const activeIds = activeQuestionId?.split(".");
      setPartNo(Number(activeIds?.[2]));
      setQuestionNo(Number(activeIds?.[3]));
    }
  }, []);

  useEffect(
    () => localStorage.setItem("activeQuestionId", questionId),
    [questionId]
  );

  const isLast =
    partIndex === questions.length - 1 &&
    questionIndex === questions[partIndex].length - 1;

  const { data, isLoading } = useAnswerQuery(dataSource, {
    questionId,
  });

  const { data: answers, isLoading: isLoadingAnswers } = useAnswersQuery(
    dataSource,
    {
      questionId: questionIdPrefix,
    },
    {
      enabled: !!isLast,
    }
  );

  const onChange = (value: string) => {
    if (value !== data?.answer?.answer) {
      mutate({
        input: {
          questionId,
          answer: value,
        },
      });
    }
    localStorage.setItem("activeQuestionId", questionId);
    goNext();
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
      router.push("/section1/unit5/end");
    } else if (questionIndex === questions[partIndex].length - 1) {
      setPartNo(partNo + 1);
      setQuestionNo(1);
    } else {
      setQuestionNo(questionNo + 1);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-primary-200">
      <Header title="数学能力" />
      <Progress
        currentIndex={partIndex}
        currentPercent={questionIndex / questions[partIndex].length}
        titles={["数学运算", "数学思维逻辑推理"]}
      />
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
            <div className="h-full flex items-center justify-center">
              <Spin size="large" />
            </div>
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
          disabled={
            isLast &&
            (isLoadingAnswers || answers?.answers?.length !== totalNum)
          }
        />
      </div>
    </div>
  );
}

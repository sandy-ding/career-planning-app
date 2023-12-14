import { useRouter } from "next/router";
import {
  useAnswerQuery,
  useAnswersQuery,
  useSubmitAnswerMutation,
} from "@/graphql/generated/graphql";
import { getDataSource } from "@/graphql/queryClient";
import { useMemo } from "react";
import questions from "./index.json";
import RadioForm from "@/components/RadioForm";
import Header from "@/components/Layout/Header";
import { Button, Spin } from "antd";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getArrayLenSum } from "@/utils";
import Progress from "@/components/Progress";
import Countdown from "antd/lib/statistic/Countdown";

export default function Section1() {
  const dataSource = getDataSource();
  const router = useRouter();
  const questionPath = router.query.questionPath;
  const { mutate } = useSubmitAnswerMutation(dataSource);

  const partNo = useMemo(() => Number(questionPath?.[0]), [questionPath]);
  const partIndex = useMemo(() => partNo - 1, [partNo]);
  const questionNo = useMemo(() => Number(questionPath?.[2]), [questionPath]);
  const questionIndex = useMemo(() => questionNo - 1, [questionNo]);
  const questionIdPrefix = "1.2.";
  const questionId = `${questionIdPrefix}${partNo}.${questionNo}`;
  const totalNum = getArrayLenSum(questions);

  const isLast =
    partIndex === questions.length - 1 &&
    questionIndex === questions[partIndex].length - 1;

  useAnswerQuery(
    dataSource,
    {
      questionId: "1.2",
    },
    {
      onSuccess: {},
    }
  );

  // const { data, isLoading } = useAnswerQuery(dataSource, {
  //   questionId,
  // });

  const { data: answers } = useAnswersQuery(
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
    goNext();
  };

  const goNext = () => {
    if (isLast) {
      router.push("/section1/unit2/end");
    } else if (questionIndex === questions[partIndex].length - 1) {
      router.push(`/section1/unit2/part/${partNo + 1}/question/1`);
    } else {
      router.push(`/section1/unit2/part/${partNo}/question/${questionNo + 1}`);
    }
  };

  return (
    Number.isInteger(partNo) &&
    Number.isInteger(questionNo) && (
      <div className="flex flex-col h-screen bg-primary-200">
        <Header title="逻辑推理能力">
          <Countdown
            value={countdown}
            format="m:ss"
            className="float-right leading-8 !text-xl"
            onFinish={() => {
              router.push("3");
            }}
          />
        </Header>
        <Progress
          currentIndex={partIndex}
          currentPercent={questionIndex / questions[partIndex].length}
          titles={["具体推理", "抽象推理"]}
        />
        <div className="grow flex gap-10 px-10 items-center bg-primary-200">
          <Button
            shape="circle"
            size="large"
            icon={<ArrowLeft size={36} />}
            onClick={router.back}
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
            disabled={isLast && answers?.answers?.length !== totalNum}
          />
        </div>
      </div>
    )
  );
}

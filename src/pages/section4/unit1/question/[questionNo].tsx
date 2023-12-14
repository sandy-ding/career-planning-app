import { useRouter } from "next/router";
import {
  useAnswerQuery,
  useSubmitAnswerMutation,
} from "@/graphql/generated/graphql";
import { getDataSource } from "@/graphql/queryClient";
import { useMemo, useState } from "react";
import questions from "./index.json";
import RadioForm from "@/components/RadioForm";
import Header from "@/components/Layout/Header";
import { Button, Spin, Steps } from "antd";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function Section1() {
  const dataSource = getDataSource();
  const router = useRouter();
  const [time, setTime] = useState(0);
  const { mutate } = useSubmitAnswerMutation(dataSource);

  const questionNo = useMemo(
    () => Number(router.query.questionNo) - 1 || 0,
    [router.query.questionNo]
  );
  const questionId = questions[questionNo]._id;

  const { data, isLoading } = useAnswerQuery(dataSource, { questionId });

  console.log({ data });
  const onChange = (value: string) => {
    const currentTime = performance.now();
    mutate({
      input: {
        questionId,
        answer: value,
        time: currentTime - time,
      },
    });
    goNext();
  };

  const goNext = () => {
    if (questionNo === questions.length - 1) {
      router.push("/section1/unit2");
    } else {
      router.push(`${questionNo + 2}`);
    }
  };

  const currentStep = useMemo(() => {
    const questionNo = Number(router.query.questionNo) || 1;
    if (questionNo < 11) return 0;
    if (questionNo < 21) return 1;
    if (questionNo < 23) return 2;
    if (questionNo < 25) return 3;
    return 4;
  }, [router.query.questionNo]);

  return (
    <div className="flex flex-col h-screen bg-primary-200">
      <Header title="语言能力" />
      <Steps
        type="navigation"
        current={currentStep}
        className="site-navigation-steps"
        items={[
          {
            title: "词汇理解",
          },
          {
            title: "句子理解",
          },
          {
            title: "语句填空",
          },
          {
            title: "语句排序",
          },
          {
            title: "语句续写",
          },
        ]}
      />
      <div className="grow flex gap-10 px-10 items-center bg-primary-200">
        <Button
          shape="circle"
          size="large"
          icon={<ArrowLeft size={36} />}
          onClick={router.back}
        />
        <div className="grow w-3/5 h-[calc(100%-80px)] p-20 py-10 bg-white">
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <Spin size="large" />
            </div>
          ) : (
            <RadioForm
              defaultValue={data?.answer?.answer || undefined}
              question={questions[questionNo]}
              onChange={onChange}
            />
          )}
        </div>
        <Button
          shape="circle"
          size="large"
          icon={<ArrowRight size={36} />}
          onClick={goNext}
        />
      </div>
    </div>
  );
}

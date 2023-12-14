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
      router.push("/section1/unit5/part2");
    } else {
      router.push(`${questionNo + 2}`);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-primary-200">
      <Header title="信息检索与归纳能力" />
      <Steps
        type="navigation"
        current={0}
        className="site-navigation-steps"
        items={[
          {
            title: "表格分析",
          },
          {
            title: "图形分析",
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
            <div className="flex gap-4">
              <div>
                根据下表，回答1—5题。
                <img
                  src="https://carerer-planning.oss-cn-shanghai.aliyuncs.com/q103.png"
                  className="block w-96 mt-4"
                />
              </div>
              <div className="grow">
                <RadioForm
                  defaultValue={data?.answer?.answer || undefined}
                  question={questions[questionNo]}
                  onChange={onChange}
                />
              </div>
            </div>
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

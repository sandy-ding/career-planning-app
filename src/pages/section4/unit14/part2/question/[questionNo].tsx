import { useRouter } from "next/router";
import {
  useAnswerQuery,
  useSubmitAnswerMutation,
} from "@/graphql/generated/graphql";
import { getDataSource } from "@/graphql/queryClient";
import { useEffect, useMemo, useState } from "react";
import questions from "./index.json";
import RadioForm from "@/components/RadioForm";
import Header from "@/components/Layout/Header";
import { Button, Form, Spin, Steps } from "antd";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function Section1() {
  const router = useRouter();
  const [time, setTime] = useState<number>(0);
  const { mutate } = useSubmitAnswerMutation(getDataSource());
  const questionNo = useMemo(
    () => Number(router.query.questionNo) - 1 || 0,
    [router.query.questionNo]
  );

  const question = questions[questionNo];
  const questionId = questions[questionNo]._id;

  const { data, isLoading } = useAnswerQuery(getDataSource(), { questionId });

  const goNext = () => {
    if (questionNo === questions.length - 1) {
      router.push("/section1/unit15");
    } else {
      router.push(`${questionNo + 2}`);
    }
  };

  const onChange = (value: string) => {
    mutate({
      input: {
        answer: value,
        questionId: questions[questionNo]._id,
        time: Date.now() - time,
      },
    });
    if (questionNo === questions.length - 1) {
      router.push("/section1/unit15");
    } else {
      router.push(`${questionNo + 2}`);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-primary-200">
      <Header title="思维转换能力" />
      <Steps
        type="navigation"
        current={1}
        className="site-navigation-steps"
        items={[
          {
            title: "图片转换为对应文字",
          },
          {
            title: "文字转换为对应图片",
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
          <RadioForm
            defaultValue={data?.answer?.answer || undefined}
            question={questions[questionNo]}
            onChange={onChange}
          />
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

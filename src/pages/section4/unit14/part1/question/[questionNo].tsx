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

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const key = e.key.toUpperCase();
      if (key == "T" || key == "F") {
        mutate({
          input: {
            questionId: question._id,
            answer: key,
            isCorrect: key === question.answer,
            time: Date.now() - time,
          },
        });
        if (questionNo === 9) {
          router.push("/section1/unit14/part2");
        }
        router.push(`${questionNo + 2}`);
        setTime(Date.now());
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return function cleanup() {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [questionNo]);

  const goNext = () => {
    if (questionNo === questions.length - 1) {
      router.push("/section1/unit14");
    } else {
      router.push(`${questionNo + 2}`);
    }
  };

  const currentStep = useMemo(() => {
    if (questionNo < 10) return 0;
    if (questionNo < 20) return 1;
    return 2;
  }, [questionNo]);

  return (
    <div className="flex flex-col h-screen bg-primary-200">
      <Header title="思维转换能力" />
      <Steps
        type="navigation"
        current={0}
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
          <div>如果一致请按T键，如果不一致请按F键。</div>
          <Form
            name="basic"
            autoComplete="off"
            layout="vertical"
            requiredMark={false}
            className="flex flex-col justify-between h-full"
          >
            <Form.Item
              label={<label className="contents">{question.label}</label>}
            >
              <div className="flex justify-center items-center mt-20">
                <img
                  className="max-w-full max-h-96 object-scale-down"
                  src={question.fileUrl}
                />
              </div>
            </Form.Item>
          </Form>
        </div>
        <Button
          shape="circle"
          size="large"
          icon={<ArrowRight size={36} />}
          disabled
          onClick={goNext}
        />
      </div>
    </div>
  );
}

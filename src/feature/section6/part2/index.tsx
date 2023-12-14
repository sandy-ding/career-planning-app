import React, { useState } from "react";
import { useSubmitAnswerMutation } from "@/graphql/generated/graphql";
import { getDataSource } from "@/graphql/queryClient";
import questions from "./index.json";
import { useRouter } from "next/router";
import CheckboxForm from "@/components/CheckboxForm";

export default function Part2({ questionNo }: { questionNo: number }) {
  const router = useRouter();
  const [time, setTime] = useState(0);
  const { mutate } = useSubmitAnswerMutation(getDataSource());

  const onFinish = (values: { [k: string]: string }) => {
    const questionId = questions[questionNo]._id;
    console.log("Success:", values, questionNo, questionId);
    mutate({
      input: {
        questionId,
        answer: JSON.stringify(values[questionId]),
      },
    });
    if (questionNo === questions.length - 1) {
      router.push("/section1/unit6/part3");
    } else {
      router.push(`${questionNo + 2}`);
    }
  };

  return (
    <>
      <div>请你找出哪两个图形与左边的标准图形一样。</div>
      <CheckboxForm question={questions[questionNo]} onFinish={onFinish} />
    </>
  );
}

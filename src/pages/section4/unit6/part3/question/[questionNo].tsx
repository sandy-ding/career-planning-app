import { useRouter } from "next/router";
import {
  useAnswerQuery,
  useSubmitAnswerMutation,
} from "@/graphql/generated/graphql";
import { getDataSource } from "@/graphql/queryClient";
import { useMemo, useState } from "react";
import questions from "./index.json";
import Header from "@/components/Layout/Header";
import { Button, Spin, Steps } from "antd";
import { ArrowLeft, ArrowRight } from "lucide-react";
import RadioForm from "@/components/RadioForm";

export default function Section1() {
  const dataSource = getDataSource();
  const router = useRouter();
  const [time, setTime] = useState(0);

  const questionNo = useMemo(
    () => Number(router.query.questionNo) - 1 || 0,
    [router.query.questionNo]
  );

  const { mutate } = useSubmitAnswerMutation(getDataSource());

  const goNext = () => {
    if (questionNo === questions.length - 1) {
      router.push("/section1/part3");
    } else {
      router.push(`${questionNo + 2}`);
    }
  };

  const onChange = (value: string) => {
    const questionId = questions[questionNo]._id;
    mutate({
      input: {
        questionId,
        answer: value,
      },
    });
    if (questionNo === questions.length - 1) {
      router.push("/section1/unit7");
    } else {
      router.push(`${questionNo + 2}`);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-primary-200">
      <Header title="空间能力" />
      <Steps
        type="navigation"
        current={1}
        className="site-navigation-steps"
        items={[
          {
            title: "二维空间旋转",
          },
          {
            title: "三维空间旋转",
          },
          {
            title: "空间想象",
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
          <RadioForm question={questions[questionNo]} onChange={onChange} />
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

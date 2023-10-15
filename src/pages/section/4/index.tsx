import { useRouter } from "next/router";
import { useSubmitAnswerMutation } from "@/graphql/generated/graphql";
import { getDataSource } from "@/graphql/queryClient";
import { Card, Menu, MenuProps, Typography } from "antd";
import { useState } from "react";
import questions from "./index.json";
import Intro from "@/components/Intro";
import RadioForm from "@/components/RadioForm";
import Countdown from "antd/lib/statistic/Countdown";
import { Stage } from "@/types";

const { Title } = Typography;

const items: MenuProps["items"] = [
  {
    label: "1. 数学运算",
    key: "1",
  },
  {
    label: "2. 数学思维逻辑推理",
    key: "2",
  },
];

const intro = {
  title: "四、数学能力",
  description:
    "数学能力是指一个人在数学领域的技能和知识水平，包括对数学概念、运算方法、问题解决和推理能力的理解和应用。通过数学能力的测量，可以评估一个人在数学领域的能力水平和潜力。高得分表明个体具备扎实的数学基础知识，良好的数学思维和解题能力，以及对数学概念和方法的深入理解。",
  prompt:
    "测试提示：数学能力测验包括数学运算和数学思维逻辑推理2个模块。每个模块8题，限时8分钟。共计16题。答对一题得一分，答错不计分。接下来，开始数学能力测试。",
};

export default function Section4() {
  const router = useRouter();
  const [menu, setMenu] = useState("1");
  const [questionNo, setQuestionNo] = useState(0);
  const [stage, setStage] = useState(Stage.Intro);
  const [countdown, setCountdown] = useState<number>(0);
  const { mutate } = useSubmitAnswerMutation(getDataSource());

  const onFinish = (values: { [k: string]: string }) => {
    mutate({
      input: {
        questionId: questions[questionNo]._id,
        answer: values[questions[questionNo]._id],
        time: countdown - Date.now(),
      },
    });
    if (questionNo === 7) {
      setCountdown(Date.now() + 1000 * 60 * 8);
      setQuestionNo(questionNo + 1);
    } else if (questionNo === questions.length - 1) {
      router.push("5");
    } else {
      setQuestionNo(questionNo + 1);
      setMenu(questions[questionNo + 1].menuId);
    }
  };

  return (
    <Card className="shadow px-20 py-5" bodyStyle={{ minHeight: "80vh" }}>
      {stage === Stage.Intro ? (
        <Intro
          {...intro}
          onClick={() => {
            setStage(Stage.Main);
            setCountdown(Date.now() + 1000 * 60 * 8);
          }}
        />
      ) : (
        <>
          <Title level={5}>{intro.title}</Title>
          <Menu
            className="mb-10"
            selectedKeys={[menu]}
            mode="horizontal"
            items={items}
          />
          <div className="flex justify-end mt-4 h-10 text-2xl">
            倒计时
            <Countdown
              value={countdown}
              format="m:ss"
              className="float-right leading-8"
              onFinish={() => {
                if (questionNo <= 7) {
                  setCountdown(Date.now() + 1000 * 60 * 8);
                  setQuestionNo(8);
                } else {
                  router.push("5");
                }
              }}
            />
          </div>
          <RadioForm question={questions[questionNo]} onFinish={onFinish} />
        </>
      )}
    </Card>
  );
}

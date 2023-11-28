import { useRouter } from "next/router";
import { useSubmitAnswerMutation } from "@/graphql/generated/graphql";
import { getDataSource } from "@/graphql/queryClient";
import { Card, Menu, MenuProps, Typography } from "antd";
import { useContext, useEffect, useState } from "react";
import questions from "./index.json";
import Intro from "@/components/Intro";
import RadioForm from "@/components/RadioForm";
import Countdown from "antd/lib/statistic/Countdown";
import { MenuContext } from "@/hooks/MenuContext";

const { Title } = Typography;

const intro = {
  title: "十二、美术能力",
  description:
    "美术能力是指一个人在视觉艺术领域的技能和才能。美术能力不仅包括绘画和绘图的技能，还包括对颜色、形状、纹理等视觉元素的理解，以及能够用艺术媒介表达思想和情感的能力。",
  prompt:
    "测试提示：美术能力测验通过线段的宽窄和实图大小2个部分来衡量，限时8分钟，共10题，答对一题得一分，答错不计分。接下来，开始测试。",
};

const items: MenuProps["items"] = [
  {
    label: "1. 线段长短估计",
    key: "1",
  },
  {
    label: "2. 实物估计",
    key: "2",
  },
];

enum Stage {
  Intro,
  Main,
}

export default function Section12() {
  const router = useRouter();
  const [questionNo, setQuestionNo] = useState(0);
  const [stage, setStage] = useState(Stage.Intro);
  const [countdown, setCountdown] = useState<number>(0);
  const { mutate } = useSubmitAnswerMutation(getDataSource());

  const { setMenu } = useContext(MenuContext);

  useEffect(() => setMenu("12"), []);

  const onFinish = (values: { [k: string]: string }) => {
    const questionId = questions[questionNo]._id;
    const currentTime = performance.now();
    mutate({
      input: {
        questionId,
        answer: values[questionId],
      },
    });
    if (questionNo === questions.length - 1) {
      router.push("13");
    } else {
      setQuestionNo(questionNo + 1);
      setMenu(questions[questionNo + 1].menuId);
    }
  };

  return (
    <>
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
          <div className="flex justify-end text-xl">
            倒计时
            <Countdown
              value={countdown}
              format="m:ss"
              className="float-right leading-8 !text-xl"
              onFinish={() => {
                router.push("13");
              }}
            />
          </div>
          <RadioForm question={questions[questionNo]} onFinish={onFinish} />
        </>
      )}
    </>
  );
}

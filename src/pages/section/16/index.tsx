import { useRouter } from "next/router";
import { useSubmitAnswerMutation } from "@/graphql/generated/graphql";
import { getDataSource } from "@/graphql/queryClient";
import { Card, Menu, MenuProps, Typography } from "antd";
import { useState } from "react";
import questions from "./index.json";
import Intro from "@/components/Intro";
import RadioForm from "@/components/RadioForm";
import Countdown from "antd/lib/statistic/Countdown";

const { Title } = Typography;

export enum Stage {
  Intro,
  Intro1,
  Intro2,
  Main,
}

const items: MenuProps["items"] = [
  {
    label: "1. 人际交往礼仪",
    key: "1",
  },
  {
    label: "2. 人际关系能力",
    key: "2",
  },
];

const intro = {
  title: "十六、人际交往能力",
  description:
    "人际交往能力是指个体妥善处理组织内外关系的能力，包括与周围环境建立广泛联系、转化能力，以及正确处理上下左右关系的能力。",
  prompt:
    "测试提示：人际交往能力测验包括人际交往礼仪和人际关系能力2个模块，共18道单选题，限时16分钟内完成。",
};

const intro1 = {
  title: "（一）人际交往礼仪",
  description:
    "指导语：这是人际交往能力测验的第一段测验。<br />您将在电脑界面上回答一系列问题，屏幕只会呈现一道题，确认选项后将会自动进入下一题，右下角为答题卡，点击数字可进入相应题目。请尽力在8分钟内完成，8分钟后将直接入下一段测验。如果时间充裕，你也可以选择提交答题卡，提前进入下一段测验。<br />现在，请开始测验，按照界面上的指示进行作答。",
};

const intro2 = {
  title: "（二）人际关系能力",
  description:
    "指导语：这是人际交往能力测验的第二段测验。<br />您将在电脑界面上回答一系列问题，屏幕只会呈现一道题，确认选项后将会自动进入下一题，右下角为答题卡，点击数字可进入相应题目。在这一部分中，选项没有正误之分，请不要过多考虑，凭你的真实想法或感受选择。（如果是现实中出现过的情况，则选择自己当时的做法；如果是没有出现过的情况，则设想在该情况下自己最可能做出的决定）。<br />现在，请开始测验，按照界面上的指示进行作答。",
};

export default function Section16() {
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
    if (questionNo === 9) {
      setStage(Stage.Intro2);
      setQuestionNo(questionNo + 1);
      setMenu(questions[questionNo + 1].menuId);
    } else if (questionNo === questions.length - 1) {
      router.push("17");
    } else {
      setQuestionNo(questionNo + 1);
    }
  };

  return (
    <Card className="shadow px-20 py-5" bodyStyle={{ minHeight: "80vh" }}>
      {stage === Stage.Intro ? (
        <Intro
          {...intro}
          onClick={() => {
            setStage(Stage.Intro1);
            setCountdown(Date.now() + 1000 * 60 * 8);
          }}
        />
      ) : stage === Stage.Intro1 ? (
        <Intro
          {...intro1}
          onClick={() => {
            setStage(Stage.Main);
            setCountdown(Date.now() + 1000 * 60 * 8);
          }}
        />
      ) : stage === Stage.Intro2 ? (
        <Intro
          {...intro2}
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
                if (questionNo <= 9) {
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

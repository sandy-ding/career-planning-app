import { useRouter } from "next/router";
import { Card, Menu, MenuProps, Typography } from "antd";
import Intro from "@/components/Intro";
import { useSubmitAnswerMutation } from "@/graphql/generated/graphql";
import { getDataSource } from "@/graphql/queryClient";
import { useState } from "react";
import questions from "./index.json";
import RadioForm from "@/components/RadioForm";
import Countdown from "antd/lib/statistic/Countdown";

const { Title } = Typography;

const items: MenuProps["items"] = [
  {
    label: "1. 表格分析",
    key: "1",
  },
  {
    label: "2. 图形分析",
    key: "2",
  },
];

const intro = {
  title: "五、信息检索与归纳能力",
  description:
    "信息检索与归纳能力是指对给定的资料的全部或部分内容，观点或问题进行分析和归纳，多角度的思考资料内容，做出合理的推断或评价的能力。",
  prompt:
    "测试提示：信息检索与归纳能力测验包括表格分析和图形分析2个模块，每个模块限时8分钟，共10题。答对一题得一分，答错不计分。请您<strong>尽快</strong>做答。下面开始测试。",
};

const part1Intro = {
  title: "（一）表格分析",
  description:
    "这是信息检索与归纳能力测验的第一段测验。<br/>您将在电脑界面上回答一系列问题，屏幕只会呈现一道题，确认选项后将会自动进入下一题，右下角为答题卡，点击数字可进入相应题目。请尽力在8分钟内完成，8分钟后将直接入下一段测验。如果时间充裕，你也可以选择提交答题卡，提前进入下一段测验。<br/>现在，请开始测验，按照界面上的指示进行作答。",
};

const part2Intro = {
  title: "（二）图形分析",
  description:
    "这是信息检索与归纳能力的第二段测验。<br/>您将在电脑界面上回答一系列问题，屏幕只会呈现一道题，确认选项后将会自动进入下一题，右下角为答题卡，点击数字可进入相应题目。请尽力在8分钟内完成，8分钟后将直接入下一段测验。如果时间充裕，你也可以选择提交答题卡，提前进入下一段测验。<br/>现在，请开始测验，按照界面上的指示进行作答。",
};

enum Stage {
  Intro,
  Part1Intro,
  Part1Main,
  Part2Intro,
  Part2Main,
}

export default function Section5() {
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
    if (questionNo === 4) {
      setCountdown(Date.now() + 1000 * 60 * 8);
      setQuestionNo(questionNo + 1);
      setMenu("2");
      setStage(Stage.Part2Intro);
    } else if (questionNo === questions.length - 1) {
      router.push("6");
    } else {
      setQuestionNo(questionNo + 1);
    }
  };

  return (
    <Card className="shadow px-20 py-5" bodyStyle={{ minHeight: "80vh" }}>
      {stage === Stage.Intro && (
        <Intro
          {...intro}
          onClick={() => {
            setStage(Stage.Part1Intro);
          }}
        />
      )}
      {stage === Stage.Part1Intro && (
        <Intro
          {...part1Intro}
          onClick={() => {
            setStage(Stage.Part1Main);
            setCountdown(Date.now() + 1000 * 60 * 8);
          }}
        />
      )}
      {stage === Stage.Part2Intro && (
        <Intro
          {...part2Intro}
          onClick={() => {
            setStage(Stage.Part2Main);
            setCountdown(Date.now() + 1000 * 60 * 8);
          }}
        />
      )}
      {(stage === Stage.Part1Main || stage === Stage.Part2Main) && (
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
                if (questionNo <= 4) {
                  setCountdown(Date.now() + 1000 * 60 * 8);
                  setQuestionNo(5);
                } else {
                  router.push("6");
                }
              }}
            />
          </div>
          {stage === Stage.Part1Main ? (
            <div>
              根据下表，回答1—5题。
              <img
                src="https://carerer-planning.oss-cn-shanghai.aliyuncs.com/q103.png"
                className="block w-96 mt-4"
              />
            </div>
          ) : (
            <div>
              根据下表，回答6—10题。
              <img
                src="https://carerer-planning.oss-cn-shanghai.aliyuncs.com/q108.png"
                className="block w-96 mt-4"
              />
            </div>
          )}
          <RadioForm question={questions[questionNo]} onFinish={onFinish} />
        </>
      )}
    </Card>
  );
}

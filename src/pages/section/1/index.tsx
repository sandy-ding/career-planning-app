import { useRouter } from "next/router";
import { useSubmitAnswerMutation } from "@/graphql/generated/graphql";
import { getDataSource } from "@/graphql/queryClient";
import { Card, Typography, Menu, MenuProps } from "antd";
import { useState } from "react";
import questions from "./index.json";
import Intro from "@/components/Intro";
import RadioForm from "@/components/RadioForm";

const items: MenuProps["items"] = [
  {
    label: "1. 词汇理解",
    key: "1",
  },
  {
    label: "2. 句子理解",
    key: "2",
  },
  {
    label: "3. 语句填空",
    key: "3",
  },
  {
    label: "4. 语句排序",
    key: "4",
  },
  { label: "5. 语句续写", key: "5" },
];

const { Title } = Typography;

const intro = {
  title: "一、语言能力",
  description:
    "语言能力是对语言掌握的能力，包括言语理解和言语表达。言语理解强调对文字材料内涵的快速理解和把握，通过词汇理解和句子理解来衡量。言语表达强调语言文字的交流与运用，通过语句填空、语句排序和语句续写来衡量。",
  prompt:
    "测试提示：语言能力测验总计26道单项选择题，每道题只有一个最佳选项，答对一题得一分，答错不计分。接下来，开始语言能力测试。",
};

enum Stage {
  Intro,
  Main,
}

export default function Section1() {
  const router = useRouter();
  const [questionNo, setQuestionNo] = useState(0);
  const [stage, setStage] = useState(Stage.Intro);
  const [time, setTime] = useState(0);
  const [menu, setMenu] = useState("1");
  const { mutate } = useSubmitAnswerMutation(getDataSource());

  const onFinish = (values: { [k: string]: string }) => {
    const questionId = questions[questionNo]._id;
    const currentTime = performance.now();
    mutate({
      input: {
        questionId,
        answer: values[questionId],
        time: currentTime - time,
      },
    });
    if (questionNo === questions.length - 1) {
      router.push("2");
    } else {
      setQuestionNo(questionNo + 1);
      setMenu(questions[questionNo + 1].menuId);
      setTime(currentTime);
    }
  };

  return (
    <Card className="shadow px-20 py-5" bodyStyle={{ minHeight: "80vh" }}>
      {stage === Stage.Intro ? (
        <Intro
          {...intro}
          onClick={() => {
            setStage(Stage.Main);
            setTime(performance.now());
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
          <RadioForm question={questions[questionNo]} onFinish={onFinish} />
        </>
      )}
    </Card>
  );
}

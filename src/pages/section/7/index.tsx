import { useRouter } from "next/router";
import { useSubmitAnswerMutation } from "@/graphql/generated/graphql";
import { getDataSource } from "@/graphql/queryClient";
import { Card, Menu, MenuProps, Typography } from "antd";
import { useContext, useEffect, useState } from "react";
import questions from "./index.json";
import Intro from "@/components/Intro";
import RadioForm from "@/components/RadioForm";
import { MenuContext } from "@/hooks/MenuContext";

const { Title } = Typography;

const items: MenuProps["items"] = [
  {
    label: "1. 速度",
    key: "1",
  },
  {
    label: "2. 力和杠杆",
    key: "2",
  },
  {
    label: "3. 流体",
    key: "3",
  },
  {
    label: "4. 滑轮",
    key: "4",
  },
  {
    label: "5. 热力学",
    key: "5",
  },
  {
    label: "6. 电力",
    key: "6",
  },
  {
    label: "7. 齿轮",
    key: "7",
  },
  {
    label: "8. 车轮",
    key: "8",
  },
  {
    label: "9. 声学",
    key: "9",
  },
  {
    label: "10. 光学",
    key: "10",
  },
];

const intro = {
  title: "七、机械能力",
  description:
    "机械能力是对实际情境中的机械关系和物理定律的理解能力。它包括速度、力和杠杆、流体、滑轮、热力学、电力、齿轮、车轮、声学、光学这10个主题。机械能力强的人，擅长运用基本的物理知识解决现实生活中的问题。",
  prompt:
    "测试提示：本测验为单项选择题，每题只有一个最佳选项，每答对一题得一分，答错不计分。下面开始测试吧！",
};

enum Stage {
  Intro,
  Main,
}

export default function Section7() {
  const router = useRouter();
  const [questionNo, setQuestionNo] = useState(0);
  const [stage, setStage] = useState(Stage.Intro);
  const [time, setTime] = useState(0);
  const { mutate } = useSubmitAnswerMutation(getDataSource());
  const { setMenu } = useContext(MenuContext);

  useEffect(() => setMenu("7"), []);

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
      router.push("8");
    } else {
      setQuestionNo(questionNo + 1);
      setMenu(questions[questionNo + 1].menuId);
      setTime(currentTime);
    }
  };

  return (
    <>
      {stage === Stage.Intro ? (
        <Intro
          {...intro}
          onClick={() => {
            setStage(Stage.Main);
            setTime(performance.now());
          }}
        />
      ) : (
        <RadioForm question={questions[questionNo]} onFinish={onFinish} />
      )}
    </>
  );
}

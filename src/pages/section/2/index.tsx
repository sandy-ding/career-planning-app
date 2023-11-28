import { useRouter } from "next/router";
import { useSubmitAnswerMutation } from "@/graphql/generated/graphql";
import { getDataSource } from "@/graphql/queryClient";
import { useContext, useState } from "react";
import questions from "./index.json";
import Intro from "@/components/Intro";
import RadioForm from "@/components/RadioForm";
import Countdown from "antd/lib/statistic/Countdown";
import { MenuContext } from "@/hooks/MenuContext";

const intro = {
  title: "二、逻辑推理能力",
  description:
    "逻辑推理能力是指对各种事物关系的分析推理能力，涉及对图形和文字材料的理解、比较、演绎和归纳等，包括形象/具体推理（图形推理）和抽象推理（言语推理）两大类。",
  prompt:
    "测试提示：逻辑推理测验共计20道单项选择题，每题只有一个最佳选项，答对一题得一分，答错不计分。请您<strong>尽快</strong>做出回答。下面开始测试。",
};

enum Stage {
  Intro,
  Main,
}

export default function Section2() {
  const router = useRouter();
  const [stage, setStage] = useState(Stage.Intro);
  const [countdown, setCountdown] = useState<number>(0);
  const [questionNo, setQuestionNo] = useState(0);
  const { mutate } = useSubmitAnswerMutation(getDataSource());
  const { setMenu } = useContext(MenuContext);

  const onFinish = (values: { [k: string]: string }) => {
    const questionId = questions[questionNo]._id;
    mutate({
      input: {
        questionId,
        answer: values[questionId],
        time: countdown - Date.now(),
      },
    });
    if (questionNo === questions.length - 1) {
      router.push("3");
      setMenu("3");
    } else {
      setQuestionNo(questionNo + 1);
      setMenu(questions[questionNo + 1].menuId);
    }
  };

  return stage === Stage.Intro ? (
    <Intro
      {...intro}
      onClick={() => {
        setStage(Stage.Main);
        setCountdown(Date.now() + 1000 * 60 * 30);
        setMenu(questions[questionNo].menuId);
      }}
    />
  ) : (
    <>
      <div className="flex justify-end mt-4 h-10 !text-xl">
        倒计时
        <Countdown
          value={countdown}
          format="m:ss"
          className="float-right leading-8 !text-xl"
          onFinish={() => {
            router.push("3");
          }}
        />
      </div>
      <RadioForm question={questions[questionNo]} onFinish={onFinish} />
    </>
  );
}

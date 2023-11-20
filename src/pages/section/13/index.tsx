import { useRouter } from "next/router";
import { useSubmitAnswerMutation } from "@/graphql/generated/graphql";
import { getDataSource } from "@/graphql/queryClient";
import { Card, Typography } from "antd";
import { useState } from "react";
import questions from "./index.json";
import Intro from "@/components/Intro";
import RadioForm from "@/components/RadioForm";

const { Title } = Typography;

const intro = {
  title: "十三、音乐能力",
  description:
    "音乐能力指的是个人感受、辨别、记忆、表达音乐的能力，表现为个人对节奏、音调、音色和旋律的敏感以及通过作曲、演奏、歌唱等形式来表达自己的思想或情感。",
  prompt:
    "测试提示：音乐测验从3个方面测查音乐能力：I音乐欣赏力；Ⅱ音乐技能；Ⅲ音乐节奏感。共计30题。请按照自身实际情况选择最符合自己描述的一个选项。下面开始正式测试。",
};

const subtitles = [
  "I部分：请从下面每题的3个备选答案中选择最适合你的答案。",
  "Ⅱ部分：请考虑下面1O个问题，回答“是”或“否”。",
  "Ⅲ部分：对21—25题，请回答“是”或“否”；对26－30题，请从所给的三个备选答案中选择最适合的答案。",
];

enum Stage {
  Intro,
  Main,
}

export default function Section13() {
  const router = useRouter();
  const [questionNo, setQuestionNo] = useState(0);
  const [stage, setStage] = useState(Stage.Intro);
  const { mutate } = useSubmitAnswerMutation(getDataSource());

  const onFinish = (values: { [k: string]: string }) => {
    const questionId = questions[questionNo]._id;
    mutate({
      input: {
        questionId,
        answer: values[questionId],
      },
    });
    if (questionNo === questions.length - 1) {
      router.push("14");
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
            setStage(Stage.Main);
          }}
        />
      ) : (
        <>
          <Title level={3}>十三、音乐能力</Title>
          <Title level={5}>{subtitles[Math.floor(questionNo / 10)]}</Title>
          <RadioForm question={questions[questionNo]} onFinish={onFinish} />
        </>
      )}
    </Card>
  );
}

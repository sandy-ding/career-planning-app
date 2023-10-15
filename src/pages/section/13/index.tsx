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

enum Stage {
  Intro,
  Main,
}

export default function Section1() {
  const router = useRouter();
  const [questionNo, setQuestionNo] = useState(0);
  const [stage, setStage] = useState(Stage.Intro);
  const [time, setTime] = useState(0);
  const { mutate } = useSubmitAnswerMutation(getDataSource());

  const onFinish = (values: { [k: string]: string }) => {
    const questionId = questions[questionNo]._id;
    console.log("Success:", values, values[questionId]);
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
          <Title level={5}>{questions[questionNo].category2}</Title>
          <RadioForm question={questions[questionNo]} onFinish={onFinish} />
        </>
      )}
    </Card>
  );
}

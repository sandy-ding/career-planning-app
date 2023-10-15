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
  title: "十、内省能力",
  description:
    "内省智力是指个体认识、洞察和反省自身的能力。在这方面得分高，意味着你能较好地意识和评价自己的动机、情绪、个性等，并且有意识地运用这些信息去调适自己生活的能力。",
  prompt:
    "测试提示：内省测验包括认知、洞察、反省三部分，共15题。请按照自身实际情况选择最符合自己描述的一个选项。下面开始正式测试。",
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

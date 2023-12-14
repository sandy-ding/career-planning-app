import { useRouter } from "next/router";
import { useSubmitAnswerMutation } from "@/graphql/generated/graphql";
import { getDataSource } from "@/graphql/queryClient";
import { useContext, useEffect, useState } from "react";
import questions from "./index.json";
import Intro from "@/components/Intro";
import RadioForm from "@/components/RadioForm";
import { MenuContext } from "@/hooks/MenuContext";

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

export default function Section10() {
  const router = useRouter();
  const [questionNo, setQuestionNo] = useState(0);
  const [stage, setStage] = useState(Stage.Intro);
  const { mutate } = useSubmitAnswerMutation(getDataSource());
  const { setMenu } = useContext(MenuContext);

  useEffect(() => setMenu("10"), []);

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
      router.push("12");
    } else {
      setQuestionNo(questionNo + 1);
    }
  };

  return stage === Stage.Intro ? (
    <Intro
      {...intro}
      onClick={() => {
        setStage(Stage.Main);
      }}
    />
  ) : (
    <RadioForm question={questions[questionNo]} onFinish={onFinish} />
  );
}

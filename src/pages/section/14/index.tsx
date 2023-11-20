import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSubmitAnswerMutation } from "@/graphql/generated/graphql";
import { getDataSource } from "@/graphql/queryClient";
import { Card, Form, Menu, MenuProps } from "antd";
import questions from "./index.json";
import Intro from "@/components/Intro";
import RadioForm from "@/components/RadioForm";

const intro = {
  title: "十四、思维转换能力",
  description:
    "思维转换能力指不同表达方式的快速理解和转换能力，如文字转换为对应图片或图片转换为对应文字的能力。思维转换能力越强，思维活动的灵活性越强。",
  prompt:
    "测试提示：思维转换能力测验包括图片转换为对应文字和文字转换为对应图片2模块，共20题。",
};

const intro1 = {
  title: "（一）图片转换为对应文字",
  description:
    "指导语：这是思维转换能力的第一段测验。<br />你将在电脑界面上回答一系列问题，屏幕上只会呈现一道题。请你根据呈现的图片，尽可能快地判断图片与给出的语句是否一致。如果一致请按T键，如果不一致请按F键。<br />现在，请开始测验。",
};

const intro2 = {
  title: "（二）文字转换为对应图片",
  description:
    "指导语：这是思维转换能力的第二段测验。<br />你将在电脑界面上回答一系列问题，屏幕上只会呈现一道题。请你根据题目呈现的文字，尽可能快地选择出与文字相对应的图片。<br />现在，请开始测验。",
};

const items: MenuProps["items"] = [
  {
    label: "1. 图片转换为对应文字",
    key: "1",
  },
  {
    label: "2. 文字转换为对应图片",
    key: "2",
  },
];

export enum Stage {
  Intro,
  Intro1,
  Intro2,
  Part1,
  Part2,
}

export default function Section14() {
  const router = useRouter();
  const [menu, setMenu] = useState("1");
  const [questionNo, setQuestionNo] = useState(0);
  const [stage, setStage] = useState(Stage.Intro);
  const [time, setTime] = useState<number>(0);
  const { mutate } = useSubmitAnswerMutation(getDataSource());
  const question = questions[questionNo];

  const onFinish = (values: { [k: string]: string }) => {
    const answer = values[questions[questionNo]._id];
    mutate({
      input: {
        answer,
        questionId: questions[questionNo]._id,
        isCorrect: answer === question.answer,
        time: Date.now() - time,
      },
    });
    if (questionNo === questions.length - 1) {
      router.push("15");
    } else {
      setQuestionNo(questionNo + 1);
    }
  };

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const key = e.key.toUpperCase();
      console.log({ key, questionNo, stage, answer: question.answer });
      if (stage === Stage.Part1) {
        if (key == "T" || key == "F") {
          if (stage === Stage.Part1) {
            mutate({
              input: {
                questionId: question._id,
                answer: key,
                isCorrect: key === question.answer,
                time: Date.now() - time,
              },
            });
            if (questionNo === 9) {
              setStage(Stage.Intro2);
              setMenu("2");
            }
            setQuestionNo(questionNo + 1);
            setTime(Date.now());
          }
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return function cleanup() {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [stage, questionNo]);

  return (
    <Card className="shadow px-20 py-5" bodyStyle={{ minHeight: "80vh" }}>
      {stage === Stage.Intro ? (
        <Intro
          {...intro}
          onClick={() => {
            setStage(Stage.Intro1);
          }}
        />
      ) : (
        <>
          <Menu
            className="mb-10"
            selectedKeys={[menu]}
            mode="horizontal"
            items={items}
          />
          {stage === Stage.Intro1 ? (
            <Intro
              {...intro1}
              onClick={() => {
                setStage(Stage.Part1);
                setTime(Date.now());
              }}
            />
          ) : stage === Stage.Intro2 ? (
            <Intro
              {...intro2}
              onClick={() => {
                setStage(Stage.Part2);
                setTime(Date.now());
              }}
            />
          ) : stage === Stage.Part1 ? (
            <>
              <div>如果一致请按T键，如果不一致请按F键。</div>
              <Form
                name="basic"
                autoComplete="off"
                layout="vertical"
                requiredMark={false}
                className="flex flex-col justify-between h-full"
              >
                <Form.Item
                  label={<label className="contents">{question.label}</label>}
                >
                  <div className="flex justify-center items-center mt-20">
                    <img className="max-w-full" src={question.fileUrl} />
                  </div>
                </Form.Item>
              </Form>
            </>
          ) : (
            <RadioForm question={questions[questionNo]} onFinish={onFinish} />
          )}
        </>
      )}
    </Card>
  );
}

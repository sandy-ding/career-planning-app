import { useSubmitAnswerMutation } from "@/graphql/generated/graphql";
import { getDataSource } from "@/graphql/queryClient";
import { Button, Card, Form } from "antd";
import { useContext, useEffect, useRef, useState } from "react";
import Intro from "@/components/Intro";
import { ValidateStatus } from "antd/es/form/FormItem";
import { shuffle } from "@/utils";
import { PlusOutlined } from "@ant-design/icons";
import sample from "./index.json";
import { useRouter } from "next/router";
import { MenuContext } from "@/hooks/MenuContext";

const charMap = {
  blue: "蓝",
  green: "绿",
  red: "红",
};

const testQuestions = shuffle(sample);
const mainQuestions = shuffle(sample.map((i) => new Array(1).fill(i)).flat());

const intro = {
  title: "十五、控制抑制能力",
  description:
    "抑制控制能力指个体在目标导向活动中有意识地抑制干扰或反应倾向的能力，与实际生活中对突发事件的应变能力密切相关。这种认知能力作为我们的执行职能之一，有助于预测，规划和目标设定，从而控制阻断行为并停止不适当的自动反应。控制抑制能力通过Stroop任务实验来衡量。",
};

const intro1 = {
  description:
    "指导语：欢迎参与控制抑制能力测验！<br />你将在屏幕正中央看到一个字母，分辨其颜色，颜色与字词含义一致按按“F”键，不一致按“J”键。在判断正确的前提下，反应越快越好。测试分练习和正式2部分，练习结束后点击“开始”按钮，进行正式测验。下面点击“练习”，开始练习吧。",
};

enum Stage {
  Intro,
  Intro1,
  Test,
  Mid,
  Main,
}

export default function Section15() {
  const [stage, setStage] = useState(Stage.Intro);
  const [answer, setAnswer] = useState<
    { answer: string; isCorrect: boolean; time: number }[]
  >([]);
  const [testNo, setTestNo] = useState(-1);
  const [showCenter, setShowCenter] = useState(false);
  const [showWord, setShowWord] = useState(false);

  const [answerTime, setAnswerTime] = useState(false);
  const [time, setTime] = useState(0);
  const isTest = stage === Stage.Test;
  const questions = isTest ? testQuestions : mainQuestions;

  const testNoRef = useRef(testNo);
  testNoRef.current = testNo;
  const router = useRouter();

  const { setMenu } = useContext(MenuContext);
  useEffect(() => setMenu("15"), []);

  const [validateStatus, setValidateStatus] =
    useState<ValidateStatus>("success");
  const [help, setHelp] = useState("");

  const { mutate } = useSubmitAnswerMutation(getDataSource());
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const key = e.key.toUpperCase();
      if (answerTime && testNo < questions.length) {
        if (key === "F" || key === "J") {
          const isCorrect =
            (questions[testNo].color === questions[testNo].char &&
              key === "F") ||
            (questions[testNo].color !== questions[testNo].char && key === "J");
          if (stage === Stage.Test) {
            if (isCorrect) {
              setValidateStatus("success");
              setHelp("回答正确");
            } else {
              setValidateStatus("error");
              setHelp("回答错误");
            }

            setTimeout(() => {
              setHelp("");
              setAnswerTime(false);
              setTimeout(() => {
                startTest();
              }, 500);
            }, 400);
          } else if (stage === Stage.Main) {
            setAnswer([
              ...answer,
              {
                answer: key,
                isCorrect,
                time: Date.now() - time,
              },
            ]);

            if (testNo === mainQuestions.length - 1) {
              mutate({
                input: {
                  questionId: "218",
                  answer: JSON.stringify([
                    ...answer,
                    {
                      answer: key,
                      isCorrect,
                      time: Date.now() - time,
                    },
                  ]),
                },
              });
              router.push("16");
            } else {
              setAnswerTime(false);
              setTimeout(() => {
                startTest();
              }, 500);
            }
          }
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return function cleanup() {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [answerTime]);

  const startTest = () => {
    setAnswerTime(false);
    if (testNo !== testQuestions.length - 1) {
      setShowCenter(true);
    }
    setTimeout(() => {
      if (stage === Stage.Test && testNo === testQuestions.length - 1) {
        setStage(Stage.Mid);
        setTestNo(-1);
      } else {
        setTestNo(testNo + 1);
      }
      setShowCenter(false);
      setAnswerTime(true);
      setShowWord(true);
      setTimeout(
        (thisTestNo) => {
          if (thisTestNo === testNoRef.current) {
            setShowWord(false);
          }
        },
        isTest ? 1000 : 2000,
        testNo + 1
      );
      setTime(Date.now());
    }, 800);
  };

  return (
    <>
      {stage === Stage.Intro ? (
        <Intro
          {...intro}
          onClick={() => {
            setStage(Stage.Intro1);
          }}
        />
      ) : stage === Stage.Intro1 ? (
        <Intro
          {...intro1}
          btnText="练习"
          onClick={() => {
            setStage(Stage.Test);
            startTest();
          }}
        />
      ) : (
        <Form
          name="basic"
          autoComplete="off"
          layout="vertical"
          requiredMark={false}
          className="flex flex-col justify-between h-full"
        >
          <Form.Item
            label={
              <label className="contents">
                {stage === Stage.Test && "练习题: "}
                请尽快判断字的颜色。颜色与字词含义一致按“F”键，不一致按“J”键。
              </label>
            }
            help={<div className="flex justify-center mt-4">{help}</div>}
            validateStatus={validateStatus}
          >
            {stage === Stage.Mid ? (
              <div className="mt-40 flex justify-center">
                <Button
                  type="primary"
                  size="large"
                  shape="round"
                  className="!px-16"
                  onClick={() => {
                    setStage(Stage.Main);
                    startTest();
                  }}
                >
                  开始测试
                </Button>
              </div>
            ) : (
              <div
                className="flex justify-center items-center mt-40 mx-auto w-40 h-40 text-6xl"
                style={{ background: "black" }}
              >
                {showCenter && (
                  <PlusOutlined
                    className="text-3xl flex justify-center items-center"
                    style={{ width: "116px", height: "124px", color: "white" }}
                  />
                )}
                {!showCenter && showWord && (
                  <div style={{ color: `${questions[testNo].color}` }}>
                    {charMap[questions[testNo].char as keyof typeof charMap]}
                  </div>
                )}
              </div>
            )}
          </Form.Item>
        </Form>
      )}
    </>
  );
}

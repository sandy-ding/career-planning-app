import { useRouter } from "next/router";
import { useSubmitAnswerMutation } from "@/graphql/generated/graphql";
import { getDataSource } from "@/graphql/queryClient";
import { useEffect, useState } from "react";
import Header from "@/components/Layout/Header";
import questions from "./index.json";
import Progress from "@/components/Progress";
import { Stage } from "@/types";
import Overview from "@/components/Overview";
import UnitEnd from "@/components/UnitEnd";
import { Form } from "antd";

const sectionNo = 1;
const unitNo = 14;
const partNo = 1;
const unitId = `${sectionNo}.${unitNo}`;
const partId = `${unitId}.${partNo}`;

const overview = {
  title: "图片转换为对应文字",
  description:
    "<strong>指导语</strong>：这是思维转换能力的第一段测验。<br /><br />你将在电脑界面上回答一系列问题，屏幕上只会呈现一道题。请你根据呈现的图片，尽可能快地判断图片与给出的语句是否一致。如果一致请按“F”键，如果不一致请按“J”键。<br /><br />现在，请开始测验。",
  audioUrl: "https://carerer-planning.oss-cn-shanghai.aliyuncs.com/1-14-1.mp3",
};

export default function Idex() {
  const router = useRouter();
  const [stage, setStage] = useState(Stage.Intro);
  const [questionIndex, setQuestionIndex] = useState(0);

  const [time, setTime] = useState(0);
  const question = questions[questionIndex];
  const questionId = `${partId}.${questionIndex + 1}`;

  const { mutate } = useSubmitAnswerMutation(getDataSource());

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const currentTime = Date.now();
      const key = e.key.toUpperCase();
      if (key == "F" || key == "J") {
        mutate({
          input: {
            questionId,
            answer: key,
            duration: currentTime - time,
          },
        });
        if (questionIndex === questions.length - 1) {
          setStage(Stage.End);
        }
        setQuestionIndex(questionIndex + 1);
        setTime(currentTime);
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return function cleanup() {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [time, questionIndex]);

  const onStart = async () => {
    setStage(Stage.Main);
    setTime(Date.now());
  };

  const onEnd = async () => {
    router.push(`${partNo + 1}`);
  };

  return (
    <div className="flex flex-col h-screen bg-primary-200">
      <Header title="思维转换能力" />
      {stage === Stage.Intro ? (
        <Overview {...overview} onClick={onStart} />
      ) : (
        <>
          <Progress
            currentIndex={0}
            currentPercent={questionIndex / questions.length}
            titles={["图片转换为对应文字", "文字转换为对应图片"]}
          />
          {stage === Stage.Main ? (
            <div className="grow flex gap-10 px-10 items-center bg-primary-200">
              <div className="grow w-3/5 h-[calc(100%-80px)] p-20 py-10 bg-white">
                <Form
                  name="basic"
                  autoComplete="off"
                  layout="vertical"
                  requiredMark={false}
                  className="flex flex-col justify-between h-full"
                >
                  <Form.Item
                    label={
                      <label className="w-full text-center">
                        {question.label}
                      </label>
                    }
                  >
                    <div className="flex justify-center items-center mt-20">
                      <img
                        className="max-w-full max-h-96 object-scale-down w-[400px]"
                        src={question.fileUrl}
                      />
                    </div>
                    <div className="text-center text-primary-700 mt-4">
                      一致按“F”键；不一致按“J”键。
                    </div>
                  </Form.Item>
                </Form>
              </div>
            </div>
          ) : (
            <UnitEnd goNext={onEnd} />
          )}
        </>
      )}
    </div>
  );
}

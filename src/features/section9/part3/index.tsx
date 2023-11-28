import React, { useState } from "react";
import Countdown from "antd/lib/statistic/Countdown";
import { useSubmitAnswerMutation } from "@/graphql/generated/graphql";
import { getDataSource } from "@/graphql/queryClient";
import Intro from "@/components/Intro";
import { Button, Form } from "antd";
import Puzzle from "@/components/Puzzle/Puzzle";

interface IProps {
  onFinish: () => void;
}

const intro = {
  title: "3. 目标拼图",
  description:
    "这是自然观察能力测验的第三段。<br/>接下来电脑屏幕上会呈现出一副完整的图片，请你仔细观察。之后图片将会被打乱顺序，请你尽可能快地将图片复原。请尽力在10分钟之内完成，10分钟后自动进入下一题。如果时间充裕，可以选择提交，提前进入下一测验。<br/>现在请先开始练习，练习完成后开始正式测验。",
};

enum Stage {
  Intro,
  Test,
  Mid,
  Main,
}

interface IProps {
  onFinish: () => void;
}

export default function Part3(props: IProps) {
  const [stage, setStage] = useState(Stage.Intro);
  const [questionNo, setQuestionNo] = useState(0);
  const [showImage, setShowImage] = useState(false);

  const [showButton, setShowButton] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [answer, setAnswer] = useState([]);

  const isTest = stage === Stage.Test;
  const { mutate } = useSubmitAnswerMutation(getDataSource());

  const onSubmit = () => {
    if (isTest) {
      setStage(Stage.Main);
      setCountdown(Date.now() + 1000 * 60 * 10 + 500);
    } else {
      mutate({
        input: {
          questionId: `${138 + questionNo}`,
          time: countdown - Date.now(),
          answer: JSON.stringify(answer),
        },
      });
    }
    if (questionNo !== 3) {
      setQuestionNo(questionNo + 1);
      startTest();
    } else {
      props.onFinish();
    }
  };

  const startTest = () => {
    setShowImage(true);
    setShowButton(false);
    setTimeout(() => {
      setShowImage(false);
    }, 500);
  };

  return stage === Stage.Intro ? (
    <Intro
      {...intro}
      onClick={() => {
        setStage(Stage.Test);
        startTest();
      }}
    />
  ) : (
    <>
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
              {isTest ? "练习题: " : `${questionNo}．`}
              请你尽可能快地将图片复原。
            </label>
          }
        >
          <div>
            {showImage ? (
              <div className="flex justify-center">
                <img
                  width={400}
                  height={400}
                  src={`https://carerer-planning.oss-cn-shanghai.aliyuncs.com/q139-${questionNo}.png`}
                />
              </div>
            ) : (
              <>
                {stage === Stage.Main && (
                  <div className="flex justify-end mt-4 text-xl">
                    <Countdown
                      value={countdown}
                      format="m:ss"
                      className="float-right !text-xl"
                      onFinish={() => {
                        mutate({
                          input: {
                            questionId: `${138 + questionNo}`,
                            time: countdown - Date.now(),
                            answer: JSON.stringify(answer),
                          },
                        });
                        props.onFinish();
                      }}
                    />
                  </div>
                )}
                <div className="flex flex-col items-center">
                  <Puzzle
                    image={`https://carerer-planning.oss-cn-shanghai.aliyuncs.com/q139-${questionNo}.png`}
                    width={400}
                    height={400}
                    pieces={questionNo === 3 ? 4 : 3}
                    onComplete={() => setShowButton(true)}
                    onDrop={setAnswer}
                  />
                  {showButton && (
                    <Button
                      type="primary"
                      size="large"
                      shape="round"
                      className="!px-16 mt-4"
                      onClick={onSubmit}
                    >
                      {isTest ? "开始测试" : "提交"}
                    </Button>
                  )}
                </div>
              </>
            )}
          </div>
        </Form.Item>
      </Form>
    </>
  );
}

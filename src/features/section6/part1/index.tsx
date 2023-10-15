import { useSubmitAnswerMutation } from "@/graphql/generated/graphql";
import { getDataSource } from "@/graphql/queryClient";
import { Button, Form } from "antd";
import { useEffect, useState } from "react";
import Intro from "@/components/Intro";
import { ValidateStatus } from "antd/es/form/FormItem";
import { shuffle } from "@/utils";
import { PlusOutlined } from "@ant-design/icons";

const testAngles = shuffle([0, 1, 2, 3, 4, 5].map((i) => i * 60));
const testDirections = shuffle([1, -1].map((i) => new Array(3).fill(i)).flat());
const angles = shuffle(
  [0, 1, 2, 3, 4, 5].map((i) => new Array(1).fill(i * 60)).flat()
);
const directions = shuffle([1, -1].map((i) => new Array(3).fill(i)).flat());

const intro = {
  title: "1. 二维空间旋转",
  description:
    "你将在屏幕正中央看到一个字母，请判断该字母是正向或或者反向。如果是正向，请按“F”键，如果是反向，请按“G”键。在判断正确的前提下，反应越快越好。测试分练习和正式2部分，练习结束后点击“开始”按钮，进行正式测验。下面点击“练习”，开始练习吧。",
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

export default function Part1(props: IProps) {
  const [stage, setStage] = useState(Stage.Intro);
  const [answer, setAnswer] = useState<
    { answer: string; isCorrect: boolean; time: number }[]
  >([]);
  const [testNo, setTestNo] = useState(-1);
  const [showCenter, setShowCenter] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [time, setTime] = useState(0);

  const [validateStatus, setValidateStatus] =
    useState<ValidateStatus>("success");
  const [help, setHelp] = useState("");

  const { mutate } = useSubmitAnswerMutation(getDataSource());
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const key = e.key.toUpperCase();
      if (showImage) {
        if (key == "F" || key == "G") {
          if (stage === Stage.Test) {
            if (
              (testDirections[testNo] < 0 && key === "G") ||
              (testDirections[testNo] > 0 && key === "F")
            ) {
              setValidateStatus("success");
              setHelp("回答正确");
            } else {
              setValidateStatus("error");
              setHelp("回答错误");
            }

            setTimeout(() => {
              setHelp("");
              setShowImage(false);
              startTest();
            }, 500);
          } else if (stage === Stage.Main) {
            setAnswer([
              ...answer,
              {
                answer: key,
                isCorrect:
                  (directions[testNo] < 0 && key === "G") ||
                  (directions[testNo] > 0 && key === "F"),
                time: Date.now() - time,
              },
            ]);

            if (testNo === directions.length - 1) {
              mutate({
                input: {
                  questionId: "113",
                  answer: JSON.stringify(answer),
                },
              });
              props.onFinish();
            }

            setTimeout(() => {
              startTest();
            }, 500);
          }
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return function cleanup() {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showImage]);

  const startTest = () => {
    setShowCenter(true);
    setShowImage(false);
    setTimeout(() => {
      if (stage === Stage.Test && testNo === testDirections.length - 1) {
        setStage(Stage.Mid);
        setTestNo(-1);
      } else {
        setTestNo(testNo + 1);
      }
      setShowCenter(false);
      setShowImage(true);
      setTime(Date.now());
    }, 1000);
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
        // onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
        requiredMark={false}
        className="flex flex-col justify-between h-full"
      >
        <Form.Item
          label={
            <label className="contents">
              {stage === Stage.Test && "练习题: "}
              请判断该字母是正向或或者反向。如果是正向，请按“F”键，如果是反向，请按“G”键。
            </label>
          }
          help={<div className="flex justify-center mt-4">{help}</div>}
          validateStatus={validateStatus}
        >
          {stage === Stage.Mid ? (
            <div className="mt-40 flex justify-center">
              <Button
                type="primary"
                onClick={() => {
                  setStage(Stage.Main);
                  startTest();
                }}
              >
                开始测试
              </Button>
            </div>
          ) : (
            <div className="flex justify-center items-center mt-40">
              {showCenter && (
                <PlusOutlined
                  className="text-3xl flex justify-center items-center"
                  style={{ width: "116px", height: "124px" }}
                />
              )}
              {showImage && (
                <img
                  src="https://carerer-planning.oss-cn-shanghai.aliyuncs.com/q113.png"
                  style={{
                    rotate: `${
                      stage === Stage.Test ? testAngles[testNo] : angles[testNo]
                    }deg`,
                    transform: `scaleX(${
                      stage === Stage.Test
                        ? testDirections[testNo]
                        : directions[testNo]
                    })`,
                  }}
                />
              )}
            </div>
          )}
        </Form.Item>
      </Form>
    </>
  );
}

import { useRouter } from "next/router";
import { useSubmitAnswerMutation } from "@/graphql/generated/graphql";
import { getDataSource } from "@/graphql/queryClient";
import { useEffect, useState } from "react";
import Header from "@/components/Layout/Header";
import Progress from "@/components/Progress";
import Overview from "@/components/Overview";
import UnitEnd from "@/components/UnitEnd";
import { Button, Form } from "antd";
import { ValidateStatus } from "antd/es/form/FormItem";
import { PlusOutlined } from "@ant-design/icons";

const partNo = 1;
const unitId = "F";
const partId = `${unitId}${partNo}`;

const overview = {
  title: "二维空间旋转",
  description:
    "<strong>指导语</strong>：你将在屏幕正中央看到一个字母，请判断该字母是正向或或者反向。如果是正向，请按“F”键，如果是反向，请按“J”键。在判断正确的前提下，反应越快越好。测试分练习和正式2部分，练习结束后点击“开始”按钮，进行正式测验。下面点击“练习”，开始练习吧。",
  audioUrl: "https://carerer-planning.oss-cn-shanghai.aliyuncs.com/1-6-1.mp3",
};

// const testAngles = shuffle([0, 1, 2, 3, 4, 5].map((i) => i * 60));
// const testDirections = shuffle([1, -1].map((i) => new Array(3).fill(i)).flat());
// const angles = shuffle(
//   [0, 1, 2, 3, 4, 5].map((i) => new Array(12).fill(i * 60)).flat()
// );
// const directions = shuffle([1, -1].map((i) => new Array(36).fill(i)).flat());

const testAngles = [60, 120, 180, 300, 0, 240];
const testDirections = [1, 1, -1, -1, 1, -1];
const angles = [
  300, 300, 240, 60, 180, 180, 0, 240, 0, 60, 60, 240, 180, 0, 240, 120, 300,
  120, 60, 180, 300, 180, 300, 0, 0, 120, 180, 120, 180, 300, 300, 0, 180, 0, 0,
  120, 60, 120, 180, 300, 240, 120, 240, 60, 240, 60, 60, 300, 120, 240, 240,
  120, 300, 60, 240, 60, 240, 180, 300, 0, 0, 120, 0, 0, 180, 60, 300, 120, 120,
  180, 240, 60,
];
const directions = [
  1, 1, -1, 1, -1, -1, -1, -1, -1, 1, 1, -1, -1, 1, 1, 1, -1, 1, -1, -1, -1, 1,
  -1, 1, -1, 1, 1, 1, 1, -1, -1, -1, 1, 1, 1, 1, -1, 1, 1, -1, -1, 1, 1, 1, 1,
  -1, -1, 1, -1, -1, 1, -1, -1, -1, 1, -1, 1, 1, 1, -1, 1, -1, -1, 1, 1, 1, -1,
  1, -1, -1, -1, -1,
];

enum Stage {
  Intro,
  Test,
  Mid,
  Main,
  End,
}

export default function Idex() {
  const router = useRouter();
  const [stage, setStage] = useState(Stage.Intro);
  const [testNo, setTestNo] = useState(-1);
  const [showCenter, setShowCenter] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [time, setTime] = useState(0);
  const questionId = `${partId}.${testNo + 1}`;

  const [validateStatus, setValidateStatus] =
    useState<ValidateStatus>("success");
  const [help, setHelp] = useState("");

  const { mutate } = useSubmitAnswerMutation(getDataSource());
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const key = e.key.toUpperCase();
      if (showImage) {
        if (key == "F" || key == "J") {
          if (stage === Stage.Test) {
            if (
              (testDirections[testNo] < 0 && key === "J") ||
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
            mutate({
              input: {
                questionId,
                answer: key,
                isCorrect:
                  (directions[testNo] < 0 && key === "J") ||
                  (directions[testNo] > 0 && key === "F"),
                duration: Date.now() - time,
              },
            });

            if (testNo === directions.length - 1) {
              setStage(Stage.End);
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

  const onStart = async () => {
    setStage(Stage.Test);
    startTest();
  };

  const onEnd = async () => {
    router.push(`${partNo + 1}`);
  };

  return (
    <div className="flex flex-col h-screen bg-primary-200">
      <Header title="空间能力" />
      {stage === Stage.Intro ? (
        <Overview {...overview} btnText="练习" onClick={onStart} />
      ) : (
        <>
          <Progress
            currentIndex={0}
            currentPercent={
              stage === Stage.Test ? 0 : stage === Stage.End ? 1 : testNo / 78
            }
            titles={["二维空间旋转", "三维空间旋转", "空间想象"]}
          />
          {stage !== Stage.End ? (
            <div className="grow flex gap-10 px-10 items-center bg-primary-200">
              <div className="grow w-3/5 h-[calc(100%-80px)] p-20 py-10 bg-white">
                <Form
                  name="basic"
                  autoComplete="off"
                  layout="vertical"
                  requiredMark={false}
                  className="flex flex-col justify-between h-96"
                >
                  <Form.Item
                    label={
                      <label className="w-full text-center">
                        {stage === Stage.Test && "练习题: "}
                        请判断该字母是正向或或者反向。
                      </label>
                    }
                    help={
                      <div className="flex justify-center mt-4">{help}</div>
                    }
                    validateStatus={validateStatus}
                  >
                    {stage === Stage.Mid ? (
                      <div className="mt-40">
                        <div className="text-center text-primary-700">
                          现在你将进入正式测验，点击“开始测验”按钮开始吧！
                        </div>
                        <div className="mt-40 flex justify-center">
                          <Button
                            size="large"
                            shape="round"
                            onClick={() => {
                              setStage(Stage.Main);
                              startTest();
                            }}
                          >
                            开始测试
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-center items-center mt-40">
                          {showCenter && (
                            <PlusOutlined
                              className="text-3xl flex justify-center items-center"
                              style={{ width: "116px", height: "124px" }}
                            />
                          )}
                          {showImage && (
                            <img
                              src="https://career-planning-app.oss-cn-beijing.aliyuncs.com/1-6-1.png"
                              style={{
                                rotate: `${
                                  stage === Stage.Test
                                    ? testAngles[testNo]
                                    : angles[testNo]
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
                      </>
                    )}
                  </Form.Item>
                </Form>
                {stage !== Stage.Mid && (
                  <div className="w-full text-primary-700 text-center text-[22px]">
                    正向按“F”键，反向按“J”键。
                  </div>
                )}
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

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
import BigCountdown from "@/components/BigCountdown";

enum Stage {
  Intro,
  Test,
  Mid,
  Main,
  End,
}

enum Light {
  Red,
  Green,
  Off,
}

const partNo = 1;
const unitId = "H";
const partId = `${unitId}${partNo}`;

const overview = {
  title: "辨别反应时",
  description:
    "<strong>指导语</strong>：这是信息加工能力测验的第一段测验。<br /><br />接下来电脑界面上将呈现出红绿灯的图片，请你根据图片的指示尽可能快地做出按键反应。如果红灯亮起，请按“F”键；如果绿灯亮起，请按“J”键。<br /><br />现在，请先进行练习测验，练习完成后开始正式测验。",
  audioUrl: "https://career-planning-app.oss-cn-beijing.aliyuncs.com/1-8-1.mp3",
};

const testLights = [0, 1, 0, 0, 1, 0];
const lights = [0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 1, 0, 0, 1, 0];

export default function Index() {
  const router = useRouter();
  const [stage, setStage] = useState(Stage.Intro);
  const [time, setTime] = useState(0);
  const [countdown, setCountdown] = useState<number>(0);

  const [testNo, setTestNo] = useState(0);
  const questionId = `${partId}.${testNo}`;
  const [showLight, setShowLight] = useState(Light.Off);

  const [validateStatus, setValidateStatus] =
    useState<ValidateStatus>("success");
  const [help, setHelp] = useState("");

  const { mutate } = useSubmitAnswerMutation(getDataSource());

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const key = e.key.toUpperCase();
      if (showLight !== Light.Off) {
        if (key == "F" || key == "J") {
          const isCorrect =
            (showLight === Light.Red && key === "F") ||
            (showLight === Light.Green && key === "J");
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
              startTest();
            }, 500);
          } else if (stage === Stage.Main) {
            mutate({
              input: {
                isCorrect,
                questionId,
                answer: key,
                duration: Date.now() - time,
              },
            });
            if (testNo === lights.length - 1) {
              setStage(Stage.End);
            }
            startTest();
          }
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return function cleanup() {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showLight]);

  let audio: HTMLAudioElement | undefined;
  if (typeof Audio != "undefined") {
    audio = new Audio(
      "https://career-planning-app.oss-cn-beijing.aliyuncs.com/countdown-321.mp3"
    );
  }

  const startTest = () => {
    setShowLight(Light.Off);
    if (stage === Stage.Test && testNo === testLights.length - 1) {
      setStage(Stage.Mid);
      setTestNo(0);
    } else {
      setTestNo(testNo + 1);
    }
    setTimeout(() => {
      setShowLight(stage === Stage.Test ? testLights[testNo] : lights[testNo]);
      setTime(Date.now());
    }, 500);
  };

  const onStart = () => {
    setStage(Stage.Test);
    setCountdown(Date.now() + 1000 * 4);
    audio?.play();
  };

  const onCountdownFinish = () => {
    setCountdown(0);
  };

  return (
    <div className="flex flex-col h-screen bg-primary-200">
      <Header title="信息加工能力" />
      {stage === Stage.Intro ? (
        <Overview {...overview} btnText="练习" onClick={onStart} />
      ) : (
        <>
          <Progress
            currentIndex={0}
            currentPercent={stage === Stage.Test ? 0 : testNo / lights.length}
            titles={["辨别反应时", "简单反应时", "匹配反应时"]}
          />
          {stage !== Stage.End ? (
            <div className="grow flex gap-10 px-10 items-center bg-primary-200">
              <div className="grow w-3/5 h-[calc(100%-80px)] p-20 py-10 bg-white">
                {countdown !== 0 ? (
                  <BigCountdown
                    countdown={countdown}
                    onFinish={onCountdownFinish}
                  />
                ) : (
                  <>
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
                            {stage === Stage.Test && "练习题"}
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
                              现在你将进入正式测验，点击“开始测试”按钮开始吧！
                            </div>
                            <div className="mt-40 flex justify-center">
                              <Button
                                size="large"
                                shape="round"
                                onClick={() => {
                                  setStage(Stage.Main);
                                  setCountdown(Date.now() + 1000 * 4);
                                  audio?.play();
                                }}
                              >
                                开始测试
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex justify-center items-center mt-20">
                            <img
                              src="https://carerer-planning.oss-cn-shanghai.aliyuncs.com/q132.png"
                              onLoad={startTest}
                            />
                            <div
                              className="w-10 h-10"
                              style={{
                                position: "relative",
                                borderRadius: "50%",
                                ...(showLight === Light.Off && {
                                  visibility: "hidden",
                                }),

                                ...(showLight === Light.Red && {
                                  left: "-208px",
                                  background: "#ff002a",
                                  boxShadow: "0px 0px 30px 30px #ff002a",
                                }),

                                ...(showLight === Light.Green && {
                                  left: "-98px",
                                  background: "#00ff44",
                                  boxShadow: "0px 0px 23px 23px #00ff44",
                                }),
                              }}
                            />
                          </div>
                        )}
                      </Form.Item>
                    </Form>
                    {stage !== Stage.Mid && (
                      <div className="w-full pt-10 text-primary-700 text-center text-[22px]">
                        红灯亮按“F”键；绿灯亮按“J”键。
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ) : (
            <UnitEnd goNext={() => router.push(`${partNo + 1}`)} />
          )}
        </>
      )}
    </div>
  );
}

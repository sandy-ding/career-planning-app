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
  On,
  Off,
}

const partNo = 2;
const unitId = "H";
const partId = `${unitId}${partNo}`;
const testCount = 5;
const count = 15;
const intervals = [1, 2, 1, 2, 3, 2, 1, 3, 2, 3, 1, 3, 1, 3, 2];

const overview = {
  title: "简单反应时",
  description:
    "<strong>指导语</strong>：这是信息加工能力测验的第二段测验。<br /><br />接下来电脑界面上将呈现一个灯泡，请在灯泡亮起时尽可能快地按下“G”键。<br /><br />现在，请先进行练习测验，练习完成后开始正式测验。",
  audioUrl: "https://career-planning-app.oss-cn-beijing.aliyuncs.com/1-8-2.mp3",
};

export default function Idex() {
  const router = useRouter();
  const [stage, setStage] = useState(Stage.Intro);
  const [testNo, setTestNo] = useState(0);
  const [showLight, setShowLight] = useState(Light.Off);
  const [time, setTime] = useState(0);
  const questionId = `${partId}.${testNo + 1}`;
  const [countdown, setCountdown] = useState<number>(0);

  const [validateStatus, setValidateStatus] =
    useState<ValidateStatus>("success");
  const [help, setHelp] = useState("");

  const { mutate } = useSubmitAnswerMutation(getDataSource());
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const key = e.key.toUpperCase();
      if (showLight === Light.On) {
        if (key == "G") {
          if (stage === Stage.Test) {
            setValidateStatus("success");
            setHelp(`用时${Date.now() - time}毫秒`);

            setTimeout(() => {
              setHelp("");
              startTest();
            }, 500);
          } else if (stage === Stage.Main) {
            mutate({
              input: {
                questionId,
                duration: Date.now() - time,
              },
            });
            if (testNo === count - 1) {
              setStage(Stage.End);
            } else {
              startTest();
            }
          }
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return function cleanup() {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showLight]);

  const startTest = () => {
    setShowLight(Light.Off);
    if (stage === Stage.Test && testNo === testCount) {
      setStage(Stage.Mid);
      setTestNo(-1);
    } else {
      setTestNo(testNo + 1);
    }
    setTimeout(() => {
      setShowLight(Light.On);
      setTime(Date.now());
    }, intervals[testNo] * 1000);
  };

  let audio: HTMLAudioElement | undefined;
  if (typeof Audio != "undefined") {
    audio = new Audio(
      "https://career-planning-app.oss-cn-beijing.aliyuncs.com/countdown-321.mp3"
    );
  }

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
            currentIndex={partNo - 1}
            currentPercent={
              stage === Stage.Test
                ? 0
                : stage === Stage.End
                ? 1
                : testNo / count
            }
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
                      className="flex flex-col justify-between"
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
                              className="w-80"
                              src="https://carerer-planning.oss-cn-shanghai.aliyuncs.com/q133.jpg"
                              onLoad={startTest}
                            />
                            <div
                              style={{
                                width: "5rem",
                                height: "5rem",
                                position: "relative",
                                borderRadius: "50%",
                                left: "-200px",
                                top: "-55px",
                                opacity: 0.7,
                                background: "#fff50a",
                                boxShadow: "#fff50a 0px 0px 75px 75px",
                                ...(showLight === Light.Off && {
                                  visibility: "hidden",
                                }),
                              }}
                            />
                          </div>
                        )}
                      </Form.Item>
                    </Form>
                    {stage !== Stage.Mid && (
                      <div className="w-full pt-10 text-primary-700 text-center text-[22px]">
                        请在灯泡亮起时尽可能快地按下“G”键。
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

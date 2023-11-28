import React, { useEffect, useState } from "react";
import { useSubmitAnswerMutation } from "@/graphql/generated/graphql";
import { getDataSource } from "@/graphql/queryClient";
import Intro from "@/components/Intro";
import { Button, Form } from "antd";
import { ValidateStatus } from "antd/es/form/FormItem";

interface IProps {
  onFinish: () => void;
}

const intro = {
  title: "2. 简单反应时",
  description:
    "这是信息加工能力测验的第二段测验。接下来电脑界面上将呈现一个灯泡，请在灯泡亮起时尽可能快地按下G键。现在，请先进行练习测验，练习完成后开始正式测验。",
};

enum Stage {
  Intro,
  Test,
  Mid,
  Main,
}

enum Light {
  On,
  Off,
}

interface IProps {
  onFinish: () => void;
}

export default function Part2(props: IProps) {
  const [stage, setStage] = useState(Stage.Intro);
  const [answer, setAnswer] = useState<{ time: number }[]>([]);
  const [testNo, setTestNo] = useState(0);
  const [showLight, setShowLight] = useState(Light.Off);
  const [time, setTime] = useState(0);

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
            setAnswer([
              ...answer,
              {
                time: Date.now() - time,
              },
            ]);

            if (testNo === 14) {
              mutate({
                input: {
                  questionId: "133",
                  answer: JSON.stringify(answer),
                },
              });
              props.onFinish();
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

  const startTest = () => {
    setShowLight(Light.Off);
    if (stage === Stage.Test && testNo === 5) {
      setStage(Stage.Mid);
      setTestNo(-1);
    } else {
      setTestNo(testNo + 1);
    }
    setTimeout(() => {
      setShowLight(Light.On);
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
              请在灯泡亮起时尽可能快地按下G键。
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
            <div className="flex justify-center items-center mt-20">
              <img
                className="w-80"
                src="https://carerer-planning.oss-cn-shanghai.aliyuncs.com/q133.jpg"
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
    </>
  );
}

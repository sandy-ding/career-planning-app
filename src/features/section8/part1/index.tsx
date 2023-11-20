import { useSubmitAnswerMutation } from "@/graphql/generated/graphql";
import { getDataSource } from "@/graphql/queryClient";
import { Button, Form } from "antd";
import { useEffect, useState } from "react";
import Intro from "@/components/Intro";
import { ValidateStatus } from "antd/es/form/FormItem";

const intro = {
  title: "1. 辨别反应时",
  description:
    "这是信息加工能力测验的第一段测验。接下来电脑界面上将呈现出红绿灯的图片，请你根据图片的指示尽可能快地做出按键反应。如果红灯亮起，请按D键；如果绿灯亮起，请按K键。现在，请先进行练习测验，练习完成后开始正式测验。",
};

enum Stage {
  Intro,
  Test,
  Mid,
  Main,
}

enum Light {
  Red,
  Green,
  Off,
}

interface IProps {
  onFinish: () => void;
}

export default function Part1(props: IProps) {
  const [stage, setStage] = useState(Stage.Intro);
  const [answer, setAnswer] = useState<
    { answer: string; isCorrect: boolean; time: number }[]
  >([]);
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
      if (showLight !== Light.Off) {
        if (key == "D" || key == "K") {
          if (stage === Stage.Test) {
            if (
              (showLight === Light.Red && key === "D") ||
              (showLight === Light.Green && key === "K")
            ) {
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
            setAnswer([
              ...answer,
              {
                answer: key,
                isCorrect:
                  (showLight === Light.Red && key === "D") ||
                  (showLight === Light.Green && key === "K"),
                time: Date.now() - time,
              },
            ]);

            if (testNo === 14) {
              mutate({
                input: {
                  questionId: "132",
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
      const light = Math.random() < 0.5 ? Light.Green : Light.Red;
      setShowLight(light);
      setTime(Date.now());
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
            如果红灯亮起，请按D键；如果绿灯亮起，请按K键。
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
          <div className="flex justify-center items-center mt-20">
            <img src="https://carerer-planning.oss-cn-shanghai.aliyuncs.com/q132.png" />
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
                  boxShadow: "0px 0px 25px 18px #ff002a",
                }),

                ...(showLight === Light.Green && {
                  left: "-98px",
                  background: "#00ff44",
                  boxShadow: "0px 0px 20px 20px #00ff44",
                }),
              }}
            />
          </div>
        )}
      </Form.Item>
    </Form>
  );
}

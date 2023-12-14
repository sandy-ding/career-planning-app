import { useSubmitAnswerMutation } from "@/graphql/generated/graphql";
import { getDataSource } from "@/graphql/queryClient";
import { Button, Form } from "antd";
import { ReactElement, useEffect, useState } from "react";
import Intro from "@/components/Intro";
import { ValidateStatus } from "antd/es/form/FormItem";
import classNames from "classnames";
import Countdown from "antd/lib/statistic/Countdown";
import { useRouter } from "next/router";

const questions = [
  {
    label:
      "ED \u00A0 \u00A0 5C \u00A0 \u00A0 AE \u00A0 \u00A0 Bb \u00A0 \u00A0 αA",
    question: [
      ["ED", "Cc", "D5", "dD", "β5"],
      ["bβ", "Aa", "EF", "CD", "βb"],
      ["5C", "Bb", "εE", "αA", "5c"],
      ["B5", "AB", "AE", "5A", "Aa"],
      ["CB", "ζc", "Bb", "Ef", "5ζ"],
    ],
    answer: "[[1,0,0,0,0],[0,0,0,0,0],[1,0,0,1,0],[0,0,1,0,0],[0,0,1,0,0]]",
  },
  {
    label:
      "ねぬ \u00A0 \u00A0 クク \u00A0 \u00A0 ッシ \u00A0 \u00A0 ぬね \u00A0 \u00A0 いこ",
    question: [
      ["ほも", "らら", "さわ", "つの", "スブ"],
      ["にす", "いこ", "けろ", "ホフ", "ねぬ"],
      ["ふな", "ルレ", "ッシ", "ナイ", "クケ"],
      ["チテ", "なは", "クク", "シナ", "らろ"],
      ["シシ", "リル", "ぬね", "ムヌ", "ホヌ"],
    ],
    answer: "[[0,0,0,0,0],[0,1,0,0,1],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0]]",
  },
  {
    label:
      "ΠΔ \u00A0 \u00A0 μω \u00A0 \u00A0 ΦΓ \u00A0 \u00A0 τθ \u00A0 \u00A0 νo",
    question: [
      ["φψ", "νo", "ρα", "Γγ", "υφ"],
      ["oν", "βτ", "ΠΔ", "σσ", "κγ"],
      ["μω", "ΦΓ", "ωε", "ΩΛ", "ιζ"],
      ["ηψ", "ψφ", "χΠ", "τθ", "ζλ"],
      ["σδ", "μη", "ζσ", "υφ", "νo"],
    ],
    answer: "[[0,0,0,0,0],[0,0,1,0,0],[1,1,0,0,0],[0,0,0,1,0],[0,0,0,0,1]]",
  },
];

const initialValue = [
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
];

const intro = {
  title: "3. 匹配反应时",
  description:
    "这是信息加工能力测验的第三段测验。接下来电脑界面上将呈现5×5排列的字符组合图片，请根据题目要求在图片中找出相应的5个字符组合，并用鼠标点击对应位置。选择完成后点击提交，确认后将进入下一题。",
  prompt: "现在，请开始测验。",
};

enum Stage {
  Intro,
  Main,
}

export default function Part3({ questionNo }: { questionNo: number }) {
  const router = useRouter();
  const question = questions[questionNo];
  const len = 5;
  let board: ReactElement[] = [];
  const { mutate } = useSubmitAnswerMutation(getDataSource());

  const [value, setValue] = useState<number[][]>([...initialValue]);
  const [stage, setStage] = useState<Stage>(Stage.Intro);
  const [countdown, setCountdown] = useState<number>(0);
  const [validateStatus, setValidateStatus] =
    useState<ValidateStatus>("success");
  const [help, setHelp] = useState("");

  for (let i = 0; i < len; i++) {
    const cols = [];
    for (let j = 0; j < len; j++) {
      cols.push(
        <div
          key={`${i},${j}`}
          className={classNames(
            "h-20 w-20 flex justify-center items-center",
            i === 0 && "border-t-1",
            i === len - 1 && "border-b-1",
            j === 0 && "border-l-1",
            j === len - 1 && "border-r-1",
            "border-none"
          )}
          onClick={() => {
            const v = [...value];
            v[i][j] = value[i][j] === 0 ? 1 : 0;
            setValue(v);
            if (help) setHelp("");
          }}
        >
          <div
            className={classNames(
              "flex justify-center items-center h-14 w-14 rounded-full cursor-pointer text-xl",
              value[i][j] === 1 && "bg-sky-400"
            )}
            style={{ width: "4rem", height: "4rem", cursor: "pointer" }}
          >
            {question.question[i][j]}
          </div>
        </div>
      );
    }
    board.push(
      <div className="flex" key={i}>
        {cols}
      </div>
    );
  }

  const onFinish = () => {
    const answerStr = JSON.stringify(value);
    if (answerStr === question.answer) {
      setValue([
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
      ]);
      mutate({
        input: {
          questionId: `${134 + questionNo}`,
          time: countdown - Date.now(),
          isCorrect: true,
        },
      });
      if (questionNo === 2) {
        router.push("/section1/unit9");
      } else {
        router.push(`${questionNo + 2}`);
      }
    } else {
      setHelp("回答错误");
      setValidateStatus("error");
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Form
      name="basic"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      layout="vertical"
      requiredMark={false}
      className="flex flex-col justify-between h-full"
    >
      <Form.Item
        label={
          <label className="contents" style={{ fontSize: "16px" }}>
            {`${questionNo + 1}`}. {question.label}
          </label>
        }
        help={<div className="flex justify-center mt-2">{help}</div>}
        validateStatus={validateStatus}
      >
        <div className="flex justify-end text-xl">
          倒计时
          <Countdown
            value={countdown}
            format="m:ss"
            className="float-right leading-8 !text-xl"
            onFinish={() => {
              mutate({
                input: {
                  questionId: `${134 + questionNo}`,
                  time: countdown - Date.now(),
                  isCorrect: JSON.stringify(value) === question.answer,
                },
              });
              router.push("10");
            }}
          />
        </div>
        <div className={classNames("flex justify-center mt-4")}>
          <div
            className="border-1 border-black border-solid"
            style={{ fontSize: "24px", border: "1px solid black" }}
          >
            {board}
          </div>
        </div>
      </Form.Item>

      <Form.Item className="flex justify-center">
        <Button htmlType="submit" size="large" shape="round">
          提交
        </Button>
      </Form.Item>
    </Form>
  );
}

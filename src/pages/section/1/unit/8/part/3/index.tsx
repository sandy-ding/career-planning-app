import { useRouter } from "next/router";
import {
  useAnswerQuery,
  useSubmitAnswerMutation,
} from "@/graphql/generated/graphql";
import { getDataSource } from "@/graphql/queryClient";
import { ReactElement, useState } from "react";
import Image from "next/image";
import Header from "@/components/Layout/Header";
import Progress from "@/components/Progress";
import Loading from "@/components/Loading";
import Overview from "@/components/Overview";
import UnitEnd from "@/components/UnitEnd";
import Countdown from "antd/lib/statistic/Countdown";
import { getCountdown } from "@/utils";
import { ValidateStatus } from "antd/lib/form/FormItem";
import classNames from "classnames";
import { Button, Form } from "antd";

const questions = [
  {
    label:
      "ED \u00A0 \u00A0 5C \u00A0 \u00A0 AE \u00A0 \u00A0 Bb \u00A0 \u00A0 αA",
    question: [
      ["ED", "Cc", "D5", "dD", "β5"],
      ["bβ", "Aa", "EF", "CD", "βb"],
      ["5C", "bB", "εE", "αA", "5c"],
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
      "ΠΔ \u00A0 \u00A0 ΦΓ \u00A0 \u00A0 νο \u00A0 \u00A0 μω \u00A0 \u00A0 τθ",
    question: [
      ["φψ", "vo", "ρα", "Γγ", "υφ"],
      ["oν", "βτ", "ΠΔ", "σσ", "κγ"],
      ["μω", "ΦΓ", "ωε", "ΩΛ", "ιζ"],
      ["ηψ", "ψφ", "χΠ", "τθ", "ξλ"],
      ["σδ", "μη", "ζσ", "υφ", "νο"],
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

const overview = {
  title: "匹配反应时",
  description:
    "<strong>指导语</strong>：这是信息加工能力测验的第三段测验。<br /><br />接下来电脑界面上将呈现5×5排列的字符组合图片，请根据题目要求在图片中找出相应的5个字符组合，并用鼠标点击对应位置。选择完成后点击提交，确认后将进入下一题。<br /><br />现在，请开始测验。",
  audioUrl: "https://carerer-planning.oss-cn-shanghai.aliyuncs.com/1-8-3.mp3",
};

const sectionNo = 1;
const unitNo = 8;
const partNo = 3;
const unitId = "H";
const partId = `${unitId}${partNo}`;
const countdownDuration = 1000 * 60 * 10;

enum Stage {
  Intro,
  Main,
  End,
}

export default function Index() {
  const router = useRouter();
  const [questionNo, setQuestionNo] = useState(0);
  const question = questions[questionNo];
  const len = 5;
  let board: ReactElement[] = [];
  const { mutateAsync } = useSubmitAnswerMutation(getDataSource());

  const [value, setValue] = useState<number[][]>([...initialValue]);
  const [stage, setStage] = useState<Stage>(Stage.Intro);
  const [time, setTime] = useState(Date.now());
  const [countdown, setCountdown] = useState<number>(0);
  const [validateStatus, setValidateStatus] =
    useState<ValidateStatus>("success");
  const [help, setHelp] = useState("");
  const questionId = `${partId}.${questionNo + 1}`;

  const dataSource = getDataSource();
  const { isLoading } = useAnswerQuery(
    dataSource,
    {
      questionId: partId,
    },
    {
      onSuccess(data) {
        if (data?.answer?.startTime) {
          setCountdown(data.answer?.startTime + countdownDuration);
        }
      },
    }
  );

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
    const currentTime = Date.now();
    const answerStr = JSON.stringify(value);
    setValue([
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ]);
    mutateAsync({
      input: {
        questionId,
        duration: currentTime - time,
        answer: answerStr,
      },
    });
    setTime(currentTime);
    if (questionNo === questions.length - 1) {
      setStage(Stage.End);
    } else {
      setQuestionNo(questionNo + 1);
    }
  };

  const onStart = async () => {
    const currentTime = Date.now();
    await mutateAsync({
      input: {
        questionId: partId,
        startTime: currentTime,
      },
    }).then((data) =>
      setCountdown(
        (data?.submitAnswer?.startTime || currentTime) + countdownDuration
      )
    );
    setTime(currentTime);
    setStage(Stage.Main);
  };

  return (
    <div className="flex flex-col h-screen bg-primary-200">
      <Header title="信息加工能力">
        <>
          {!isLoading &&
            (stage === Stage.End ? (
              <div className="leading-8 text-[28px]">
                {getCountdown(countdown - Date.now())}
              </div>
            ) : (
              !!countdown && (
                <Countdown
                  value={countdown}
                  format="m:ss"
                  className="leading-8"
                  onFinish={() => {
                    mutateAsync({
                      input: {
                        questionId,
                        duration: countdown - Date.now(),
                        isCorrect: JSON.stringify(value) === question.answer,
                      },
                    });
                    setStage(Stage.End);
                  }}
                />
              )
            ))}
        </>
        <Image src="/countdown.png" alt="user" width="32" height="32" />
      </Header>
      {isLoading ? (
        <Loading />
      ) : stage === Stage.Intro ? (
        <Overview {...overview} onClick={onStart} />
      ) : (
        <>
          <Progress
            currentIndex={partNo - 1}
            currentPercent={
              stage === Stage.Main ? questionNo / questions.length : 1
            }
            titles={["辨别反应时", "简单反应时", "匹配反应时"]}
          />
          {stage === Stage.Main ? (
            <div className="grow flex gap-10 px-10 items-center bg-primary-200">
              <div className="grow w-3/5 h-[calc(100%-80px)] p-20 py-10 bg-white">
                <Form
                  name="basic"
                  onFinish={onFinish}
                  autoComplete="off"
                  layout="vertical"
                  requiredMark={false}
                  className="flex flex-col justify-between h-full"
                >
                  <Form.Item
                    label={
                      <label className="block w-full text-center">
                        {`${questionNo + 1}`}. {question.label}
                      </label>
                    }
                    help={
                      <div className="flex justify-center mt-2">{help}</div>
                    }
                    validateStatus={validateStatus}
                  >
                    <div className={classNames("flex justify-center mt-8")}>
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
              </div>
            </div>
          ) : (
            <UnitEnd
              goNext={() =>
                router.push(`/section/${sectionNo}/unit/${unitNo + 1}`)
              }
            />
          )}
        </>
      )}
    </div>
  );
}

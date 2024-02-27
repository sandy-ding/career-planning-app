import { useRouter } from "next/router";
import { useSubmitAnswerMutation } from "@/graphql/generated/graphql";
import { getDataSource } from "@/graphql/queryClient";
import { ReactElement, useEffect, useState } from "react";
import Header from "@/components/Layout/Header";
import questions from "./index.json";
import Progress from "@/components/Progress";
import Overview from "@/components/Overview";
import UnitEnd from "@/components/UnitEnd";
import { Button, Form } from "antd";
import { ValidateStatus } from "antd/es/form/FormItem";
import classNames from "classnames";
import Countdown from "antd/lib/statistic/Countdown";
import Image from "next/image";

enum Stage {
  Intro,
  Mid,
  ReadDescription,
  ShowQuestion,
  WhiteScreen,
  AnswerQuestion,
  ShowCorrectAnswer,
  End,
}

const sectionNo = 1;
const unitNo = 3;
const partNo = 2;
const unitId = "C";
const partId = `${unitId}${partNo}`;

const overview = {
  title: "视觉矩阵测验",
  description:
    "<strong>指导语</strong>：接下来是视觉矩阵测验。在屏幕中央，将出现一个放有蓝色棋子的方格棋盘，这些棋子呈现5秒后会消失，请你留意这些棋子的位置，并在随后出现的空白棋盘上准确地指出这些棋子的位置。测试分练习和正式2部分，练习结束后点击“开始”按钮，进行正式测验。注意若连错3次测验即停止，以最后一次答对的棋子数量为最终得分。下面点击“练习”，开始练习吧。",
  audioUrl: "https://career-planning-app.oss-cn-beijing.aliyuncs.com/1-3-2.mp3",
};

export default function Index() {
  const router = useRouter();
  const [time, setTime] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const question = questions[questionIndex];
  const answer: number[][] = JSON.parse(question.answer);
  const len = answer[0].length;
  const { mutate } = useSubmitAnswerMutation(getDataSource());
  const questionId = `${partId}.${question.questionId}`;

  const [value, setValue] = useState<number[][]>(answer);
  const [numOfSubmission, setNumOfSubmission] = useState(0);
  const [stage, setStage] = useState<Stage>(Stage.Intro);
  const [countdown, setCountdown] = useState<number>();
  const [validateStatus, setValidateStatus] =
    useState<ValidateStatus>("success");
  const [help, setHelp] = useState("");
  const [goNext, setGoNext] = useState(false);

  let board: ReactElement[] = [];
  for (let i = 0; i < len; i++) {
    const cols = [];
    for (let j = 0; j < len; j++) {
      cols.push(
        <div
          key={`${i},${j}`}
          className={classNames(
            "border border-black border-solid h-20 w-20 flex justify-center items-center",
            i === 0 && "border-t-2",
            i === len - 1 && "border-b-2",
            j === 0 && "border-l-2",
            j === len - 1 && "border-r-2"
          )}
          onClick={() => {
            if (stage !== Stage.ShowQuestion) {
              const v = [...value];
              v[i][j] = value[i][j] === 0 ? 1 : 0;
              setValue(v);
              if (help) setHelp("");
            }
          }}
        >
          {Boolean(value?.[i]?.[j]) && (
            <div className="h-10 w-10 rounded-full bg-sky-400"></div>
          )}
        </div>
      );
    }
    board.push(
      <div className="flex" key={i}>
        {cols}
      </div>
    );
  }

  useEffect(() => {
    const answer = JSON.parse(question.answer);
    setValue(answer);
  }, [questionIndex]);

  const onFinish = async () => {
    const currentTime = Date.now();
    const answerStr = JSON.stringify(value);
    if (goNext) {
      setGoNext(false);
      setHelp("");
      setQuestionIndex(questionIndex + 1);
      setNumOfSubmission(0);
      if (questionIndex === 3) {
        setStage(Stage.Mid);
      } else {
        startTest();
      }
    } else if (question.isTest) {
      if (question.answer === answerStr) {
        setGoNext(true);
        setHelp("回答正确");
        setValidateStatus("success");
      } else {
        setGoNext(true);
        setStage(Stage.ShowCorrectAnswer);
        setValidateStatus("error");
        setValue([...answer]);
        setHelp("正确答案");
      }
    } else {
      setGoNext(false);
      if (question.answer === answerStr) {
        mutate({
          input: {
            questionId,
            answer: answerStr,
            duration: currentTime - time,
          },
        });
        if (questionIndex === questions.length - 1) {
          setStage(Stage.End);
        } else {
          setQuestionIndex(questionIndex + 1);
          setStage(Stage.ShowQuestion);
          setNumOfSubmission(0);
          startTest();
        }
      } else if (numOfSubmission >= 2) {
        mutate({
          input: {
            questionId,
            answer: answerStr,
            duration: currentTime - time,
          },
        });
        setStage(Stage.End);
      } else {
        setHelp(`回答错误，请再次输入，剩余${2 - numOfSubmission}次机会`);
        setNumOfSubmission(numOfSubmission + 1);
        setValidateStatus("error");
      }
    }
  };

  const startTest = () => {
    setStage(Stage.ShowQuestion);
    setCountdown(Date.now() + 1000 * 5);
  };

  const onEnd = () => {
    router.push(`/section/${sectionNo}/unit/${unitNo + 1}`);
  };

  const onCountdownFinish = () => {
    setStage(Stage.WhiteScreen);
    setValue(answer.map((row) => row.map(() => 0)));
    setTimeout(() => {
      setStage(Stage.AnswerQuestion);
      setTime(Date.now());
    }, 2000);
  };

  return (
    <div className="flex flex-col h-screen bg-primary-200">
      <Header title="工作记忆能力">
        {stage === Stage.ShowQuestion ? (
          <Countdown
            value={countdown}
            format="m:ss"
            className="leading-8 !text-xl"
            onFinish={onCountdownFinish}
          />
        ) : (
          <></>
        )}
        <Image src="/countdown.png" alt="user" width="32" height="32" />
      </Header>
      {stage === Stage.Intro ? (
        <Overview {...overview} btnText="练习" onClick={startTest} />
      ) : (
        <>
          <Progress
            currentIndex={1}
            currentPercent={
              stage === Stage.End ? 1 : questionIndex / questions.length
            }
            titles={["数字广度测验", "视觉矩阵测验"]}
          />
          {stage !== Stage.End ? (
            <div className="grow flex gap-10 px-10 items-center bg-primary-200">
              <div className="grow w-3/5 h-[calc(100%-80px)] p-20 py-10 bg-white">
                {stage === Stage.Mid ? (
                  <div className="mt-40">
                    <div className="text-center text-primary-700 text-lg">
                      现在你将进入正式测验，点击“开始测试”按钮开始吧！
                    </div>
                    <div className="mt-40 flex justify-center">
                      <Button
                        size="large"
                        shape="round"
                        onClick={() => {
                          startTest();
                        }}
                      >
                        开始测试
                      </Button>
                    </div>
                  </div>
                ) : (
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
                        <div className="w-full text-center">
                          <div>{question.isTest && "练习题 "}</div>
                          <label className="contents">{question.label}</label>
                        </div>
                      }
                      className="h-full"
                      help={
                        <div className="flex justify-center mt-2">{help}</div>
                      }
                      validateStatus={validateStatus}
                    >
                      {stage !== Stage.ReadDescription &&
                        stage !== Stage.WhiteScreen && (
                          <div
                            className={classNames("flex justify-center mt-24")}
                            style={{ marginTop: "100px" }}
                          >
                            <div>{board}</div>
                          </div>
                        )}
                    </Form.Item>
                    <Form.Item className="flex justify-center">
                      <Button
                        htmlType="submit"
                        size="large"
                        shape="round"
                        disabled={
                          stage !== Stage.AnswerQuestion &&
                          stage !== Stage.ShowCorrectAnswer
                        }
                      >
                        {goNext ? "下一题" : "提交"}
                      </Button>
                    </Form.Item>
                  </Form>
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

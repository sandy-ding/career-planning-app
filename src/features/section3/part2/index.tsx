import React, { ReactElement, useEffect, useState } from "react";
import classNames from "classnames";
import { useSubmitAnswerMutation } from "@/graphql/generated/graphql";
import { Button, Form, Typography } from "antd";
import { getDataSource } from "@/graphql/queryClient";
import Countdown from "antd/lib/statistic/Countdown";
import { ValidateStatus } from "antd/lib/form/FormItem";
import questions from "./index.json";
import Intro from "@/components/Intro";

const { Title } = Typography;

enum Stage {
  Intro,
  ReadDescription,
  ShowQuestion,
  WhiteScreen,
  AnswerQuestion,
  ShowCorrectAnswer,
}

interface IProps {
  onFinish: () => void;
}

const intro = {
  title: "（二）视觉矩阵测验",
  description:
    "接下来是视觉矩阵测验。在屏幕中央，将出现一个放有蓝色棋子的方格棋盘，这些棋子呈现5秒后会消失，请你留意这些棋子的位置，并在随后出现的空白棋盘上准确地指出这些棋子的位置。测试分练习和正式2部分，练习结束后点击“开始”按钮，进行正式测验。注意若连错3次测验即停止，以最后一次答对的棋子数量为最终得分。下面点击“练习”，开始练习吧。",
};

export default function Part2(props: IProps) {
  const [time, setTime] = useState(0);
  const [questionNo, setQuestionNo] = useState(0);
  const question = questions[questionNo];
  const { _id: questionId, type } = question;
  const answer = JSON.parse(question.answer);
  const len = answer[0].length;
  let board: ReactElement[] = [];
  const { mutate } = useSubmitAnswerMutation(getDataSource());

  const [value, setValue] = useState<number[][]>(answer);
  const [numOfSubmission, setNumOfSubmission] = useState(0);
  const [stage, setStage] = useState<Stage>(Stage.Intro);
  const [countdown, setCountdown] = useState<number>();
  const [validateStatus, setValidateStatus] =
    useState<ValidateStatus>("success");
  const [help, setHelp] = useState("");
  const [goNext, setGoNext] = useState(false);

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
            const v = [...value];
            v[i][j] = value[i][j] === 0 ? 1 : 0;
            setValue(v);
            if (help) setHelp("");
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
  }, [questionNo]);

  const onFinish = (values: { [k: string]: string }) => {
    const answerStr = JSON.stringify(value);
    if (goNext) {
      setGoNext(false);
      setHelp("");
      setQuestionNo(questionNo + 1);
      setStage(Stage.ReadDescription);
      setNumOfSubmission(0);
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
        setQuestionNo(questionNo + 1);
        setStage(Stage.ReadDescription);
        setNumOfSubmission(0);
        mutate({
          input: {
            questionId,
            answer: answerStr,
            time: Date.now() - time,
          },
        });
      } else if (numOfSubmission >= 2) {
        mutate({
          input: {
            questionId,
            answer: answerStr,
            time: Date.now() - time,
          },
        });
        props.onFinish();
      } else {
        setHelp(`回答错误，请再次输入，剩余${2 - numOfSubmission}次机会`);
        setNumOfSubmission(numOfSubmission + 1);
        setValidateStatus("error");
      }
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return stage === Stage.Intro ? (
    <Intro {...intro} onClick={() => setStage(Stage.ReadDescription)} />
  ) : (
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
          <div>
            <div>{question.isTest && "练习题 "}</div>
            <label className="contents">{question.label}</label>
          </div>
        }
        className="h-full"
        help={<div className="flex justify-center mt-2">{help}</div>}
        validateStatus={validateStatus}
      >
        {stage === Stage.ShowQuestion && (
          <div className="flex justify-end mt-4 h-10 text-xl">
            倒计时
            <Countdown
              value={countdown}
              format="s"
              className="float-right leading-8 !text-xl"
              onFinish={() => {
                setStage(Stage.WhiteScreen);
                setValue(value.map((row) => row.map(() => 0)));
                setTimeout(() => {
                  setStage(Stage.AnswerQuestion);
                  setTime(Date.now());
                }, 2000);
              }}
            />
            秒
          </div>
        )}
        {stage !== Stage.ReadDescription && stage !== Stage.WhiteScreen && (
          <div
            className={classNames(
              "flex justify-center mt-24"
              // stage === Stage.AnswerQuestion && "mt-20"
            )}
            style={{ marginTop: "100px" }}
          >
            <div>{board}</div>
          </div>
        )}
      </Form.Item>

      {stage === Stage.ReadDescription && (
        <Form.Item wrapperCol={{ offset: 8, span: 16 }} className="m-0">
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            shape="round"
            className="!px-16"
            onClick={() => {
              setStage(Stage.ShowQuestion);
              setCountdown(Date.now() + 1000 * 5);
            }}
          >
            开始
          </Button>
        </Form.Item>
      )}

      {(stage === Stage.AnswerQuestion ||
        stage === Stage.ShowCorrectAnswer) && (
        <Form.Item wrapperCol={{ offset: 8, span: 16 }} className="m-0">
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            shape="round"
            className="!px-16"
          >
            {goNext ? "下一题" : "提交"}
          </Button>
        </Form.Item>
      )}
    </Form>
  );
}

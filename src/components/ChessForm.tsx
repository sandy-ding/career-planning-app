import React, { ReactElement, useEffect, useState } from "react";
import classNames from "classnames";
import { Question, useSubmitAnswerMutation } from "@/graphql/generated/graphql";
import { Button, Form } from "antd";
import { getDataSource } from "@/graphql/queryClient";
import { useRouter } from "next/router";
import Countdown from "antd/lib/statistic/Countdown";
import { ValidateStatus } from "antd/lib/form/FormItem";

enum Stage {
  ReadDescription,
  ShowQuestion,
  WhiteScreen,
  AnswerQuestion,
  ShowCorrectAnswer,
}

export default function ChessForm({ question }: { question: Question }) {
  const answer = JSON.parse(question.answer);
  const len = answer[0].length;
  const board: ReactElement[] = [];
  const questionId = question._id;
  const router = useRouter();
  const { mutate } = useSubmitAnswerMutation(getDataSource());

  const [value, setValue] = useState<number[][]>(answer);
  const [numOfSubmission, setNumOfSubmission] = useState(1);
  const [stage, setStage] = useState<Stage>(Stage.ReadDescription);
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
          {Boolean(value[i][j]) && (
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

  const onFinish = () => {
    console.log("Success:", value);
    const answerStr = JSON.stringify(value);
    console.log("numOfSubmission", numOfSubmission);
    if (question.answer === answerStr) {
      mutate({
        input: {
          questionId,
          answer: answerStr,
        },
      });
      router.push(`${Number(questionId) + 1}`);
    } else if (numOfSubmission >= 3) {
      if (question.isTest && numOfSubmission === 3) {
        setStage(Stage.ShowCorrectAnswer);
        setValidateStatus("error");
        setGoNext(true);
        setValue([...answer]);
        setHelp("正确答案");
      } else {
        router.push(`${Number(questionId) + 1}`);
      }
    } else {
      setHelp(`回答错误，请再次输入，剩余${3 - numOfSubmission}次机会`);
      setValidateStatus("error");
      setNumOfSubmission(numOfSubmission + 1);
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
      {question.isTest && "练习题 "}
      <Form.Item
        label={
          <label className="contents">
            {questionId}. {question.label}
          </label>
        }
        help={<div className="flex justify-center mt-2">{help}</div>}
        validateStatus={validateStatus}
      >
        {stage === Stage.ReadDescription && (
          <div className="h-40 flex justify-center items-center mt-4">
            <Button
              type="primary"
              className="float-right"
              onClick={() => {
                setStage(Stage.ShowQuestion);
                setCountdown(Date.now() + 1000 * 5);
              }}
            >
              开始
            </Button>
          </div>
        )}
        {stage === Stage.ShowQuestion && (
          <div className="flex justify-end mt-4 h-10">
            <Countdown
              value={countdown}
              format="s"
              className="float-right"
              onFinish={() => {
                setStage(Stage.WhiteScreen);
                setValue(value.map((row) => row.map(() => 0)));
                setTimeout(() => {
                  setStage(Stage.AnswerQuestion);
                }, 2000);
              }}
            />
          </div>
        )}
        {stage !== Stage.ReadDescription && stage !== Stage.WhiteScreen && (
          <div
            className={classNames(
              "flex justify-center mt-4"
              // stage === Stage.AnswerQuestion && "mt-20"
            )}
          >
            <div>{board}</div>
          </div>
        )}
      </Form.Item>

      {(stage === Stage.AnswerQuestion ||
        stage === Stage.ShowCorrectAnswer) && (
        <Form.Item wrapperCol={{ offset: 8, span: 16 }} className="m-0">
          <Button type="primary" htmlType="submit" className="float-right">
            {goNext ? "下一题" : "提交"}
          </Button>
        </Form.Item>
      )}
    </Form>
  );
}

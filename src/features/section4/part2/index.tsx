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
  title: "（二）图形分析",
  description:
    "这是信息检索与归纳能力的第二段测验。<br/>您将在电脑界面上回答一系列问题，屏幕只会呈现一道题，确认选项后将会自动进入下一题，右下角为答题卡，点击数字可进入相应题目。请尽力在8分钟内完成，8分钟后将直接入下一段测验。如果时间充裕，你也可以选择提交答题卡，提前进入下一段测验。<br/>现在，请开始测验，按照界面上的指示进行作答。",
};

export default function Part2(props: IProps) {
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
      console.log({ i, j, value });
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
      } else if (numOfSubmission >= 2) {
        setGoNext(true);
        setStage(Stage.ShowCorrectAnswer);
        setValidateStatus("error");
        setValue([...answer]);
        setHelp("正确答案");
      } else {
        setHelp(`回答错误，请再次输入，剩余${2 - numOfSubmission}次机会`);
        setValidateStatus("error");
        setNumOfSubmission(numOfSubmission + 1);
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
          },
        });
      } else if (numOfSubmission >= 2) {
        mutate({
          input: {
            questionId,
            answer: answerStr,
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
    <>
      <Title level={5}>（二）视觉矩阵测验</Title>
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
          label={<label className="contents">{question.label}</label>}
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
    </>
  );
}

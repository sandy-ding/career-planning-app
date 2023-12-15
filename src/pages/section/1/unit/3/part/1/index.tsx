import { useRouter } from "next/router";
import { useSubmitAnswerMutation } from "@/graphql/generated/graphql";
import { getDataSource } from "@/graphql/queryClient";
import { useState } from "react";
import Header from "@/components/Layout/Header";
import questions from "./index.json";
import Progress from "@/components/Progress";
import { Stage } from "@/types";
import Overview from "@/components/Overview";
import UnitEnd from "@/components/UnitEnd";
import { Button, Form } from "antd";
import { ValidateStatus } from "antd/es/form/FormItem";
import OtpInput from "react-otp-input";
import AudioPlayer from "@/components/AudioPlayer";

const sectionNo = 1;
const unitNo = 3;
const partNo = 1;
const unitId = `${sectionNo}.${unitNo}`;
const partId = `${unitId}.${partNo}`;

const overview = {
  title: "数字广度测验",
  description:
    "下面开始数字广度测验。你将听到我说出一串数字，你只需按要求把听到的数字输入到屏幕中。测试分练习和正式2部分，练习结束后点击“开始”按钮，进行正式测验。注意若连错3次测验即停止，以最后一次答对数字串所包含的数字个数为最终得分。下面点击“练习”，开始练习吧。",
};

export default function Idex() {
  const router = useRouter();
  const [stage, setStage] = useState(Stage.Intro);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [numOfSubmission, setNumOfSubmission] = useState(0);
  const [goNext, setGoNext] = useState(false);

  const [time, setTime] = useState(0);
  const [otp, setOtp] = useState("");
  const [validateStatus, setValidateStatus] =
    useState<ValidateStatus>("success");
  const [help, setHelp] = useState("");
  const question = questions[questionIndex];
  const questionId = `${partId}.${question.questionId}`;

  const { mutate } = useSubmitAnswerMutation(getDataSource());

  const onFinish = async () => {
    const currentTime = Date.now();
    if (goNext) {
      setGoNext(false);
      setHelp("");
      setQuestionIndex(questionIndex + 1);
      setTime(currentTime);
      setOtp("");
    } else if (question.isTest) {
      setGoNext(true);
      if (otp === question.answer) {
        setHelp("回答正确");
        setValidateStatus("success");
      } else {
        setHelp(`正确答案: ${question.answer}`);
        setValidateStatus("error");
      }
    } else {
      setGoNext(false);
      if (otp === question.answer) {
        setNumOfSubmission(0);
        setQuestionIndex(questionIndex + 1);
        mutate({
          input: {
            questionId,
            answer: otp,
            duration: currentTime - time,
          },
        });
        setOtp("");
      } else if (numOfSubmission >= 2) {
        setNumOfSubmission(0);
        mutate({
          input: {
            questionId,
            answer: otp,
            duration: currentTime - time,
          },
        });
        if (questionIndex < 13) {
          setQuestionIndex(13);
          setHelp("");
        } else {
          setStage(Stage.End);
        }
      } else {
        setNumOfSubmission(numOfSubmission + 1);
        setHelp(`回答错误，请再次输入，剩余${2 - numOfSubmission}次机会`);
        setValidateStatus("error");
        setOtp("");
      }
    }
  };

  const onStart = async () => {
    setStage(Stage.Main);
    setTime(Date.now());
  };

  const onEnd = async () => {
    router.push(`${partNo + 1}`);
  };

  return (
    <div className="flex flex-col h-screen bg-primary-200">
      <Header title="工作记忆能力" />
      {stage === Stage.Intro ? (
        <Overview {...overview} btnText="练习" onClick={onStart} />
      ) : (
        <>
          <Progress
            currentIndex={0}
            currentPercent={
              stage === Stage.End ? 1 : questionIndex / questions.length
            }
            titles={["数字广度测验", "视觉矩阵测验"]}
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
                      <div>
                        <div>{question.isTest && "练习题 "}</div>
                        <label className="contents">
                          {question.label}
                          <AudioPlayer fileUrl={question.fileUrl!} />
                        </label>
                      </div>
                    }
                    name={questionId}
                    rules={[{ required: true, message: "请输入数字" }]}
                    help={<div className="flex justify-center">{help}</div>}
                    validateStatus={validateStatus}
                  >
                    <div className="flex justify-center">
                      <OtpInput
                        containerStyle={{ marginTop: "100px" }}
                        value={otp}
                        onChange={(otp: string) => {
                          setOtp(otp);
                          if (help) {
                            setHelp("");
                            setValidateStatus("success");
                          }
                        }}
                        numInputs={question.answer.length}
                        // containerStyle={{ width: "100%", justifyContent: "center" }}
                        renderInput={(props) => (
                          <input
                            {...props}
                            className="!w-20 h-20 m-4 text-3xl border-2 border-black"
                          />
                        )}
                      />
                    </div>
                  </Form.Item>

                  <Form.Item className="flex justify-center">
                    <Button
                      htmlType="submit"
                      size="large"
                      shape="round"
                      disabled={!otp}
                    >
                      {goNext ? "下一题" : "提交"}
                    </Button>
                  </Form.Item>
                </Form>
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

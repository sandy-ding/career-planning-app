import { useRouter } from "next/router";
import { useSubmitAnswerMutation, Question } from "@/graphql/generated/graphql";
import { getDataSource } from "@/graphql/queryClient";
import { Button, Form } from "antd";
import AudioPlayer from "./AudioPlayer";
import OtpInput from "react-otp-input";
import { useState } from "react";
import { ValidateStatus } from "antd/es/form/FormItem";

export default function AudioForm({ question }: { question: Question }) {
  const router = useRouter();
  const { _id: questionId, type, answer } = question;
  const [otp, setOtp] = useState("");
  const [validateStatus, setValidateStatus] =
    useState<ValidateStatus>("success");
  const [help, setHelp] = useState("");
  const [goNext, setGoNext] = useState(false);

  const { mutate } = useSubmitAnswerMutation(getDataSource(), {
    onSuccess(data) {
      let { isCorrect, numOfSubmission } = data?.submitAnswer;
      numOfSubmission = numOfSubmission || 1;
      if (isCorrect) {
        router.push(`${Number(questionId) + 1}`);
      } else if (numOfSubmission >= 3) {
        if (type === "test") {
          setHelp(`正确答案：${answer}`);
          setValidateStatus("error");
          setGoNext(true);
        } else {
          router.push(`${Number(questionId) + 1}`);
        }
      } else {
        setHelp(`回答错误，请再次输入，剩余${3 - numOfSubmission}次机会`);
        setValidateStatus("error");
        setOtp("");
      }
    },
  });

  const onFinish = (values: { [k: string]: string }) => {
    if (goNext) {
      router.push(`${Number(questionId) + 1}`);
    } else {
      mutate({
        input: {
          questionId,
          answer: values[questionId],
        },
      });
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
            <AudioPlayer fileUrl={question.fileUrl!} />
          </label>
        }
        name={questionId}
        rules={[{ required: true, message: "请输入数字" }]}
        help={help}
        validateStatus={validateStatus}
      >
        <OtpInput
          value={otp}
          onChange={(otp: string) => {
            setOtp(otp);
            if (help) {
              setHelp("");
              setValidateStatus("success");
            }
          }}
          numInputs={question.answerLen}
          // containerStyle={{ width: "100%", justifyContent: "center" }}
          renderInput={(props) => (
            <input
              {...props}
              className="!w-20 h-20 m-4 text-3xl border-2 border-black"
            />
          )}
        />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }} className="m-0">
        <Button type="primary" htmlType="submit" className="float-right">
          {goNext ? "下一题" : "提交"}
        </Button>
      </Form.Item>
    </Form>
  );
}

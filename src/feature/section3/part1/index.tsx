import { useSubmitAnswerMutation } from "@/graphql/generated/graphql";
import { getDataSource } from "@/graphql/queryClient";
import { Button, Form } from "antd";
import { useState } from "react";
import questions from "./index.json";
import { ValidateStatus } from "antd/es/form/FormItem";
import OtpInput from "react-otp-input";
import AudioPlayer from "@/components/AudioPlayer";
import { useRouter } from "next/router";

interface IProps {
  questionNo: number;
}

export default function Part1(props: IProps) {
  const { questionNo } = props;
  const router = useRouter();
  const [numOfSubmission, setNumOfSubmission] = useState(0);
  const [goNext, setGoNext] = useState(false);
  const [time, setTime] = useState(0);

  const question = questions[questionNo];
  const { _id: questionId, type, answer } = question;
  const [otp, setOtp] = useState("");
  const [validateStatus, setValidateStatus] =
    useState<ValidateStatus>("success");
  const [help, setHelp] = useState("");

  const { mutate } = useSubmitAnswerMutation(getDataSource());

  const onFinish = (values: { [k: string]: string }) => {
    const currentTime = performance.now();
    if (goNext) {
      setGoNext(false);
      setHelp("");
      console.log("router.push");
      router.push(`${questionNo + 2}`);
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
        router.push(`${questionNo + 2}`);
        mutate({
          input: {
            questionId,
            answer: otp,
            time: currentTime - time,
          },
        });
        setOtp("");
      } else if (numOfSubmission >= 2) {
        setNumOfSubmission(0);
        mutate({
          input: {
            questionId,
            answer: otp,
            time: currentTime - time,
          },
        });
        if (questionNo < 13) {
          router.push("14");
          setHelp("");
        } else {
          router.push("/section1/unit3/part2");
        }
      } else {
        setNumOfSubmission(numOfSubmission + 1);
        setHelp(`回答错误，请再次输入，剩余${2 - numOfSubmission}次机会`);
        setValidateStatus("error");
        setOtp("");
      }
    }
  };

  return (
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
        <Button htmlType="submit" size="large" shape="round">
          {goNext ? "下一题" : "提交"}
        </Button>
      </Form.Item>
    </Form>
  );
}

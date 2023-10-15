import { useRouter } from "next/router";
import { useSubmitAnswerMutation } from "@/graphql/generated/graphql";
import { getDataSource } from "@/graphql/queryClient";
import { Button, Form, MenuProps, Typography } from "antd";
import { ReactElement, useState } from "react";
import questions from "./index.json";
import Intro from "@/components/Intro";
import { ValidateStatus } from "antd/es/form/FormItem";
import OtpInput from "react-otp-input";
import AudioPlayer from "@/components/AudioPlayer";

const { Title } = Typography;

const intro = {
  title: "（一）数字广度测验",
  description:
    "下面开始数字广度测验。你将听到我说出一串数字，你只需按要求把听到的数字输入到屏幕中。测试分练习和正式2部分，练习结束后点击“开始”按钮，进行正式测验。注意若连错3次测验即停止，以最后一次答对数字串所包含的数字个数为最终得分。下面点击“开始”，开始练习吧。",
};

enum Stage {
  Intro,
  Main,
}

interface IProps {
  onFinish: () => void;
  menu: ReactElement;
}

export default function Part1(props: IProps) {
  const [stage, setStage] = useState(Stage.Intro);
  const [questionNo, setQuestionNo] = useState(0);
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
      setQuestionNo(questionNo + 1);
      setTime(currentTime);
    } else if (question.isTest) {
      setGoNext(true);
      if (values[question._id] === question.answer) {
        setHelp("回答正确");
        setValidateStatus("success");
      } else {
        setHelp(`正确答案: ${question.answer}`);
        setValidateStatus("error");
      }
    } else {
      setGoNext(false);
      if (values[question._id] === question.answer) {
        setNumOfSubmission(0);
        setQuestionNo(questionNo + 1);
        mutate({
          input: {
            questionId,
            answer: values[questionId],
            time: currentTime - time,
          },
        });
      } else if (numOfSubmission >= 2) {
        setNumOfSubmission(0);
        mutate({
          input: {
            questionId,
            answer: values[questionId],
            time: currentTime - time,
          },
        });
        if (questionNo < 13) {
          setQuestionNo(13);
          setHelp("");
        } else {
          props.onFinish();
        }
      } else {
        setNumOfSubmission(numOfSubmission + 1);
        setHelp(`回答错误，请再次输入，剩余${2 - numOfSubmission}次机会`);
        setValidateStatus("error");
        setOtp("");
      }
    }
  };

  return stage === Stage.Intro ? (
    <Intro
      {...intro}
      onClick={() => {
        setStage(Stage.Main);
        setTime(performance.now());
      }}
    />
  ) : (
    <>
      <Title level={5}>{intro.title}</Title>
      {props.menu}
      <Form
        name="basic"
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
        requiredMark={false}
        className="flex flex-col justify-between h-full"
      >
        {question.isTest && "练习题 "}
        <Form.Item
          label={
            <label className="contents">
              {question.label}
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
            numInputs={question.answer.length}
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
    </>
  );
}

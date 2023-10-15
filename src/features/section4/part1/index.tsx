import { useRouter } from "next/router";
import { useSubmitAnswerMutation } from "@/graphql/generated/graphql";
import { getDataSource } from "@/graphql/queryClient";
import { Button, Form, Typography } from "antd";
import { useState } from "react";
import questions from "./index.json";
import Intro from "@/components/Intro";
import { ValidateStatus } from "antd/es/form/FormItem";
import OtpInput from "react-otp-input";
import AudioPlayer from "@/components/AudioPlayer";

const { Title } = Typography;

const intro = {
  title: "（一）数字广度测验",
  description:
    "这是信息检索与归纳能力测验的第一段测验。<br/>您将在电脑界面上回答一系列问题，屏幕只会呈现一道题，确认选项后将会自动进入下一题，右下角为答题卡，点击数字可进入相应题目。请尽力在8分钟内完成，8分钟后将直接入下一段测验。如果时间充裕，你也可以选择提交答题卡，提前进入下一段测验。<br/>现在，请开始测验，按照界面上的指示进行作答。",
};

enum Stage {
  Intro,
  Main,
}

interface IProps {
  onFinish: () => void;
}

export default function Part1(props: IProps) {
  const router = useRouter();
  const [stage, setStage] = useState(Stage.Intro);
  const [questionNo, setQuestionNo] = useState(0);
  const [numOfSubmission, setNumOfSubmission] = useState(0);
  const [goNext, setGoNext] = useState(false);

  const question = questions[questionNo];
  const { _id: questionId, type, answer } = question;
  const [otp, setOtp] = useState("");
  const [validateStatus, setValidateStatus] =
    useState<ValidateStatus>("success");
  const [help, setHelp] = useState("");

  const { mutate } = useSubmitAnswerMutation(getDataSource());

  const onFinish = (values: { [k: string]: string }) => {
    console.log(question, values);
    if (goNext) {
      setGoNext(false);
      setHelp("");
      setQuestionNo(questionNo + 1);
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
          },
        });
      } else if (numOfSubmission >= 2) {
        setNumOfSubmission(0);
        mutate({
          input: {
            questionId,
            answer: values[questionId],
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
    <Intro {...intro} onClick={() => setStage(Stage.Main)} />
  ) : (
    <>
      <Title level={5}>（一）表格分析</Title>
      <Form
        name="basic"
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
        requiredMark={false}
        className="flex flex-col justify-between h-full"
      >
        <Form.Item
          label={<label className="contents">{question.label}</label>}
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

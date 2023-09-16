import { useRouter } from "next/router";
import { Question, useQuestionQuery } from "@/graphql/generated/graphql";
import { getDataSource } from "@/graphql/queryClient";
import { Button, Typography, Breadcrumb, Card } from "antd";
import RadioForm from "@/components/RadioForm/RadioForm";
import CountdownRadioForm from "@/components/CountdownRadioForm";
import AudioForm from "@/components/AudioForm";
import ChessForm from "@/components/ChessForm";
// import Countdown from "antd/es/statistic/Countdown";

const { Title } = Typography;
const deadline = Date.now() + 1000 * 60 * 8;

enum QuestionType {
  Radio = "Radio",
  Audio = "Audio",
  Chess = "Chess",
}

const getQuestionForm = (question: Question) => {
  switch (question.type) {
    case QuestionType.Radio:
      return <RadioForm question={question} />;
    case QuestionType.Audio:
      return <AudioForm question={question} />;
    case QuestionType.Chess:
      return <ChessForm question={question} />;
  }
};

export default function Question() {
  const router = useRouter();
  const questionId = router.query.id as string;
  const questionNo = Number(questionId);
  const { data, isLoading, error, isSuccess } = useQuestionQuery(
    getDataSource(),
    { id: questionId },
    { enabled: !!questionId }
  );
  console.log({ data });

  return isSuccess ? (
    <Card
      className="min-h-[75vh] shadow px-20 py-5"
      bodyStyle={{ height: "90%" }}
    >
      <Breadcrumb
        className="mb-10"
        items={[
          {
            title: data?.question?.category1,
          },
          {
            title: data?.question?.category2,
          },
          {
            title: data?.question?.category3,
          },
        ]}
      />
      {/* <Title level={3}>
        请在8分钟内完成作答。
        <Countdown value={deadline} format="mm:ss" onFinish={onFinish} />
      </Title> */}
      {getQuestionForm(data?.question as Question)}
    </Card>
  ) : null;
}

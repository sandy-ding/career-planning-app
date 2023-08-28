import { useRouter } from "next/router";
import {
  Question,
  useQuestionQuery,
  useCreateSubmissionMutation,
} from "@/graphql/generated/graphql";
import { getDataSource } from "@/graphql/queryClient";
import { Button, Typography, Form, Radio } from "antd";
import RadioForm from "@/components/RadioForm";
import CountdownRadioForm from "@/components/CountdownRadioForm";
// import Countdown from "antd/es/statistic/Countdown";

const { Title } = Typography;
const deadline = Date.now() + 1000 * 60 * 8;

export default function Question() {
  const router = useRouter();
  const questionId = router.query.id as string;
  const questionNo = Number(questionId);
  const { data, isLoading, error, isSuccess } = useQuestionQuery(
    getDataSource(),
    { id: questionId }
  );
  console.log({ data });
  return isSuccess ? (
    <>
      <Title>{data?.question?.category1}</Title>
      <Title level={2}>{data?.question?.category2}</Title>
      <Title level={3}>{data?.question?.category3}</Title>
      {/* <Title level={3}>
        请在8分钟内完成作答。
        <Countdown value={deadline} format="mm:ss" onFinish={onFinish} />
      </Title> */}
      {questionNo < 47 ? (
        <RadioForm question={data?.question as Question} />
      ) : (
        <CountdownRadioForm question={data?.question as Question} />
      )}
    </>
  ) : null;
}

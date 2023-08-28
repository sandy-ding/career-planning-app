import { useRouter } from "next/router";
import {
  useCreateSubmissionMutation,
  Question,
} from "@/graphql/generated/graphql";
import { getDataSource } from "@/graphql/queryClient";
import { Button, Form, Radio } from "antd";

export default function RadioForm({ question }: { question: Question }) {
  const router = useRouter();
  const questionId = question._id;

  const { mutate } = useCreateSubmissionMutation(getDataSource());

  const onFinish = (values: { [k: string]: string }) => {
    console.log("Success:", values);
    mutate({
      input: {
        questionId,
        answer: values[questionId],
      },
    });
    router.push(`${Number(questionId) + 1}`);
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
    >
      <Form.Item
        label={
          <label className="contents">
            {questionId}. {question.label}
          </label>
        }
        name={questionId}
        rules={[{ required: true, message: "请选择选项" }]}
      >
        <Radio.Group name="radiogroup">
          {question.options.map((option) => (
            <Radio value={option.value}>{option.label}</Radio>
          ))}
        </Radio.Group>
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit" className="float-right">
          下一题
        </Button>
      </Form.Item>
    </Form>
  );
}

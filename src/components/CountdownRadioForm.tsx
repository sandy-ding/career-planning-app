import { useRouter } from "next/router";
import { useSubmitAnswerMutation } from "@/graphql/generated/graphql";
import { getDataSource } from "@/graphql/queryClient";
import { Button, Form, Radio } from "antd";
import { Question } from "@/types";

export default function CountdownRadioForm({
  question,
}: {
  question: Question;
}) {
  const router = useRouter();
  const questionId = question?._id;
  const [form] = Form.useForm();

  const { mutate } = useSubmitAnswerMutation(getDataSource());

  const onFinish = () => {
    const values = form.getFieldsValue();
    mutate({
      input: {
        questionId,
        answer: values[questionId],
      },
    });
    router.push(`${Number(questionId) + 1}`);
  };

  return (
    <>
      {/* <Title level={3}>
        请在8分钟内完成作答。
        <Countdown value={deadline} format="mm:ss" onFinish={onFinish} />
      </Title> */}
      <Form
        name="basic"
        onFinish={onFinish}
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
            {question?.options?.map((option) => (
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
    </>
  );
}

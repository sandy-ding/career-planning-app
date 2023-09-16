import { useRouter } from "next/router";
import { useSubmitAnswerMutation, Question } from "@/graphql/generated/graphql";
import { getDataSource } from "@/graphql/queryClient";
import { Button, Form, Radio, Space } from "antd";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

export default function RadioForm({ question }: { question: Question }) {
  const router = useRouter();
  const questionId = question._id;
  const hasImage = !!question.fileUrl;
  const { mutate } = useSubmitAnswerMutation(getDataSource());

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
      className="flex flex-col justify-between h-full"
    >
      <Form.Item
        label={
          <div className="flex">
            <div className="my-[1em] mr-1">{questionId}.</div>
            <ReactMarkdown rehypePlugins={[rehypeRaw as any]}>
              {`${question.label}</br>${question?.description || ""}`}
            </ReactMarkdown>
            {question.fileUrl && <img src={question.fileUrl} />}
          </div>
        }
        name={questionId}
        rules={[{ required: true, message: "请选择选项" }]}
      >
        <Radio.Group name="radiogroup">
          <Space
            direction={hasImage ? "horizontal" : "vertical"}
            size={15}
            className="mt-5"
          >
            {question?.options?.map(({ value, label }) => (
              <Radio value={value}>
                {!hasImage && `${value}. `}
                {label}
              </Radio>
            ))}
          </Space>
        </Radio.Group>
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }} className="m-0">
        <Button type="primary" htmlType="submit" className="float-right">
          下一题
        </Button>
      </Form.Item>
    </Form>
  );
}

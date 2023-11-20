import { useRouter } from "next/router";
import { useSubmitAnswerMutation, Question } from "@/graphql/generated/graphql";
import { getDataSource } from "@/graphql/queryClient";
import { Button, Form, Radio, Space } from "antd";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

interface IProps {
  question: Question;
  onFinish: (values: { [k: string]: string }) => void;
}

export default function RadioForm({ question, onFinish }: IProps) {
  const questionId = question._id;
  const hasImage = !!question.fileUrl;

  return (
    <Form
      name="basic"
      onFinish={onFinish}
      // onFinishFailed={onFinishFailed}
      autoComplete="off"
      layout="vertical"
      requiredMark={false}
      className="flex flex-col justify-between h-full"
    >
      <Form.Item
        label={
          <div className="flex flex-col justify-center w-full">
            <ReactMarkdown rehypePlugins={[rehypeRaw as any]}>
              {`${question.label}</br>${question?.description || ""}`}
            </ReactMarkdown>
            {question.fileUrl && (
              <img className="max-w-full" src={question.fileUrl} />
            )}
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
              <Radio key={value} value={value}>
                {label}
              </Radio>
            ))}
          </Space>
        </Radio.Group>
      </Form.Item>

      <Form.Item className="flex justify-center">
        <Button type="primary" htmlType="submit">
          提交
        </Button>
      </Form.Item>
    </Form>
  );
}

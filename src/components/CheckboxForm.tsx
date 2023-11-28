import { useSubmitAnswerMutation, Question } from "@/graphql/generated/graphql";
import { Button, Checkbox, Form, Radio, Space } from "antd";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

interface IProps {
  question: Question;
  onFinish: (values: { [k: string]: string }) => void;
}

export default function CheckboxForm({ question, onFinish }: IProps) {
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
            {question.fileUrl && <img src={question.fileUrl} />}
          </div>
        }
        name={questionId}
        rules={[{ required: true, message: "请选择选项" }]}
      >
        <Checkbox.Group name="radiogroup">
          <Space
            direction={hasImage ? "horizontal" : "vertical"}
            size={15}
            className="mt-5"
          >
            {question?.options?.map(({ value, label }) => (
              <Checkbox key={value} value={value}>
                {!hasImage && `${value}．`}
                {label}
              </Checkbox>
            ))}
          </Space>
        </Checkbox.Group>
      </Form.Item>

      <Form.Item className="flex justify-center">
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          shape="round"
          className="!px-16"
        >
          提交
        </Button>
      </Form.Item>
    </Form>
  );
}

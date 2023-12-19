import { Question } from "@/types";
import { Button, Checkbox, Form, Space } from "antd";
import { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

interface IProps {
  name: string;
  question: Question;
  defaultValue?: string | undefined | null;
  onFinish: (values: { [k: string]: string }) => void;
}

export default function CheckboxForm({
  name,
  question,
  defaultValue,
  onFinish,
}: IProps) {
  const hasImage = !!question.fileUrl;
  const [form] = Form.useForm();
  useEffect(() => form.resetFields(), [name, defaultValue]);

  return (
    <Form
      form={form}
      name="basic"
      onFinish={onFinish}
      initialValues={{ [name]: defaultValue }}
      autoComplete="off"
      layout="vertical"
      requiredMark={false}
      className="flex flex-col justify-between h-full"
    >
      <Form.Item
        label={
          <div className="flex flex-col justify-center w-full text-black border px-4 text-primary-700">
            <ReactMarkdown rehypePlugins={[rehypeRaw as any]}>
              {`${question.label}</br>${question?.description || ""}`}
            </ReactMarkdown>
            {question.fileUrl && (
              <img src={question.fileUrl} className="w-full" />
            )}
          </div>
        }
        name={name}
        rules={[{ required: true, message: "请选择选项" }]}
      >
        <Checkbox.Group name="radiogroup" className="w-full">
          <Space
            direction="vertical"
            size={15}
            className="mt-5 w-full flex-wrap"
          >
            {question?.options?.map(({ value, label }) => (
              <Checkbox
                key={value}
                value={value}
                className="border w-full p-4 text-primary-700"
              >
                {!hasImage && `${value}．`}
                {label}
              </Checkbox>
            ))}
          </Space>
        </Checkbox.Group>
      </Form.Item>

      <Form.Item className="flex justify-center">
        <Button htmlType="submit" size="large" shape="round">
          提交
        </Button>
      </Form.Item>
    </Form>
  );
}

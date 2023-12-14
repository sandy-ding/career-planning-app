import { Question } from "@/types";
import { Form, Radio, Space } from "antd";
import { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

interface IProps {
  question: Question;
  name: string;
  defaultValue?: string | undefined | null;
  onFinish?: (values: { [k: string]: string }) => void;
  onChange?: (value: string) => void;
}

export default function RadioForm({
  name,
  question,
  onChange,
  defaultValue,
}: IProps) {
  const [form] = Form.useForm();
  useEffect(() => form.resetFields(), [name, defaultValue]);

  return (
    <Form
      form={form}
      name="basic"
      initialValues={{ [name]: defaultValue }}
      autoComplete="off"
      layout="vertical"
      requiredMark={false}
      className="flex flex-col justify-between h-4/5"
    >
      <Form.Item
        label={
          <div className="flex flex-col justify-center w-full text-black">
            <ReactMarkdown rehypePlugins={[rehypeRaw as any]}>
              {`${question.label}</br>${question?.description || ""}`}
            </ReactMarkdown>
            {question.fileUrl && (
              <img
                className="max-w-full max-h-96 object-scale-down"
                src={question.fileUrl}
              />
            )}
          </div>
        }
        name={name}
        rules={[{ required: true, message: "请选择选项" }]}
      >
        <Radio.Group className="w-full">
          <Space
            direction="vertical"
            size={15}
            className="mt-5 w-full flex-wrap"
          >
            {question?.options?.map(({ value, label }) => (
              <Radio
                key={value}
                value={value}
                className="border w-full p-4"
                onClick={(e: any) => onChange && onChange(e.target.value)}
              >
                {label}
              </Radio>
            ))}
          </Space>
        </Radio.Group>
      </Form.Item>
    </Form>
  );
}

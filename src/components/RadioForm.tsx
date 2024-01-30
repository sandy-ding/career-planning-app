import { Question } from "@/types";
import { Form, Radio, Space } from "antd";
import classNames from "classnames";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

interface IProps {
  question: Question;
  name: string;
  className?: string;
  defaultValue?: string | undefined | null;
  isHorizontal?: boolean;
  isTextCenter?: boolean;
  onFinish?: (values: { [k: string]: string }) => void;
  onChange?: (value: string) => void;
}

export default function RadioForm({
  name,
  question,
  className,
  onChange,
  defaultValue,
  isHorizontal,
  isTextCenter,
}: IProps) {
  const [form] = Form.useForm();
  useEffect(() => form.resetFields(), [name, defaultValue]);

  return (
    <Form
      form={form}
      name="basic"
      autoComplete="off"
      layout="vertical"
      requiredMark={false}
      className="flex flex-col justify-between h-4/5"
    >
      <Form.Item
        label={
          <div
            className={classNames(
              "flex flex-col justify-center w-full border px-4",
              isTextCenter && "text-center"
            )}
          >
            <ReactMarkdown rehypePlugins={[rehypeRaw as any]}>
              {`${question.label}</br>${question?.description || ""}`}
            </ReactMarkdown>
            {question.fileUrl && (
              <div className="flex justify-center">
                <img
                  className={classNames(
                    "max-w-full max-h-96 object-scale-down w-auto h-auto",
                    className
                  )}
                  src={question.fileUrl}
                />
              </div>
            )}
          </div>
        }
        name={name}
        rules={[{ required: true, message: "请选择选项" }]}
      >
        <Radio.Group className="w-full">
          <Space
            direction={isHorizontal ? "horizontal" : "vertical"}
            size={15}
            className="flex lg:justify-between mt-5 w-full flex-wrap"
          >
            {question?.options?.map(({ value, label }) => (
              <Radio
                key={value}
                value={value}
                className="border w-full p-4 text-primary-700"
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

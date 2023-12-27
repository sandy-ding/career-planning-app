import { Question } from "@/types";
import { Form, Radio } from "antd";
import classNames from "classnames";
import { ReactElement, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

interface IProps {
  question: Question;
  name: string;
  className?: string;
  defaultValue?: string | undefined | null;
  isHorizontal?: boolean;
  isTextCenter?: boolean;
  withImageOptions?: boolean;
  onFinish?: (values: { [k: string]: string }) => void;
  onChange?: (value: string) => void;
}

export default function RadioImageForm({
  name,
  question,
  className,
  onChange,
  defaultValue,
  isTextCenter,
}: IProps) {
  const [form] = Form.useForm();
  useEffect(() => form.resetFields(), [name, defaultValue]);
  const row = 2;
  const col = question?.options.length / 2;

  let Options: ReactElement[] = [];
  for (let i = 0; i < row; i++) {
    const cols = [];
    for (let j = 0; j < col; j++) {
      const { value, label, fileUrl } = question?.options[i * col + j];
      cols.push(
        <Radio
          key={value}
          value={value}
          className={classNames(
            "flex border p-4 text-primary-700 grow m-0",
            col === 3 ? "w-1/3" : "w-1/4"
          )}
          onClick={(e: any) => onChange && onChange(e.target.value)}
        >
          <div className="flex items-center">
            {label}
            {fileUrl && (
              <img
                className={classNames(
                  "max-w-full max-h-96 object-scale-down",
                  className
                )}
                src={fileUrl}
              />
            )}
          </div>
        </Radio>
      );
    }
    Options.push(
      <div className="flex grow" key={i}>
        {cols}
      </div>
    );
  }

  return (
    <Form
      form={form}
      name="basic"
      autoComplete="off"
      layout="vertical"
      requiredMark={false}
      className="flex justify-between h-4/5"
    >
      <Form.Item
        label={
          <div
            className={classNames(
              "flex flex-col justify-center w-full border px-4 pb-4",
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
                    "max-w-full max-h-96 object-scale-down",
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
        <Radio.Group className="flex flex-wrap">{Options}</Radio.Group>
      </Form.Item>
    </Form>
  );
}

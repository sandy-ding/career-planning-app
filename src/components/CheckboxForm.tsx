import { Question } from "@/types";
import { Button, Checkbox, Form } from "antd";
import classNames from "classnames";
import { ReactElement, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

interface IProps {
  name: string;
  question: Question;
  className?: string;
  defaultValue?: string | undefined | null;
  onFinish?: (values: { [k: string]: string }) => void;
  onChange: (values: any) => void;
}

export default function CheckboxForm({
  name,
  question,
  className,
  defaultValue,
  onChange,
  onFinish,
}: IProps) {
  const [form] = Form.useForm();
  useEffect(() => form.resetFields(), [name, defaultValue]);

  const col = 4;

  let Options: ReactElement[] = [];
  const cols = [];
  for (let j = 0; j < col; j++) {
    const { value, label, fileUrl } = question?.options[j];
    cols.push(
      <Checkbox
        key={value}
        value={value}
        className="flex border p-4 text-primary-700 grow m-0 w-1/4"
      >
        <div className="flex items-center">
          {label}
          {fileUrl && (
            <img
              className="max-w-full max-h-96 object-scale-down"
              src={fileUrl}
            />
          )}
        </div>
      </Checkbox>
    );
  }
  Options.push(<div className="flex grow">{cols}</div>);

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
              <div className="flex justify-center">
                <img
                  src={question.fileUrl}
                  className={classNames(
                    "max-w-full max-h-96 object-scale-down w-auto h-auto",
                    className
                  )}
                />
              </div>
            )}
          </div>
        }
        name={name}
        rules={[{ required: true, message: "请选择选项" }]}
      >
        <Checkbox.Group
          name="radiogroup"
          className="w-full"
          onChange={() => onChange(form.getFieldValue(name))}
        >
          {Options}
        </Checkbox.Group>
      </Form.Item>
    </Form>
  );
}

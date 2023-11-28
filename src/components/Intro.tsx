import { Button, Typography } from "antd";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

interface IProps {
  title?: string;
  description: string;
  prompt?: string;
  btnText?: string;
  onClick: () => void;
}

const { Title } = Typography;

export default function Intro({
  title,
  description,
  prompt,
  btnText,
  onClick,
}: IProps) {
  return (
    <div className="flex flex-col justify-between h-full">
      <div className="pt-20">
        {title && <Title level={4}>{title}</Title>}
        <div className="mt-4 mb-2">
          {" "}
          <ReactMarkdown rehypePlugins={[rehypeRaw as any]}>
            {description}
          </ReactMarkdown>
        </div>
        {prompt && (
          <div>
            <ReactMarkdown rehypePlugins={[rehypeRaw as any]}>
              {prompt}
            </ReactMarkdown>
          </div>
        )}
      </div>
      <div className="text-center mb-20">
        <Button
          type="primary"
          onClick={onClick}
          size="large"
          shape="round"
          className="!px-16"
        >
          {btnText || "开始"}
        </Button>
      </div>
    </div>
  );
}

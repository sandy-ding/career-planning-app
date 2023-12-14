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
    <div className="text-center">
      {title && <Title level={4}>{title}</Title>}
      <div className="bg-white border p-10 my-14 text-left leading-normal rounded-lg">
        <ReactMarkdown rehypePlugins={[rehypeRaw as any]}>
          {description}
        </ReactMarkdown>
      </div>
      <div className="text-center">
        <Button onClick={onClick} size="large" shape="round">
          {btnText || "开始"}
        </Button>
      </div>
    </div>
  );
}

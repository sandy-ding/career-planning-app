import { Button, Typography } from "antd";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

interface IProps {
  title?: string;
  description: string;
  prompt?: string;
  onClick: () => void;
}

const { Title } = Typography;

export default function Intro({ title, description, prompt, onClick }: IProps) {
  return (
    <div className="mt-20 px-10">
      {title && <Title level={3}>{title}</Title>}
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
      <div className="text-center mt-60">
        <Button type="primary" onClick={onClick} className="">
          开始
        </Button>
      </div>
    </div>
  );
}

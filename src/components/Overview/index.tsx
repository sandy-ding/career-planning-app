import Header from "@/components/Layout/Header";
import { Button, Typography } from "antd";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

const { Title } = Typography;

interface IProps {
  title: string;
  description: string;
  btnText?: string;
  onClick: () => void;
}

export default function Overview({
  title,
  description,
  btnText,
  onClick,
}: IProps) {
  return (
    <div className="h-screen bg-primary-200">
      <div className="flex p-20">
        <div className="w-4/5 min-w-[500px] mx-auto">
          <div className="text-center">
            {title && <Title level={3}>{title}</Title>}
            <div className="bg-white border p-10 my-14 text-left leading-normal rounded-lg text-primary-700 text-lg">
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
        </div>
      </div>
    </div>
  );
}

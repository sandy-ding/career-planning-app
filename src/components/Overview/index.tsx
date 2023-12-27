import Header from "@/components/Layout/Header";
import { Button, Typography } from "antd";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

const { Title } = Typography;

interface IProps {
  title?: string;
  description: string;
  btnText?: string;
  onClick: () => void;
  audioUrl?: string;
}

export default function Overview({
  title,
  description,
  btnText,
  onClick,
  audioUrl,
}: IProps) {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(audioUrl);
    setAudio(audio);
    audio.play();
  }, []);

  return (
    <div className="h-screen bg-primary-200">
      <div className="flex pt-5">
        <div className="w-4/5 min-w-[500px] mx-auto">
          <div className="text-center">
            {title && <Title level={4}>{title}</Title>}
            <div className="bg-white border p-10 my-14 text-left leading-normal rounded-lg text-primary-700 text-2xl">
              <ReactMarkdown rehypePlugins={[rehypeRaw as any]}>
                {description}
              </ReactMarkdown>
            </div>
            <div className="text-center">
              <Button
                onClick={() => {
                  audio?.pause();
                  onClick();
                }}
                size="large"
                shape="round"
              >
                {btnText || "开始测试"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

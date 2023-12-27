import { useRouter } from "next/router";
import Header from "@/components/Layout/Header";
import Overview from "@/components/Overview";

const overview = {
  title: "工作记忆能力",
  description:
    "工作记忆是在执行任务过程中, 对信息暂时加工和存储的能量有限的记忆系统，由语音环路、视觉-空间模板、中央执行器组成。工作记忆越强，对信息处理和加工速度越快，决策和解决问题效率越高。本测验为2个操作测验，分别是数字广度测验和视觉矩阵测验。",
  audioUrl: "https://carerer-planning.oss-cn-shanghai.aliyuncs.com/1-3.mp3",
};

export default function Index() {
  const router = useRouter();
  return (
    <div className="flex flex-col h-screen bg-primary-200">
      <Header title={overview.title} />
      <Overview
        {...overview}
        onClick={() => router.push(`${router.asPath}/part/1`)}
      />
    </div>
  );
}

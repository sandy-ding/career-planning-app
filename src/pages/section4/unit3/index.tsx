import Overview from "@/components/Overview";

const props = {
  title: "工作记忆能力",
  description:
    "工作记忆是在执行任务过程中, 对信息暂时加工和存储的能量有限的记忆系统，由语音环路、视觉-空间模板、中央执行器组成。工作记忆越强，对信息处理和加工速度越快，决策和解决问题效率越高。本测验为2个操作测验，分别是数字广度测验和视觉矩阵测验。",
  btnUrl: "/section1/unit3/part1/question/1",
};

export default function Index() {
  return <Overview {...props} />;
}

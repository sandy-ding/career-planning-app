import { useRouter } from "next/router";
import { useContext, useState } from "react";
import Intro from "@/components/Intro";
import Part1 from "@/features/section3/part1";
import Part2 from "@/features/section3/part2";
import { Stage } from "@/types";
import { MenuContext } from "@/hooks/MenuContext";

const intro = {
  title: "三、工作记忆能力",
  description:
    "工作记忆是在执行任务过程中, 对信息暂时加工和存储的能量有限的记忆系统，由语音环路、视觉-空间模板、中央执行器组成。工作记忆越强，对信息处理和加工速度越快，决策和解决问题效率越高。本测验为2个操作测验，分别是数字广度测验和视觉矩阵测验。",
};

export default function Section3() {
  const router = useRouter();
  const [stage, setStage] = useState(Stage.Intro);
  const { setMenu } = useContext(MenuContext);

  return stage === Stage.Intro ? (
    <Intro {...intro} onClick={() => setStage(Stage.Part1)} />
  ) : stage === Stage.Part1 ? (
    <Part1
      onFinish={() => {
        setStage(Stage.Part2);
        setMenu("3.2");
      }}
    />
  ) : (
    <Part2
      onFinish={() => {
        router.push("4");
      }}
    />
  );
}

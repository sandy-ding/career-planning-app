import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import Intro from "@/components/Intro";
import Part1 from "@/features/section9/part1";
import Part2 from "@/features/section9/part2";
import Part3 from "@/features/section9/part3";
import { MenuContext } from "@/hooks/MenuContext";
import { Stage } from "@/types";

const intro = {
  title: "九、自然观察能力",
  description:
    "自然观察能力是指人们辨别生物（动物和植物）以及对自然世界（云朵、石头等形状）的其他特征敏感的能力。自然观察能力强的人，观察敏锐、细致，能够主动发现问题、探究问题、解决问题。",
  prompt:
    "测试提示：欢迎参与自然观察能力测验！本测验包括目标搜索、目标比较和目标拼图3个模块，共5题，每小题限时10分钟。",
};

export default function Section9() {
  const router = useRouter();
  const [stage, setStage] = useState(Stage.Intro);
  const { setMenu } = useContext(MenuContext);

  useEffect(() => setMenu("9"), []);

  return (
    <>
      {stage === Stage.Intro ? (
        <Intro
          {...intro}
          onClick={() => {
            setStage(Stage.Part1);
            setMenu("9.1");
          }}
        />
      ) : stage === Stage.Part1 ? (
        <Part1
          onFinish={() => {
            setStage(Stage.Part2);
            setMenu("9.2");
          }}
        />
      ) : stage === Stage.Part2 ? (
        <Part2
          onFinish={() => {
            setStage(Stage.Part3);
            setMenu("9.3");
          }}
        />
      ) : (
        <Part3 onFinish={() => router.push("10")} />
      )}
    </>
  );
}

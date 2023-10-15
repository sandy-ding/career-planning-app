import { useRouter } from "next/router";
import { Card, Menu, MenuProps, Typography } from "antd";
import { useState } from "react";
import Intro from "@/components/Intro";
import Part1 from "@/features/section6/part1";
import Part2 from "@/features/section6/part2";
import Part3 from "@/features/section6/part3";

const { Title } = Typography;

const intro = {
  title: "六、空间能力",
  description:
    "空间能力指能够理解给定物体的空间关系，有效辨别空间位置，把握空间方向和在头脑中操作想象中物体的能力。空间能力在一般人的日常生活中经常被使用，从事一些特定的职业，比如驾驶汽车，驾驶飞机，建筑，机械，设计等职业的人则需要更高的空间能力。",
  prompt:
    "测试提示：空间能力测验包括二维空间旋转、三维空间旋转和空间想象三部分。请根据每个阶段的指导语认真完成测验。",
};

const items: MenuProps["items"] = [
  {
    label: "1. 二维空间旋转",
    key: "1",
  },
  {
    label: "2. 三维空间旋转",
    key: "2",
  },
  {
    label: "3. 空间想象",
    key: "3",
  },
];

enum Stage {
  Intro,
  Part1,
  Part2,
  Part3,
}

export default function Section3() {
  const router = useRouter();
  const [menu, setMenu] = useState("");
  const [stage, setStage] = useState(Stage.Intro);

  return (
    <Card className="shadow px-20 py-5" bodyStyle={{ minHeight: "80vh" }}>
      <Title level={5}>{intro.title}</Title>
      <Menu
        className="mb-10"
        selectedKeys={[menu]}
        mode="horizontal"
        items={items}
      />
      {stage === Stage.Intro ? (
        <Intro
          {...intro}
          onClick={() => {
            setStage(Stage.Part1);
            setMenu("1");
          }}
        />
      ) : stage === Stage.Part1 ? (
        <Part1
          onFinish={() => {
            setStage(Stage.Part2);
            setMenu("2");
          }}
        />
      ) : stage === Stage.Part2 ? (
        <Part2
          onFinish={() => {
            setStage(Stage.Part3);
            setMenu("3");
          }}
        />
      ) : (
        <Part3 onFinish={() => router.push("7")} />
      )}
    </Card>
  );
}

import { useRouter } from "next/router";
import { Card, Menu, MenuProps, Typography } from "antd";
import { useState } from "react";
import Intro from "@/components/Intro";
import Part1 from "@/features/section8/part1";
import Part2 from "@/features/section8/part2";
import Part3 from "@/features/section8/part3";

const { Title } = Typography;

const intro = {
  title: "八、信息加工能力",
  description:
    "信息加工能力是一种对信息的敏感性，包括对快速反映物体（反应时）和快速发现物体的能力（信息检索能力）。信息加工能力强的人，能够很好的辨别物体并且迅速对目标物做出反应。",
  prompt:
    "测试提示：信息加工能力测验包括辨别反应时、简单反应时和匹配反应时3个模块，其中别反应时和简单反应时各15试次，匹配反应时共3题限时10分钟。",
};

const items: MenuProps["items"] = [
  {
    label: "1. 辨别反应时",
    key: "1",
  },
  {
    label: "2. 简单反应时",
    key: "2",
  },
  {
    label: "3. 匹配反应时",
    key: "3",
  },
];

enum Stage {
  Intro,
  Part1,
  Part2,
  Part3,
}

export default function Section8() {
  const router = useRouter();
  const [menu, setMenu] = useState("");
  const [stage, setStage] = useState(Stage.Intro);

  return (
    <Card className="shadow px-20 py-5" bodyStyle={{ minHeight: "80vh" }}>
      {stage !== Stage.Intro && (
        <>
          <Title level={5}>{intro.title}</Title>
          <Menu
            className="mb-10"
            selectedKeys={[menu]}
            mode="horizontal"
            items={items}
          />
        </>
      )}
      {stage === Stage.Intro ? (
        <Intro
          {...intro}
          onClick={() => {
            setStage(Stage.Part3);
            setMenu("3");
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
        <Part3 onFinish={() => router.push("9")} />
      )}
    </Card>
  );
}

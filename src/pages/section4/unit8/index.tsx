import Overview from "@/components/Overview";

const props = {
  title: "信息加工能力",
  description:
    "信息加工能力是一种对信息的敏感性，包括对快速反映物体（反应时）和快速发现物体的能力（信息检索能力）。信息加工能力强的人，能够很好的辨别物体并且迅速对目标物做出反应。<br/><br/>测试提示：信息加工能力测验包括辨别反应时、简单反应时和匹配反应时3个模块，其中辨别反应时和简单反应时各15试次，匹配反应时共3题限时10分钟。",
  btnUrl: "/section1/unit8/part1",
};

export default function Index() {
  return <Overview {...props} />;
}

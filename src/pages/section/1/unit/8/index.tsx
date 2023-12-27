import { useRouter } from "next/router";
import Header from "@/components/Layout/Header";
import Overview from "@/components/Overview";

const sectionNo = 1;
const unitNo = 8;
const overview = {
  title: "信息加工能力",
  description:
    "信息加工能力是一种对信息的敏感性，包括对快速反映物体（反应时）和快速发现物体的能力（信息检索能力）。信息加工能力强的人，能够很好的辨别物体并且迅速对目标物做出反应。<br/><br/>测试提示：信息加工能力测验包括辨别反应时、简单反应时和匹配反应时3个模块，其中辨别反应时20试次，简单反应时15试次，匹配反应时共3题限时10分钟。",
  audioUrl: "https://carerer-planning.oss-cn-shanghai.aliyuncs.com/1-8.mp3",
};

export default function Index() {
  const router = useRouter();
  return (
    <div className="flex flex-col h-screen bg-primary-200">
      <Header title={overview.title} />
      <Overview
        {...overview}
        onClick={() =>
          router.push(`/section/${sectionNo}/unit/${unitNo}/part/1`)
        }
      />
    </div>
  );
}

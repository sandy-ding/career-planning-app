import { useRouter } from "next/router";
import Header from "@/components/Layout/Header";
import Overview from "@/components/Overview";

const sectionNo = 1;
const unitNo = 9;
const overview = {
  title: "自然观察能力",
  description:
    "自然观察能力是指人们辨别生物（动物和植物）以及对自然世界（云朵、石头等形状）的其他特征敏感的能力。自然观察能力强的人，观察敏锐、细致，能够主动发现问题、探究问题、解决问题。<br/><br/>测试提示：欢迎参与自然观察能力测验！本测验包括目标搜索、目标比较和目标拼图3个模块，共5题，每小题限时10分钟。",
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

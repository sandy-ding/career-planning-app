import { useRouter } from "next/router";
import Header from "@/components/Layout/Header";
import Overview from "@/components/Overview";

const overview = {
  title: "思维转换能力",
  description:
    "思维转换能力指不同表达方式的快速理解和转换能力，如文字转换为对应图片或图片转换为对应文字的能力。思维转换能力越强，思维活动的灵活性越强。",
  prompt:
    "测试提示：思维转换能力测验包括图片转换为对应文字和文字转换为对应图片2模块，共20题。",
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

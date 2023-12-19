import Header from "@/components/Layout/Header";
import Overview from "@/components/Overview";
import { useRouter } from "next/router";

const overview = {
  title: "人格测验",
  description:
    "欢迎来到人格测验系统！人格是个性和行为的基础，会影响我们的决策和互动方式。我们的测试系统涵盖了多种人格特质，帮助您了解自己的优势和未来的发展方向。测验可促进个人成长，建立更健康的人际关系～<br /><br />我们尊重您的隐私，系统将确保您的数据安全。立即开始探索你的独特人格吧！",
};

export default function Index() {
  const router = useRouter();
  return (
    <div className="flex flex-col h-screen bg-primary-200">
      <Header title={overview.title} />
      <Overview
        {...overview}
        onClick={() => router.push("/section/2/unit/1")}
      />
    </div>
  );
}

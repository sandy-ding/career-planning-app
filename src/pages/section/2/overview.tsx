import Header from "@/components/Layout/Header";
import Overview from "@/components/Overview";
import { useRouter } from "next/router";

const overview = {
  title: "个性测评",
  description:
    "欢迎来到个性测评系统！个性是人们行为和决策的基础，会影响我们人际互动方式和生活方式。我们的测试系统涵盖了多种人格特质，可以帮助您发现自己的个性优势，找到更适宜的未来发展方向，促进个人的成长～<br /><br />我们尊重您的隐私，系统将确保您的数据安全。立即开始探索你的独特个性吧！",
  audioUrl: "https://career-planning-app.oss-cn-beijing.aliyuncs.com/2.mp3",
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

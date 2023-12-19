import Header from "@/components/Layout/Header";
import Overview from "@/components/Overview";
import { useRouter } from "next/router";

const overview = {
  title: "职业兴趣测验",
  description:
    "欢迎来到职业兴趣测验系统！职业兴趣是探索未来职业道路的重要一步。我们致力于帮助您发现兴趣所在，探索各种职业领域。通过我们的测验，您将了解自己的优势、爱好和职场偏好，这将为未来的职业规划提供有力指导。<br /><br />我们尊重您的隐私，系统将确保您的数据安全。快来寻找您的职业兴趣所在吧！",
};

export default function Index() {
  const router = useRouter();
  return (
    <div className="flex flex-col h-screen bg-primary-200">
      <Header title={overview.title} />
      <Overview
        {...overview}
        onClick={() => router.push("/section/3/unit/1")}
      />
    </div>
  );
}

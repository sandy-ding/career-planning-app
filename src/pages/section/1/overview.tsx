import Header from "@/components/Layout/Header";
import Overview from "@/components/Overview";
import { useRouter } from "next/router";

const overview = {
  title: "潜能测评",
  description:
    "欢迎来到潜能测验系统！潜能（Potential）也称为潜力，是指一种尚未发挥的能力。在心理学中，潜能通常指的是个体内在的能力和智力，这些可能因为各种原因在目前没有被充分利用或表现出来。了解自己的潜能水平对提高学习/工作效果和职业规划至关重要。我们的系统覆盖多个潜能领域，如逻辑推理、语言理解等，旨在科学、全面评估您的潜能。<br /><br />我们尊重您的隐私，系统将确保您的数据安全。快来探索潜能的奥秘吧！",
  audioUrl: "https://carerer-planning.oss-cn-shanghai.aliyuncs.com/1.mp3",
};

export default function Index() {
  const router = useRouter();
  return (
    <div className="flex flex-col h-screen bg-primary-200">
      <Header title={overview.title} />
      <Overview
        {...overview}
        onClick={() => router.push("/section/1/unit/1")}
      />
    </div>
  );
}

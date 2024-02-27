import { useRouter } from "next/router";
import Header from "@/components/Layout/Header";
import Overview from "@/components/Overview";

const sectionNo = 1;
const unitNo = 11;
const overview = {
  title: "运动协调能力",
  description:
    "运动协调能力指的是身体的协调、平衡能力和运动的速度、灵活性等。运动协调能力强的人，有较强的手眼协调、身体协调、动手能力和较快的反应能力。该能力通过一个直升机游戏来衡量。",
  audioUrl: "https://career-planning-app.oss-cn-beijing.aliyuncs.com/1-11.mp3",
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

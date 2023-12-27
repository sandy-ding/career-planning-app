import { useRouter } from "next/router";
import Header from "@/components/Layout/Header";
import Overview from "@/components/Overview";

const sectionNo = 1;
const unitNo = 6;
const overview = {
  title: "空间能力",
  description:
    "空间能力指能够理解给定物体的空间关系，有效辨别空间位置，把握空间方向和在头脑中操作想象中物体的能力。空间能力在一般人的日常生活中经常被使用，从事一些特定的职业，比如驾驶汽车，驾驶飞机，建筑，机械，设计等职业的人则需要更高的空间能力。<br/><br/>测试提示：空间能力测验包括二维空间旋转、三维空间旋转和空间想象三部分。请根据每个阶段的指导语认真完成测验。",
  audioUrl: "https://carerer-planning.oss-cn-shanghai.aliyuncs.com/1-6.mp3",
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

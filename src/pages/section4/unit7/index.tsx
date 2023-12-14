import Overview from "@/components/Overview";

const props = {
  title: "机械能力",
  description:
    "机械能力是对实际情境中的机械关系和物理定律的理解能力。它包括速度、力和杠杆、流体、滑轮、热力学、电力、齿轮、车轮、声学、光学这10个主题。机械能力强的人，擅长运用基本的物理知识解决现实生活中的问题。<br/><br/>测试提示：本测验为单项选择题，每题只有一个最佳选项，每答对一题得一分，答错不计分。下面开始测试吧！",
  btnUrl: "/section1/unit7/question/1",
};

export default function Index() {
  return <Overview {...props} />;
}

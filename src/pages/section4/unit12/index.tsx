import Overview from "@/components/Overview";

const props = {
  title: "美术能力",
  description:
    "美术能力是指一个人在视觉艺术领域的技能和才能。美术能力不仅包括绘画和绘图的技能，还包括对颜色、形状、纹理等视觉元素的理解，以及能够用艺术媒介表达思想和情感的能力。<br/><br/>测试提示：美术能力测验通过线段的宽窄和实图大小2个部分来衡量，限时8分钟，共10题，答对一题得一分，答错不计分。接下来，开始测试。",
  btnUrl: "/section1/unit12/question/1",
};

export default function Index() {
  return <Overview {...props} />;
}

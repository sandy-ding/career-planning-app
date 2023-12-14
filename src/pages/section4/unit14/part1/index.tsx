import Overview from "@/components/Overview";

const props = {
  title: "图片转换为对应文字",
  description:
    "指导语：这是思维转换能力的第一段测验。<br/><br/>你将在电脑界面上回答一系列问题，屏幕上只会呈现一道题。请你根据呈现的图片，尽可能快地判断图片与给出的语句是否一致。如果一致请按F键，如果不一致请按J键。<br/><br/>现在，请开始测验。",
  btnUrl: "/section1/unit14/part1/question/1",
};

export default function Index() {
  return <Overview {...props} />;
}

import Overview from "@/components/Overview";

const props = {
  title: "文字转换为对应图片",
  description:
    "指导语：这是思维转换能力的第二段测验。<br/><br/>你将在电脑界面上回答一系列问题，屏幕上只会呈现一道题。请你根据题目呈现的文字，尽可能快地选择出与文字相对应的图片。<br/><br/>现在，请开始测验。",
  btnUrl: "/section1/unit14/part2/question/1",
};

export default function Index() {
  return <Overview {...props} />;
}

import Overview from "@/components/Overview";

const props = {
  title: "简单反应时",
  description:
    "指导语：这是信息加工能力测验的第二段测验。<br/><br/>接下来电脑界面上将呈现一个灯泡，请在灯泡亮起时尽可能快地按下G键。<br/><br/>现在，请先进行练习测验，练习完成后开始正式测验。",
  btnUrl: "/section1/unit8/part2/question/1",
};

export default function Index() {
  return <Overview {...props} />;
}

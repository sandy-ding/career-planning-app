import Overview from "@/components/Overview";

const props = {
  title: "人际交往礼仪",
  description:
    "指导语：这是人际交往能力测验的第一段测验。<br/><br/>您将在电脑界面上回答一系列问题，屏幕只会呈现一道题，确认选项后将会自动进入下一题，右下角为答题卡，点击数字可进入相应题目。请尽力在8分钟内完成，8分钟后将直接入下一段测验。如果时间充裕，你也可以选择提交答题卡，提前进入下一段测验。<br/><br/>现在，请开始测验，按照界面上的指示进行作答。",
  btnUrl: "/section1/unit16/part1/question/1",
};

export default function Index() {
  return <Overview {...props} />;
}

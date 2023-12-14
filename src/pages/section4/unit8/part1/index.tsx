import Overview from "@/components/Overview";

const props = {
  title: "辨别反应时",
  description:
    "指导语：这是信息加工能力测验的第一段测验。<br/><br/>接下来电脑界面上将呈现出红绿灯的图片，请你根据图片的指示尽可能快地做出按键反应。如果红灯亮起，请按F键；如果绿灯亮起，请按J键。<br/><br/>现在，请先进行练习测验，练习完成后开始正式测验。",
  btnText: "练习",
  btnUrl: "/section1/unit8/part1/question/1",
};

export default function Index() {
  return <Overview {...props} />;
}

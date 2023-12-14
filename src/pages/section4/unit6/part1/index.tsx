import Overview from "@/components/Overview";

const props = {
  title: "二维空间旋转",
  description:
    "指导语：你将在屏幕正中央看到一个字母，请判断该字母是正向或或者反向。如果是正向，请按“F”键，如果是反向，请按“J”键。在判断正确的前提下，反应越快越好。测试分练习和正式2部分，练习结束后点击“开始”按钮，进行正式测验。下面点击“练习”，开始练习吧。",
  btnText: "练习",
  btnUrl: "/section1/unit6/part1/question/1",
};

export default function Index() {
  return <Overview {...props} />;
}

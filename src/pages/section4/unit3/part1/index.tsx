import Overview from "@/components/Overview";

const props = {
  title: "数字广度测验",
  description:
    "指导语：下面开始数字广度测验。你将听到我说出一串数字，你只需按要求把听到的数字输入到屏幕中。测试分练习和正式2部分，练习结束后点击“开始”按钮，进行正式测验。注意若连错3次测验即停止，以最后一次答对数字串所包含的数字个数为最终得分。下面点击“练习”，开始练习吧。",
  btnText: "练习",
  btnUrl: "/section1/unit3/part1/question/1",
};

export default function Index() {
  return <Overview {...props} />;
}

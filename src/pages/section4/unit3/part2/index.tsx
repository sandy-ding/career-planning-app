import Overview from "@/components/Overview";

const props = {
  title: "视觉矩阵测验",
  description:
    "指导语：接下来是视觉矩阵测验。在屏幕中央，将出现一个放有蓝色棋子的方格棋盘，这些棋子呈现5秒后会消失，请你留意这些棋子的位置，并在随后出现的空白棋盘上准确地指出这些棋子的位置。测试分练习和正式2部分，练习结束后点击“开始”按钮，进行正式测验。注意若连错3次测验即停止，以最后一次答对的棋子数量为最终得分。下面点击“练习”，开始练习吧。",
  btnText: "练习",
  btnUrl: "/section1/unit3/part2/question/1",
};

export default function Index() {
  return <Overview {...props} />;
}

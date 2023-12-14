import Overview from "@/components/Overview";

const props = {
  title: "信息检索与归纳能力",
  description:
    "信息检索与归纳能力是指对给定的资料的全部或部分内容，观点或问题进行分析和归纳，多角度的思考资料内容，做出合理的推断或评价的能力。<br/><br/>测试提示：信息检索与归纳能力测验包括表格分析和图形分析2个模块，每个模块限时8分钟，共10题。答对一题得一分，答错不计分。请您<strong>尽快</strong>作答。下面开始测试。",
  btnUrl: "/section1/unit5/part1",
};

export default function Index() {
  return <Overview {...props} />;
}

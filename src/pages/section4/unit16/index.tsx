import Overview from "@/components/Overview";

const props = {
  title: "人际交往能力",
  description:
    "人际交往能力是指个体妥善处理组织内外关系的能力，包括与周围环境建立广泛联系、转化能力，以及正确处理上下左右关系的能力。<br/><br/>测试提示：人际交往能力测验包括人际交往礼仪和人际关系能力2个模块，共18道单选题，限时16分钟内完成。",
  btnUrl: "/section1/unit16/part1",
};

export default function Index() {
  return <Overview {...props} />;
}

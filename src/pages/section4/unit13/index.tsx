import Overview from "@/components/Overview";

const props = {
  title: "音乐能力",
  description:
    "音乐能力指的是个人感受、辨别、记忆、表达音乐的能力，表现为个人对节奏、音调、音色和旋律的敏感以及通过作曲、演奏、歌唱等形式来表达自己的思想或情感。<br/><br/>测试提示：音乐测验从3个方面测查音乐能力：I音乐欣赏力；Ⅱ音乐技能；Ⅲ音乐节奏感。共计30题。请按照自身实际情况选择最符合自己描述的一个选项。下面开始正式测试。",
  btnUrl: "/section1/unit13/question/1",
};

export default function Index() {
  return <Overview {...props} />;
}

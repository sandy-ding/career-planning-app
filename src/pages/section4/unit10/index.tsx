import Overview from "@/components/Overview";

const props = {
  title: "内省能力",
  description:
    "内省智力是指个体认识、洞察和反省自身的能力。在这方面得分高，意味着你能较好地意识和评价自己的动机、情绪、个性等，并且有意识地运用这些信息去调适自己生活的能力。<br/><br/>测试提示：内省测验包括认知、洞察、反省三部分，共15题。请按照自身实际情况选择最符合自己描述的一个选项。下面开始正式测试。",
  btnUrl: "/section1/unit10/question/1",
};

export default function Index() {
  return <Overview {...props} />;
}

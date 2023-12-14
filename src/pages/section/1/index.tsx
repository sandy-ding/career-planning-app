import Entry from "@/features/Entry";

const props = {
  headerTitle: "智力测验",
  title: "你的智力有多高？",
  btnUrl: "/section/1/unit/1",
  className: "px-20",
  bgImage:
    "bg-[url('https://career-planning-app.oss-cn-beijing.aliyuncs.com/section1.svg')]",
};

export default function Index() {
  return <Entry {...props} />;
}

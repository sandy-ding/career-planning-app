import Entry from "@/components/Entry";

const props = {
  headerTitle: "职业兴趣测验",
  title: "你喜欢什么职业呢？",
  btnUrl: "/section/3/unit/1",
  className: "pr-40",
  bgImage:
    "bg-[url('https://career-planning-app.oss-cn-beijing.aliyuncs.com/section3.svg')]",
};

export default function Index() {
  return <Entry {...props} />;
}

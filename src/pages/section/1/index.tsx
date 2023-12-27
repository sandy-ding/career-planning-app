import Entry from "@/components/Entry";

const props = {
  headerTitle: "潜能测评",
  title: "你的智力有多高？",
  btnUrl: "/section/1/overview",
  className: "px-20",
  bgImage:
    "bg-[url('https://career-planning-app.oss-cn-beijing.aliyuncs.com/section1.svg')]",
};

export default function Index() {
  return <Entry {...props} />;
}

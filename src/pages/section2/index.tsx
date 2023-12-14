import Entry from "@/features/Entry";

const props = {
  headerTitle: "人格测验",
  title: "你了解自己的人格吗？",
  btnUrl: "/section2/overview",
  className: "pt-0",
  bgImage:
    "bg-[url('https://career-planning-app.oss-cn-beijing.aliyuncs.com/section2.svg')]",
};

export default function Index() {
  return <Entry {...props} />;
}

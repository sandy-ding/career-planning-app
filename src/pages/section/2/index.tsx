import Entry from "@/components/Entry";

const props = {
  headerTitle: "人格测验",
  title: "你了解自己的人格吗？",
  btnUrl: "/section/2/unit/1",
  className: "pt-0",
  bgImage:
    "bg-[url('https://career-planning-app.oss-cn-beijing.aliyuncs.com/section2.svg')]",
};

export default function Index() {
  return <Entry {...props} />;
}

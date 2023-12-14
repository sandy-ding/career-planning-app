import Overview from "@/components/Overview";

const props = {
  title: "空间想象",
  description:
    "指导语：您将在电脑界面上回答一系列问题，请尽量在8分钟内完成，8分钟后将直接进入下一段测验。现在，请按照界面上的指示进行作答。",
  btnUrl: "/section1/unit6/part3/question/1",
};

export default function Index() {
  return <Overview {...props} />;
}

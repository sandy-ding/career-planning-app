import Overview from "@/components/Overview";

const props = {
  title: "三维空间旋转",
  description:
    "指导语：下面每道题的最左边有一个标准图形，右边的 4 个图形中总有两个与左边的标准图形是一样的(只是呈现的角度不同)，请你找出哪两个图形与左边的标准图形一样。",
  btnUrl: "/section1/unit6/part2/question/1",
};

export default function Index() {
  return <Overview {...props} />;
}

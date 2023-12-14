import { useRouter } from "next/router";
import { getDataSource } from "@/graphql/queryClient";
import { useMemo, useState } from "react";
import Part1 from "@/feature/section8/part1";
import Header from "@/components/Layout/Header";
import { Button, Spin, Steps } from "antd";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function Section1() {
  const dataSource = getDataSource();
  const router = useRouter();
  const [time, setTime] = useState(0);

  const questionNo = useMemo(
    () => Number(router.query.questionNo) - 1 || 0,
    [router.query.questionNo]
  );

  // const goNext = () => {
  //   if (questionNo === questions.length - 1) {
  //     router.push("/section1/part3");
  //   } else {
  //     router.push(`${questionNo + 2}`);
  //   }
  // };

  return (
    <div className="flex flex-col h-screen bg-primary-200">
      <Header title="信息加工能力" />
      <Steps
        type="navigation"
        current={0}
        className="site-navigation-steps"
        items={[
          {
            title: "辨别反应时",
          },
          {
            title: "简单反应时",
          },
          {
            title: "匹配反应时",
          },
        ]}
      />
      <div className="grow flex gap-10 px-10 items-center bg-primary-200">
        <Button
          shape="circle"
          size="large"
          icon={<ArrowLeft size={36} />}
          onClick={router.back}
        />
        <div className="grow w-3/5 h-[calc(100%-80px)] p-20 py-10 bg-white">
          <Part1 />
        </div>
        <Button
          shape="circle"
          size="large"
          icon={<ArrowRight size={36} />}
          disabled
          // onClick={goNext}
        />
      </div>
    </div>
  );
}

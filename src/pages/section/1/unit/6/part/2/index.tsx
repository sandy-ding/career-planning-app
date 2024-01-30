import { useRouter } from "next/router";
import { useSubmitAnswerMutation } from "@/graphql/generated/graphql";
import { getDataSource } from "@/graphql/queryClient";
import { useMemo, useState } from "react";
import questions from "./index.json";
import Header from "@/components/Layout/Header";
import Progress from "@/components/Progress";
import { Stage } from "@/types";
import Overview from "@/components/Overview";
import UnitEnd from "@/components/UnitEnd";
import CheckboxForm from "@/components/CheckboxForm";

const partNo = 2;
const unitId = "F";
const partId = `${unitId}${partNo}`;
const overview = {
  title: "三维空间旋转",
  description:
    "<strong>指导语</strong>：每道题的上方是标准图形，下方是4个比较图形，这4个当中总有2个与标准图形是一样的(只是呈现的角度不同)，请你找出这2个图形。",
  audioUrl: "https://career-planning-app.oss-cn-beijing.aliyuncs.com/1-6-2.mp3",
};

export default function Index() {
  const router = useRouter();
  const [stage, setStage] = useState(Stage.Intro);
  const [questionNo, setQuestionNo] = useState(1);
  const [time, setTime] = useState(0);

  const partIndex = useMemo(() => partNo - 1, [partNo]);
  const questionIndex = useMemo(() => questionNo - 1, [questionNo]);
  const questionId = `${partId}.${questionNo}`;

  const { mutateAsync } = useSubmitAnswerMutation(getDataSource());

  const onStart = () => {
    setStage(Stage.Question);
    setTime(Date.now());
  };

  const onEnd = () => {
    router.push(`${partNo + 1}`);
  };

  const onChange = (values: string[]) => {
    const currentTime = Date.now();
    if (values.length === 2) {
      mutateAsync({
        input: {
          questionId,
          answer: JSON.stringify(values.sort()),
          duration: currentTime - time,
        },
      });
      setTime(currentTime);
      if (questionNo === questions.length) {
        setStage(Stage.End);
      }
      setQuestionNo(questionNo + 1);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-primary-200">
      <Header title="空间能力" />
      {stage === Stage.Intro ? (
        <Overview {...overview} onClick={onStart} />
      ) : (
        <>
          <Progress
            currentIndex={partIndex}
            currentPercent={questionIndex / questions.length}
            titles={["二维空间旋转", "三维空间旋转", "空间想象"]}
          />
          {stage === Stage.Question ? (
            <div className="grow flex gap-10 px-10 items-center bg-primary-200">
              <div className="grow w-3/5 h-[calc(100%-80px)] p-20 py-10 bg-white">
                <CheckboxForm
                  name={questionId}
                  question={questions[questionIndex]}
                  onChange={onChange}
                  className="w-[250px]"
                />
              </div>
            </div>
          ) : (
            <UnitEnd goNext={onEnd} />
          )}
        </>
      )}
    </div>
  );
}

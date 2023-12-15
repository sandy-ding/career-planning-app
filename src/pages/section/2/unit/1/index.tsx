import { useRouter } from "next/router";
import { useSubmitAnswerMutation } from "@/graphql/generated/graphql";
import { getDataSource } from "@/graphql/queryClient";
import { useMemo, useState } from "react";
import questions from "./index.json";
import RadioForm from "@/components/RadioForm";
import Header from "@/components/Layout/Header";
import Progress from "@/components/Progress";
import { Stage } from "@/types";
import Overview from "@/components/Overview";
import UnitEnd from "@/components/UnitEnd";

const sectionNo = 2;
const overview = {
  title: "人格测验",
  description:
    "您好！本测验请根据自己的真实感受来填写以下问题，每道题目仅选择一个最佳选项，请根据自己的情况进行5点评分：1 非常不符合，2 不符合，3 一般，4 符合，5 非常符合。测验共144题，所有答案没有对错、好坏之分。",
};

export default function Index() {
  const router = useRouter();
  const dataSource = getDataSource();

  const [stage, setStage] = useState(Stage.Intro);
  const [questionNo, setQuestionNo] = useState(1);
  const { mutateAsync: submitAnswer } = useSubmitAnswerMutation(dataSource);

  const questionIndex = useMemo(() => questionNo - 1, [questionNo]);
  const questionId = `${sectionNo}.${questionNo}`;

  const isLast = questionIndex === questions.length - 1;

  const onChange = async (value: string) => {
    await submitAnswer({
      input: {
        questionId,
        answer: value,
      },
    });
    goNext();
  };

  const goNext = () => {
    if (isLast) {
      setStage(Stage.End);
    }
    setQuestionNo(questionNo + 1);
  };

  const onEnd = async () => {
    router.push(`/section/${sectionNo + 1}`);
  };

  return (
    <div className="flex flex-col h-screen bg-primary-200">
      <Header title={overview.title} />
      {stage === Stage.Intro ? (
        <Overview {...overview} onClick={() => setStage(Stage.Question)} />
      ) : (
        <>
          <Progress
            currentIndex={0}
            currentPercent={questionIndex / questions.length}
            titles={[""]}
          />
          {stage === Stage.Question ? (
            <div className="grow flex gap-10 px-10 items-center bg-primary-200">
              <div className="grow w-3/5 h-[calc(100%-80px)] p-20 py-10 bg-white">
                <RadioForm
                  isHorizontal
                  name={questionId}
                  question={{
                    _id: questionId,
                    label: `${questionNo}．${questions[questionIndex].label}`,
                    options: [
                      {
                        value: "1",
                        label: "1 完全不符合",
                      },
                      {
                        value: "2",
                        label: "2 不符合",
                      },
                      {
                        value: "3",
                        label: "3 一般符合",
                      },
                      {
                        value: "4",
                        label: "4 符合",
                      },
                      {
                        value: "5",
                        label: "5 完全符合",
                      },
                    ],
                  }}
                  onChange={onChange}
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

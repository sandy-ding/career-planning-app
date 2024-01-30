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

const unitNo = 1;
const overview = {
  title: "语言能力",
  description:
    "语言能力是对语言掌握的能力，包括言语理解和言语表达。言语理解强调对文字材料内涵的快速理解和把握，通过词汇理解和句子理解来衡量。言语表达强调语言文字的交流与运用，通过语句填空、语句排序和语句续写来衡量。<br/><br/>测试提示：语言能力测验总计26道单项选择题，每道题只有一个最佳选项，答对一题得一分，答错不计分。接下来，开始语言能力测试。",
  audioUrl: "https://career-planning-app.oss-cn-beijing.aliyuncs.com/1-1.mp3",
};

export default function Index() {
  const router = useRouter();
  const dataSource = getDataSource();

  const [partNo, setPartNo] = useState(1);
  const [stage, setStage] = useState(Stage.Intro);
  const [questionNo, setQuestionNo] = useState(1);
  const [time, setTime] = useState(Date.now());
  const { mutateAsync: submitAnswer } = useSubmitAnswerMutation(dataSource);

  const isQuestionStage = stage === Stage.Question;
  const partIndex = useMemo(() => partNo - 1, [partNo]);
  const questionIndex = useMemo(() => questionNo - 1, [questionNo]);
  const questionId = `A${partNo}.${questionNo}`;

  const isLast =
    partIndex === questions.length - 1 &&
    questionIndex === questions[partIndex].length - 1;

  const onChange = async (value: string) => {
    const currentTime = Date.now();
    await submitAnswer({
      input: {
        questionId,
        answer: value,
        duration: currentTime - time,
      },
    });
    setTime(currentTime);
    goNext();
  };

  const goNext = () => {
    if (isLast) {
      setStage(Stage.End);
      setQuestionNo(questionNo + 1);
    } else if (questionIndex === questions[partIndex].length - 1) {
      setPartNo(partNo + 1);
      setQuestionNo(1);
    } else {
      setQuestionNo(questionNo + 1);
    }
  };

  const onStart = async () => {
    setTime(Date.now());
    setStage(Stage.Question);
  };

  const onEnd = async () => {
    router.push(`${unitNo + 1}`);
  };

  return (
    <div className="flex flex-col h-screen bg-primary-200">
      <Header title={overview.title} />
      {stage === Stage.Intro ? (
        <Overview {...overview} onClick={onStart} />
      ) : (
        <>
          <Progress
            currentIndex={partIndex}
            currentPercent={questionIndex / questions[partIndex].length}
            titles={[
              "词汇理解",
              "句子理解",
              "语句填空",
              "语句排序",
              "语句续写",
            ]}
          />
          {isQuestionStage ? (
            <div className="grow flex gap-10 px-10 items-center bg-primary-200">
              <div className="grow w-3/5 h-[calc(100%-80px)] p-20 py-10 bg-white">
                <RadioForm
                  name={questionId}
                  question={questions[partIndex][questionIndex]}
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

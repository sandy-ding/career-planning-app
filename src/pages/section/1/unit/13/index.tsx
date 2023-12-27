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

const sectionNo = 1;
const unitNo = 13;
const unitId = `${sectionNo}.${unitNo}`;
const overview = {
  title: "音乐能力",
  description:
    "音乐能力指的是个人感受、辨别、记忆、表达音乐的能力，表现为个人对节奏、音调、音色和旋律的敏感以及通过作曲、演奏、歌唱等形式来表达自己的思想或情感。<br/><br/>测试提示：音乐测验从3个方面测查音乐能力：Ⅰ音乐欣赏力；Ⅱ音乐技能；Ⅲ音乐节奏感。共计30题。请按照自身实际情况选择最符合自己描述的一个选项。下面开始正式测试。",
  audioUrl: "https://carerer-planning.oss-cn-shanghai.aliyuncs.com/1-13.mp3",
};

export default function Index() {
  const router = useRouter();
  const dataSource = getDataSource();

  const [partNo, setPartNo] = useState(1);
  const [stage, setStage] = useState(Stage.Intro);
  const [questionNo, setQuestionNo] = useState(1);
  const { mutateAsync: submitAnswer } = useSubmitAnswerMutation(dataSource);

  const isQuestionStage = stage === Stage.Question;
  const partIndex = useMemo(() => partNo - 1, [partNo]);
  const questionIndex = useMemo(() => questionNo - 1, [questionNo]);
  const questionId = `${unitId}.${partNo}.${questionNo}`;

  const isLast =
    partIndex === questions.length - 1 &&
    questionIndex === questions[partIndex].length - 1;

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
      setQuestionNo(questionNo + 1);
    } else if (questionIndex === questions[partIndex].length - 1) {
      setPartNo(partNo + 1);
      setQuestionNo(1);
    } else {
      setQuestionNo(questionNo + 1);
    }
  };

  const onStart = async () => {
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
            currentIndex={isQuestionStage ? partIndex : questions.length - 1}
            currentPercent={
              isQuestionStage ? questionIndex / questions[partIndex].length : 1
            }
            titles={["音乐欣赏力", "音乐技能", "音乐节奏感"]}
          />
          {stage === Stage.Question ? (
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

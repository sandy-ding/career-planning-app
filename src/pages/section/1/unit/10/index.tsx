import { useRouter } from "next/router";
import {
  useAnswerQuery,
  useSubmitAnswerMutation,
} from "@/graphql/generated/graphql";
import { getDataSource } from "@/graphql/queryClient";
import { useMemo, useState } from "react";
import questions from "./index.json";
import RadioForm from "@/components/RadioForm";
import Header from "@/components/Layout/Header";
import Progress from "@/components/Progress";
import { Stage } from "@/types";
import Loading from "@/components/Loading";
import Overview from "@/components/Overview";
import UnitEnd from "@/components/UnitEnd";

const sectionNo = 1;
const unitNo = 10;
const unitId = `${sectionNo}.${unitNo}`;
const overview = {
  title: "内省能力",
  description:
    "内省智力是指个体认识、洞察和反省自身的能力。在这方面得分高，意味着你能较好地意识和评价自己的动机、情绪、个性等，并且有意识地运用这些信息去调适自己生活的能力。<br/><br/>测试提示：内省测验包括认知、洞察、反省三部分，共15题。请按照自身实际情况选择最符合自己描述的一个选项。下面开始正式测试。",
};

export default function Index() {
  const router = useRouter();
  const dataSource = getDataSource();

  const [stage, setStage] = useState(Stage.Intro);
  const [questionNo, setQuestionNo] = useState(1);
  const { mutateAsync: submitAnswer } = useSubmitAnswerMutation(dataSource);

  const isQuestionStage = stage === Stage.Question;
  const questionIndex = useMemo(() => questionNo - 1, [questionNo]);
  const questionId = `${unitId}.${questionNo}`;

  const isLast = questionIndex === questions.length - 1;

  const { data, isLoading } = useAnswerQuery(
    dataSource,
    {
      questionId,
    },
    {
      enabled: isQuestionStage,
    }
  );

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

  const { mutateAsync: submitUnit } = useSubmitAnswerMutation(getDataSource());

  const onStart = async () => {
    setStage(Stage.Question);
  };

  const onEnd = async () => {
    await submitUnit({
      input: {
        questionId: unitId,
        endTime: Date.now(),
      },
    }).then(() => {
      router.push(`${unitNo + 2}`);
    });
  };

  return (
    <div className="flex flex-col h-screen bg-primary-200">
      <Header title={overview.title} />
      {stage === Stage.Intro ? (
        <Overview {...overview} onClick={onStart} />
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
                {isLoading ? (
                  <Loading />
                ) : (
                  <RadioForm
                    name={questionId}
                    defaultValue={data?.answer?.answer}
                    question={questions[questionIndex]}
                    onChange={onChange}
                  />
                )}
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

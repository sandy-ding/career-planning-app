import { useRouter } from "next/router";
import {
  useAnswerQuery,
  useAnswersQuery,
  useSubmitAnswerMutation,
} from "@/graphql/generated/graphql";
import { getDataSource } from "@/graphql/queryClient";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import questions from "./index.json";
import RadioForm from "@/components/RadioForm";
import Header from "@/components/Layout/Header";
import { Button } from "antd";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Progress from "@/components/Progress";
import { Stage } from "@/types";
import Loading from "@/components/Loading";
import Overview from "@/components/Overview";
import UnitEnd from "@/components/UnitEnd";
import Countdown from "antd/lib/statistic/Countdown";

const sectionNo = 1;
const unitNo = 5;
const unitId = `${sectionNo}.${unitNo}`;
const overview = {
  title: "信息检索与归纳能力",
  description:
    "信息检索与归纳能力是指对给定的资料的全部或部分内容，观点或问题进行分析和归纳，多角度的思考资料内容，做出合理的推断或评价的能力。<br/><br/>测试提示：信息检索与归纳能力测验包括表格分析和图形分析2个模块，每个模块限时8分钟，共10题。答对一题得一分，答错不计分。请您尽快做答。下面开始测试。",
};
const overview1 = {
  title: "表格分析",
  description:
    "这是信息检索与归纳能力测验的第一段测验。<br/><br/>您将在电脑界面上回答一系列问题，屏幕只会呈现一道题，确认选项后将会自动进入下一题，右下角为答题卡，点击数字可进入相应题目。请尽力在8分钟内完成，8分钟后将直接入下一段测验。如果时间充裕，你也可以选择提交答题卡，提前进入下一段测验。<br/><br/>现在，请开始测验，按照界面上的指示进行作答。",
};
const overview2 = {
  title: "图形分析",
  description:
    "这是信息检索与归纳能力的第二段测验。<br/><br/>您将在电脑界面上回答一系列问题，屏幕只会呈现一道题，确认选项后将会自动进入下一题，右下角为答题卡，点击数字可进入相应题目。请尽力在8分钟内完成，8分钟后将直接入下一段测验。如果时间充裕，你也可以选择提交答题卡，提前进入下一段测验。<br/><br/>现在，请开始测验，按照界面上的指示进行作答。",
};

export default function Index() {
  const router = useRouter();
  const dataSource = getDataSource();

  const [partNo, setPartNo] = useState(1);
  const [stage, setStage] = useState(Stage.Intro);
  const [questionNo, setQuestionNo] = useState(1);
  const [countdown, setCountdown] = useState<number>();
  const { mutateAsync: submitAnswer } = useSubmitAnswerMutation(dataSource);

  const partIndex = useMemo(() => partNo - 1, [partNo]);
  const questionIndex = useMemo(() => questionNo - 1, [questionNo]);
  const partId = `${unitId}.${partNo}`;
  const questionId = `${partId}.${questionNo}`;
  const totalNum = questions[partIndex].length;

  useEffect(() => {
    const activeQuestionId = localStorage.getItem("activeQuestionId");
    if (activeQuestionId) {
      const activeIds = activeQuestionId?.split(".");
      setPartNo(Number(activeIds?.[2]));
      setQuestionNo(Number(activeIds?.[3]));
    }
  }, []);

  useEffect(() => {
    if (stage === Stage.Part1Main || stage === Stage.Part2Main) {
      localStorage.setItem("activeQuestionId", questionId);
    }
  }, [questionId, stage]);

  const {
    data: partData,
    isLoading: isLoadingUnit,
    refetch: refetchPartData,
  } = useAnswerQuery(
    dataSource,
    {
      questionId: partId,
    },
    {
      onSuccess(data) {
        if (data?.answer?.endTime) {
          if (partNo === 1) {
            setPartNo(2);
            setQuestionNo(1);
          } else {
            setStage(Stage.End);
          }
        } else if (data?.answer?.startTime) {
          setStage(stage + 1);
          setCountdown(data.answer?.startTime + 1000 * 60 * 8);
        }
      },
    }
  );

  const isLast = questionNo === questions[partIndex].length;

  const { data, isLoading } = useAnswerQuery(
    dataSource,
    {
      questionId,
    },
    {
      enabled: stage === Stage.Part1Main || stage === Stage.Part2Main,
    }
  );

  const {
    data: answers,
    isLoading: isLoadingAnswers,
    refetch,
  } = useAnswersQuery(
    dataSource,
    {
      questionId: `${partId}.`,
    },
    {
      enabled: isLast,
    }
  );

  const disableGoNext =
    isLast && (isLoadingAnswers || answers?.answers?.length !== totalNum);

  const onChange = async (value: string) => {
    if (value !== data?.answer?.answer) {
      await submitAnswer({
        input: {
          questionId,
          answer: value,
        },
      }).then(() => {
        if (isLast) {
          refetch();
        }
      });
    }
    if (!disableGoNext) {
      goNext();
    }
  };

  const goBack = () => {
    if (questionIndex === 0) {
      setPartNo(partNo - 1);
      setQuestionNo(questions[partIndex - 1].length);
    } else {
      setQuestionNo(questionNo - 1);
    }
  };

  const goNext = () => {
    if (isLast) {
      setStage(stage + 1);
    } else {
      setQuestionNo(questionNo + 1);
    }
  };

  const { mutateAsync: submitUnit } = useSubmitAnswerMutation(getDataSource());

  const onStart = async () => {
    await submitUnit({
      input: {
        questionId: partId,
        startTime: Date.now(),
      },
    }).then(() => {
      refetchPartData();
    });
  };

  const disableBack =
    !!partData?.answer?.endTime || (!!countdown && countdown < Date.now());

  const onEnd = async () => {
    if (!disableBack) {
      await submitUnit({
        input: {
          questionId: partId,
          endTime: Date.now(),
        },
      });
    }
    if (stage === Stage.Mid) {
      setStage(stage + 1);
      setPartNo(2);
      setQuestionNo(1);
      await submitUnit({
        input: {
          questionId: `${unitId}.2`,
          startTime: Date.now(),
        },
      }).then(() => refetchPartData());
    } else {
      router.push(`/section/${sectionNo}/unit/${unitNo + 1}`);
    }
    localStorage.removeItem("activeQuestionId");
  };

  const onFinish = async () => {
    await submitUnit({
      input: {
        questionId: partId,
        endTime: Date.now(),
      },
    }).then(async () => {
      if (partNo === 1) {
        setPartNo(partNo + 1);
        setQuestionNo(1);
        setStage(Stage.Mid);
      } else {
        setStage(Stage.End);
      }
      localStorage.removeItem("activeQuestionId");
    });
  };

  return (
    <div className="flex flex-col h-screen bg-primary-200">
      <Header title={overview.title}>
        {!!countdown ? (
          <Countdown
            value={countdown}
            format="m:ss"
            className="leading-8 !text-xl"
            onFinish={onFinish}
          />
        ) : (
          <></>
        )}
        <Image src="/countdown.png" alt="user" width="32" height="32" />
      </Header>
      {isLoadingUnit ? (
        <Loading />
      ) : stage === Stage.Intro ? (
        <Overview {...overview} onClick={() => setStage(Stage.Part1Intro)} />
      ) : stage === Stage.Part1Intro ? (
        <Overview {...overview1} onClick={onStart} />
      ) : stage === Stage.Part2Intro ? (
        <Overview {...overview2} onClick={onStart} />
      ) : (
        <>
          <Progress
            currentIndex={
              stage !== Stage.End ? partIndex : questions.length - 1
            }
            currentPercent={
              stage !== Stage.End
                ? questionIndex / questions[partIndex].length
                : 1
            }
            titles={["表格分析", "图形分析"]}
          />
          {stage === Stage.Part1Main || stage === Stage.Part2Main ? (
            <div className="grow flex gap-10 px-10 items-center bg-primary-200">
              <Button
                shape="circle"
                size="large"
                icon={<ArrowLeft size={36} />}
                onClick={goBack}
                disabled={questionIndex === 0}
              />
              <div className="grow w-3/5 h-[calc(100%-80px)] p-20 py-10 bg-white">
                {isLoading ? (
                  <Loading />
                ) : (
                  <>
                    {stage === Stage.Part1Main ? (
                      <div>
                        根据下表，回答1—5题。
                        <img
                          src="https://carerer-planning.oss-cn-shanghai.aliyuncs.com/q103.png"
                          className="block w-96 mt-4"
                        />
                      </div>
                    ) : (
                      <div>
                        根据下表，回答6—10题。
                        <img
                          src="https://carerer-planning.oss-cn-shanghai.aliyuncs.com/q108.png"
                          className="block w-96 mt-4"
                        />
                      </div>
                    )}
                    <RadioForm
                      name={questionId}
                      defaultValue={data?.answer?.answer}
                      question={questions[partIndex][questionIndex]}
                      onChange={onChange}
                    />
                  </>
                )}
              </div>
              <Button
                shape="circle"
                size="large"
                icon={<ArrowRight size={36} />}
                onClick={goNext}
                disabled={disableGoNext}
              />
            </div>
          ) : (
            <UnitEnd
              disableBack={disableBack}
              goBack={() => setStage(stage - 1)}
              goNext={onEnd}
            />
          )}
        </>
      )}
    </div>
  );
}

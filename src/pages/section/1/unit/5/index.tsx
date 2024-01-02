import { useRouter } from "next/router";
import {
  useAnswerQuery,
  useSubmitAnswerMutation,
} from "@/graphql/generated/graphql";
import { getDataSource } from "@/graphql/queryClient";
import { useMemo, useState } from "react";
import Image from "next/image";
import questions from "./index.json";
import RadioForm from "@/components/RadioForm";
import Header from "@/components/Layout/Header";
import Progress from "@/components/Progress";
import Loading from "@/components/Loading";
import Overview from "@/components/Overview";
import UnitEnd from "@/components/UnitEnd";
import Countdown from "antd/lib/statistic/Countdown";
import { getCountdown } from "@/utils";
import { Stage } from "@/types";

const sectionNo = 1;
const unitNo = 5;
const unitId = `${sectionNo}.${unitNo}`;
const overview = {
  title: "信息检索与归纳能力",
  description:
    "信息检索与归纳能力是指对给定的资料的全部或部分内容，观点或问题进行分析和归纳，多角度的思考资料内容，做出合理的推断或评价的能力。<br/><br/>测试提示：信息检索与归纳能力测验包括表格分析和图形分析2个模块，每个模块限时8分钟，共10题。答对一题得一分，答错不计分。请您<strong>尽快</strong>做答。下面开始测试。",
  audioUrl: "https://carerer-planning.oss-cn-shanghai.aliyuncs.com/1-5.mp3",
};
const overview1 = {
  title: "表格分析",
  description:
    "<strong>指导语</strong>：这是信息检索与归纳能力测验的第一段测验。<br/><br/>您将在电脑界面上回答一系列问题，屏幕只会呈现一道题，确认选项后将会自动进入下一题，右下角为答题卡，点击数字可进入相应题目。请尽力在8分钟内完成，8分钟后将直接入下一段测验。如果时间充裕，你也可以选择提交答题卡，提前进入下一段测验。<br/><br/>现在，请开始测验，按照界面上的指示进行作答。",
  audioUrl: "https://carerer-planning.oss-cn-shanghai.aliyuncs.com/1-5-1.mp3",
};
const overview2 = {
  title: "图形分析",
  description:
    "<strong>指导语</strong>：这是信息检索与归纳能力的第二段测验。<br/><br/>您将在电脑界面上回答一系列问题，屏幕只会呈现一道题，确认选项后将会自动进入下一题，右下角为答题卡，点击数字可进入相应题目。请尽力在8分钟内完成，8分钟后将直接入下一段测验。如果时间充裕，你也可以选择提交答题卡，提前进入下一段测验。<br/><br/>现在，请开始测验，按照界面上的指示进行作答。",
  audioUrl: "https://carerer-planning.oss-cn-shanghai.aliyuncs.com/1-5-2.mp3",
};

const countdownDuration = 1000 * 60 * 8;

export default function Index() {
  const router = useRouter();
  const dataSource = getDataSource();

  const [partNo, setPartNo] = useState(1);
  const [stage, setStage] = useState(Stage.Intro);
  const [questionNo, setQuestionNo] = useState(1);
  const [time, setTime] = useState(Date.now());
  const [countdown, setCountdown] = useState<number>(
    Date.now() + countdownDuration
  );
  const { mutateAsync: submitAnswer } = useSubmitAnswerMutation(dataSource);

  const partIndex = useMemo(() => partNo - 1, [partNo]);
  const questionIndex = useMemo(() => questionNo - 1, [questionNo]);
  const partId = `${unitId}.${partNo}`;
  const questionId = `${partId}.${questionNo}`;

  const { isLoading } = useAnswerQuery(
    dataSource,
    {
      questionId: partId,
    },
    {
      onSuccess(data) {
        if (data?.answer?.startTime) {
          setCountdown(data.answer?.startTime + countdownDuration);
        }
      },
    }
  );

  const isLast = questionNo === questions[partIndex].length;

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
    }
    setQuestionNo(questionNo + 1);
  };

  const { mutateAsync } = useSubmitAnswerMutation(getDataSource());

  const onStart = async (qId: string) => {
    const currentTime = Date.now();
    await mutateAsync({
      input: {
        questionId: qId,
        startTime: currentTime,
      },
    }).then((data) => {
      setCountdown(
        (data.submitAnswer?.startTime || currentTime) + countdownDuration
      );
      setStage(Stage.Question);
      setTime(currentTime);
    });
  };

  const onEnd = async () => {
    if (partNo === 1) {
      setStage(Stage.PartIntro);
      setPartNo(2);
      setQuestionNo(1);
    } else {
      router.push(`${unitNo + 1}`);
    }
  };

  const onFinish = async () => {
    if (partNo === 1) {
      setPartNo(partNo + 1);
      setQuestionNo(1);
      setStage(Stage.PartIntro);
    } else {
      setStage(Stage.End);
    }
  };

  const notIntroStage = stage !== Stage.Intro && stage !== Stage.PartIntro;
  return (
    <div className="flex flex-col h-screen bg-primary-200">
      <Header title="信息检索与归纳能力">
        <>
          {!isLoading &&
            notIntroStage &&
            (stage === Stage.End ? (
              <div className="leading-8 text-[28px]">
                {getCountdown(countdown - Date.now())}
              </div>
            ) : (
              !!countdown && (
                <Countdown
                  value={countdown}
                  format="m:ss"
                  className="leading-8"
                  onFinish={onFinish}
                />
              )
            ))}
        </>
        <Image src="/countdown.png" alt="user" width="32" height="32" />
      </Header>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {stage === Stage.Intro && (
            <Overview {...overview} onClick={() => setStage(Stage.PartIntro)} />
          )}
          {notIntroStage && (
            <Progress
              currentIndex={partIndex}
              currentPercent={questionIndex / questions[partIndex].length}
              titles={["表格分析", "图形分析"]}
            />
          )}
          {stage === Stage.PartIntro && partNo === 1 && (
            <Overview {...overview1} onClick={() => onStart(partId)} />
          )}
          {stage === Stage.PartIntro && partNo === 2 && (
            <Overview {...overview2} onClick={() => onStart(partId)} />
          )}

          {stage === Stage.Question && (
            <div className="grow flex gap-10 px-10 items-center bg-primary-200">
              <div className="grow w-3/5 h-[calc(100%-80px)] p-20 py-10 bg-white">
                {isLoading ? (
                  <Loading />
                ) : (
                  <div className="flex justify-around gap-4">
                    <div className="basis-1/2">
                      {partNo === 1 ? (
                        <div>
                          根据下表，回答1—5题。
                          <img
                            src="https://carerer-planning.oss-cn-shanghai.aliyuncs.com/1-5-1.png"
                            className="block w-full mt-4"
                          />
                        </div>
                      ) : (
                        <div>
                          根据下表，回答6—10题。
                          <img
                            src="https://carerer-planning.oss-cn-shanghai.aliyuncs.com/q108.png"
                            className="block w-full mt-4"
                          />
                        </div>
                      )}
                    </div>
                    <div className="basis-1/2">
                      <RadioForm
                        name={questionId}
                        question={questions[partIndex][questionIndex]}
                        onChange={onChange}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          {stage === Stage.End && <UnitEnd goNext={onEnd} />}
        </>
      )}
    </div>
  );
}

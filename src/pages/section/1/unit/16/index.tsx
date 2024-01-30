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
import { Stage } from "@/types";
import Loading from "@/components/Loading";
import Overview from "@/components/Overview";
import UnitEnd from "@/components/UnitEnd";
import Countdown from "antd/lib/statistic/Countdown";
import { getCountdown } from "@/utils";

const sectionNo = 1;
const unitId = "P";
const overview = {
  title: "人际交往能力",
  description:
    "人际交往能力是指个体妥善处理组织内外关系的能力，包括与周围环境建立广泛联系、转化能力，以及正确处理上下左右关系的能力。<br/><br/>测试提示：人际交往能力测验包括人际交往礼仪和人际关系能力2个模块，共18道单选题，限时16分钟内完成。",
  audioUrl: "https://career-planning-app.oss-cn-beijing.aliyuncs.com/1-16.mp3",
};

const overview1 = {
  title: "人际交往礼仪",
  description:
    "<strong>指导语</strong>：这是人际交往能力测验的第一段测验。<br/><br/>您将在电脑界面上回答一系列问题，屏幕只会呈现一道题，确认选项后将会自动进入下一题，右下角为答题卡，点击数字可进入相应题目。请尽力在8分钟内完成，8分钟后将直接入下一段测验。如果时间充裕，你也可以选择提交答题卡，提前进入下一段测验。<br/><br/>现在，请开始测验，按照界面上的指示进行作答。",
  audioUrl:
    "https://career-planning-app.oss-cn-beijing.aliyuncs.com/1-16-1.mp3",
};

const overview2 = {
  title: "人际关系能力",
  description:
    "<strong>指导语</strong>：这是人际交往能力测验的第二段测验。<br/><br/>您将在电脑界面上回答一系列问题，屏幕只会呈现一道题，确认选项后将会自动进入下一题，右下角为答题卡，点击数字可进入相应题目。在这一部分中，选项没有正误之分，请不要过多考虑，凭你的真实想法或感受选择。（如果是现实中出现过的情况，则选择自己当时的做法；如果是没有出现过的情况，则设想在该情况下自己最可能做出的决定）<br/><br/>现在，请开始测验，按照界面上的指示进行作答。",
  audioUrl:
    "https://career-planning-app.oss-cn-beijing.aliyuncs.com/1-16-2.mp3",
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
  const partId = `${unitId}${partNo}`;
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
      router.push(`/section/${sectionNo + 1}`);
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
      <Header title={overview.title}>
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
              titles={["人际交往礼仪", "人际关系能力"]}
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
                <RadioForm
                  name={questionId}
                  question={questions[partIndex][questionIndex]}
                  onChange={onChange}
                />
              </div>
            </div>
          )}
          {stage === Stage.End && <UnitEnd goNext={onEnd} />}
        </>
      )}
    </div>
  );
}

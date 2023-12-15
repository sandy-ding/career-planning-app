import { useRouter } from "next/router";
import {
  useAnswerQuery,
  useSubmitAnswerMutation,
} from "@/graphql/generated/graphql";
import { getDataSource } from "@/graphql/queryClient";
import { useState } from "react";
import Image from "next/image";
import Header from "@/components/Layout/Header";
import Progress from "@/components/Progress";
import Loading from "@/components/Loading";
import Overview from "@/components/Overview";
import UnitEnd from "@/components/UnitEnd";
import Countdown from "antd/lib/statistic/Countdown";
import { getCountdown } from "@/utils";
import { Button, Form } from "antd";
import Puzzle from "@/components/Puzzle/Puzzle";

const overview = {
  title: "目标拼图",
  description:
    "这是自然观察能力测验的第三段。<br/><br/>接下来电脑屏幕上会呈现出一副完整的图片，请你仔细观察。之后图片将会被打乱顺序，请你尽可能快地将图片复原。请尽力在10分钟之内完成，10分钟后自动进入下一题。如果时间充裕，可以选择提交，提前进入下一测验。<br/><br/>现在请先开始练习，练习完成后开始正式测验。",
};

enum Stage {
  Intro,
  Test,
  Mid,
  Main,
  End,
}

const sectionNo = 1;
const unitNo = 9;
const partNo = 3;
const unitId = `${sectionNo}.${unitNo}`;
const partId = `${unitId}.${partNo}`;
const countdownDuration = 1000 * 60 * 10;
const totalNum = 3;

export default function Index() {
  const router = useRouter();
  const [questionNo, setQuestionNo] = useState(0);
  const { mutateAsync } = useSubmitAnswerMutation(getDataSource());

  const [stage, setStage] = useState<Stage>(Stage.Intro);
  const [time, setTime] = useState(Date.now());
  const [countdown, setCountdown] = useState<number>(0);
  const questionId = `${partId}.${questionNo}`;

  const [showImage, setShowImage] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [answer, setAnswer] = useState([]);

  const isTest = stage === Stage.Test;
  const { mutate } = useSubmitAnswerMutation(getDataSource());

  const dataSource = getDataSource();
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

  const onSubmit = () => {
    if (isTest) {
      setStage(Stage.Main);
    } else {
      const currentTime = Date.now();
      mutate({
        input: {
          questionId,
          duration: currentTime - time,
          answer: JSON.stringify(answer),
        },
      });
    }
    if (questionNo !== totalNum) {
      startTest();
    } else {
      setStage(Stage.End);
    }
    setQuestionNo(questionNo + 1);
  };

  const startTest = () => {
    setShowImage(true);
    setShowButton(false);
    setTimeout(() => {
      setShowImage(false);
      setTime(Date.now());
      setCountdown(Date.now() + countdownDuration);
    }, 5000);
  };

  const onStart = async () => {
    const currentTime = Date.now();
    await mutateAsync({
      input: {
        questionId: partId,
        startTime: currentTime,
      },
    }).then((data) =>
      setCountdown(
        (data?.submitAnswer?.startTime || currentTime) +
          countdownDuration +
          5000
      )
    );
    setStage(Stage.Test);
    startTest();
  };

  return (
    <div className="flex flex-col h-screen bg-primary-200">
      <Header title="自然观察能力">
        <>
          {!isLoading &&
            stage !== Stage.Intro &&
            !showImage &&
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
                  onFinish={() => {
                    mutateAsync({
                      input: {
                        questionId,
                        duration: Date.now() - time,
                        answer: JSON.stringify(answer),
                      },
                    });
                    setStage(Stage.End);
                  }}
                />
              )
            ))}
        </>
        <Image src="/countdown.png" alt="user" width="32" height="32" />
      </Header>
      {isLoading ? (
        <Loading />
      ) : stage === Stage.Intro ? (
        <Overview {...overview} onClick={onStart} />
      ) : (
        <>
          <Progress
            currentIndex={partNo - 1}
            currentPercent={
              stage === Stage.Main ? (questionNo - 1) / totalNum : 1
            }
            titles={["目标搜索", "目标比较", "目标拼图"]}
          />
          {stage !== Stage.End ? (
            <div className="grow flex gap-10 px-10 items-center bg-primary-200">
              <div className="grow w-3/5 h-[calc(100%-80px)] p-20 py-10 bg-white">
                <Form
                  name="basic"
                  autoComplete="off"
                  layout="vertical"
                  requiredMark={false}
                  className="flex flex-col justify-between h-full"
                >
                  <Form.Item
                    label={
                      <label className="contents">
                        {isTest ? "练习题: " : `${questionNo}．`}
                        请你尽可能快地将图片复原。
                      </label>
                    }
                  >
                    <div>
                      {showImage ? (
                        <div className="flex justify-center">
                          <img
                            width={400}
                            height={400}
                            src={`https://carerer-planning.oss-cn-shanghai.aliyuncs.com/q139-${questionNo}.png`}
                          />
                        </div>
                      ) : (
                        <>
                          <div className="flex flex-col items-center">
                            <Puzzle
                              image={`https://carerer-planning.oss-cn-shanghai.aliyuncs.com/q139-${questionNo}.png`}
                              width={400}
                              height={400}
                              pieces={questionNo === 3 ? 4 : 3}
                              onComplete={() => setShowButton(true)}
                              onDrop={setAnswer}
                            />
                            {showButton && (
                              <Button
                                size="large"
                                shape="round"
                                className="mt-4"
                                onClick={onSubmit}
                              >
                                {isTest ? "开始测试" : "提交"}
                              </Button>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </Form.Item>
                </Form>
              </div>
            </div>
          ) : (
            <UnitEnd
              goNext={() =>
                router.push(`/section/${sectionNo}/unit/${unitNo + 1}`)
              }
            />
          )}
        </>
      )}
    </div>
  );
}

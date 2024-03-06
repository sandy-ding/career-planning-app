import { useRouter } from "next/router";
import { useSubmitAnswerMutation } from "@/graphql/generated/graphql";
import { getDataSource } from "@/graphql/queryClient";
import { useEffect, useState } from "react";
import Header from "@/components/Layout/Header";
import Progress from "@/components/Progress";
import Overview from "@/components/Overview";
import UnitEnd from "@/components/UnitEnd";
import { Button } from "antd";
import Maze from "@/components/Maze";
import Countdown from "antd/lib/statistic/Countdown";
import Image from "next/image";

const sectionNo = 1;
const unitNo = 11;
const partNo = 1;
const unitId = "K";
const partId = `${unitId}${partNo}`;

const overview = {
  title: "迷宫",
  description:
    "<strong>指导语</strong>：屏幕中央将出现一个迷宫，此刻你正处于迷宫的入口，你需要尽快穿越迷宫到达插有旗帜的地方。注意尽量不要撞到任何墙壁，否则你将等待3秒才能复活继续游戏。我们的按键采用反向按键，即按“←”键表示向右走，按“→”键表示向左走，按“↑”键表示向下走，按“↓”键表示向上走！测试分练习和正式2部分，练习结束后点击“开始”按钮，进行正式测验。<br/><br/>下面点击“练习”，开始练习吧。",
  audioUrl:
    "https://career-planning-app.oss-cn-beijing.aliyuncs.com/1-11-1.mp3",
};

const mazes = [
  {
    imgSrc: "/1-11-1.png",
    startX: 18,
    startY: 78,
    goalX: 460,
    goalY: 37,
    goalWidth: 40,
    goalHeight: 77,
    isTest: true,
    moveSpeed: 1,
    moverSize: 6,
    preTime: 3000,
    diagonalMove: false,
  },
  {
    imgSrc: "/1-11-2.png",
    startX: 9,
    startY: 340,
    goalX: 392,
    goalY: 70,
    goalWidth: 32,
    goalHeight: 32,
    isTest: false,
    moveSpeed: 1,
    moverSize: 4,
    preTime: 5000,
    diagonalMove: false,
  },
];

enum Stage {
  Intro,
  Test,
  Mid,
  Main,
  End,
}

export default function Index() {
  const router = useRouter();
  const [stage, setStage] = useState(Stage.Intro);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [goNext, setGoNext] = useState(false);
  const [time, setTime] = useState(0);
  const [countdown, setCountdown] = useState(0);

  const dataSource = getDataSource();
  const { mutateAsync: submitAnswer } = useSubmitAnswerMutation(dataSource);

  useEffect(() => {
    setTimeout(() => setGoNext(true), 10 * 1000);
  }, []);

  const startTest = () => {
    setGoNext(false);
    setQuestionIndex(questionIndex + 1);
    setTimeout(() => setGoNext(true), 1000 * 15);
  };

  const onWin = () => {
    setGoNext(true);
    if (!mazes[questionIndex].isTest) {
      submitAnswer({
        input: {
          questionId: `${unitId}.${partNo}`,
          answer: "T",
          duration: Date.now() - time,
        },
      });
    }
  };

  const onSubmit = () => {
    if (mazes[questionIndex].isTest) {
      setStage(Stage.Mid);
    } else {
      submitAnswer({
        input: {
          questionId: `${unitId}.${partNo}`,
          answer: "F",
          duration: Date.now() - time,
        },
      });
      setStage(Stage.End);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-primary-200">
      <Header title="运动协调能力">
        {countdown !== 0 ? (
          <Countdown
            value={countdown}
            format="m:ss"
            className="leading-8 !text-xl"
          />
        ) : (
          <></>
        )}
        <Image src="/countdown.png" alt="user" width="32" height="32" />
      </Header>
      {stage === Stage.Intro ? (
        <Overview
          {...overview}
          btnText="练习"
          onClick={() => {
            setStage(Stage.Test);
            setCountdown(Date.now() + 3 * 1000);
          }}
        />
      ) : (
        <>
          <Progress currentIndex={0} currentPercent={0} titles={[""]} />
          {stage !== Stage.End ? (
            <div className="grow flex gap-10 px-10 items-center bg-primary-200">
              <div className="grow w-3/5 h-[calc(100%-80px)] p-20 py-10 bg-white">
                <div className="flex flex-col justify-between">
                  <label className="w-full text-center">
                    {stage === Stage.Test && "练习题"}
                  </label>
                  {stage === Stage.Mid ? (
                    <div className="mt-40">
                      <div className="text-center text-primary-700">
                        现在你将进入正式测验，点击“开始测试”按钮开始吧！
                      </div>
                      <div className="mt-40 flex justify-center">
                        <Button
                          size="large"
                          shape="round"
                          onClick={() => {
                            setStage(Stage.Main);
                            startTest();
                            setTime(Date.now() + 5 * 1000);
                            setCountdown(Date.now() + 5 * 1000);
                          }}
                        >
                          开始测试
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-center items-center my-8">
                        <Maze {...mazes[questionIndex]} onSuccess={onWin} />
                      </div>
                    </>
                  )}
                </div>
                {stage !== Stage.Mid && (
                  <>
                    <div className="w-full text-primary-700 text-center text-[22px]">
                      按键采用反向按键，即按“←”键表示向右走，按“→”键表示向左走，按“↑”键表示向下走，按“↓”键表示向上走！
                    </div>
                    {goNext && (
                      <div className="mt-4 flex justify-center">
                        <Button size="large" shape="round" onClick={onSubmit}>
                          提交
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ) : (
            <UnitEnd goNext={() => router.push(`${partNo + 1}`)} />
          )}
        </>
      )}
    </div>
  );
}

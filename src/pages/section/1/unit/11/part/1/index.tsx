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

const sectionNo = 1;
const unitNo = 11;
const partNo = 1;
const unitId = "K";
const partId = `${unitId}${partNo}`;

const overview = {
  title: "迷宫",
  description:
    "<strong>指导语</strong>：屏幕中央会出现一个方形或者圆形的迷宫，此刻你正处于迷宫的入口处，你需要尽快穿越迷宫到达插有旗帜的目的地，注意尽量不要撞到任何墙壁，否则你将等待3秒才能复活继续游戏。测试分练习和正式2部分，练习结束后点击“开始”按钮，进行正式测验。下面点击“练习”，开始练习吧。",
  audioUrl:
    "https://career-planning-app.oss-cn-beijing.aliyuncs.com/1-11-1.mp3",
};

const mazes = [
  {
    imgSrc: "/1-11-1.png",
    startX: 9,
    startY: 340,
    goalX: 392,
    goalY: 70,
    goalWidth: 32,
    goalHeight: 32,
    isTest: true,
    moveSpeed: 0.8,
    moverSize: 4,
    diagonalMove: false,
  },
  {
    imgSrc: "/1-11-2.png",
    startX: 6,
    startY: 19,
    goalX: 448,
    goalY: 448,
    goalWidth: 23,
    goalHeight: 23,
    isTest: false,
    moveSpeed: 1,
    moverSize: 4,
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

  const dataSource = getDataSource();
  const { mutateAsync: submitAnswer } = useSubmitAnswerMutation(dataSource);

  useEffect(() => {
    setTimeout(() => setGoNext(true), 10 * 1000);
  }, []);

  const startTest = () => {
    setGoNext(false);
    setQuestionIndex(questionIndex + 1);
    setTimeout(() => setGoNext(true), 1000 * 10);
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
      <Header title="运动协调能力" />
      {stage === Stage.Intro ? (
        <Overview
          {...overview}
          btnText="练习"
          onClick={() => setStage(Stage.Test)}
        />
      ) : (
        <>
          <Progress
            currentIndex={0}
            currentPercent={stage === Stage.End ? 1 : 0}
            titles={["直线运动", "曲线运动"]}
          />
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
                            setTime(Date.now());
                          }}
                        >
                          开始测试
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-center items-center my-10">
                        <Maze {...mazes[questionIndex]} onSuccess={onWin} />
                      </div>
                    </>
                  )}
                </div>
                {stage !== Stage.Mid && (
                  <>
                    <div className="w-full text-primary-700 text-center text-[22px]">
                      请按上下左右方向键移动。
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

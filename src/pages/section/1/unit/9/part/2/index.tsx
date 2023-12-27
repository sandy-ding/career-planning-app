import { useRouter } from "next/router";
import {
  useAnswerQuery,
  useSubmitAnswerMutation,
} from "@/graphql/generated/graphql";
import { getDataSource } from "@/graphql/queryClient";
import { useEffect, useState } from "react";
import Header from "@/components/Layout/Header";
import Progress from "@/components/Progress";
import Overview from "@/components/Overview";
import UnitEnd from "@/components/UnitEnd";
import { Button, Form } from "antd";
import Countdown from "antd/lib/statistic/Countdown";
import areas from "./areas.json";
import ImageMapper, {
  AreaEvent,
  MapAreas,
} from "@/components/ImageMapper/ImageMapper";
import { getCountdown } from "@/utils";
import Image from "next/image";

enum Stage {
  Intro,
  Main,
  End,
}

const sectionNo = 1;
const unitNo = 9;
const partNo = 2;
const unitId = `${sectionNo}.${unitNo}`;
const partId = `${unitId}.${partNo}`;

const overview = {
  title: "目标比较",
  description:
    "<strong>指导语</strong>：这是自然观察能力测验的第二段。<br/><br/>接下来电脑屏幕上会呈现出两副图片，你可以通过鼠标点击两副图片中的不同之处进行选择，一共有10处不同，请尽力在10分钟之内完成，10分钟后自动进入下一题。如果时间充裕，可以选择提交，提前进入下一测验。<br/><br/>现在，请开始测验。",
  audioUrl: "https://carerer-planning.oss-cn-shanghai.aliyuncs.com/1-9-2.mp3",
};

const countdownDuration = 1000 * 60 * 10;

export default function Idex() {
  const router = useRouter();
  const [stage, setStage] = useState(Stage.Intro);
  const [time, setTime] = useState(0);
  const [showBtn, setShowBtn] = useState(false);

  const questionId = `${partId}.${1}`;
  const [answer, setAnswer] = useState<string[]>([]);
  const [countdown, setCountdown] = useState(0);

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

  const { mutate, mutateAsync } = useSubmitAnswerMutation(dataSource);

  const onSubmit = () => {
    mutate({
      input: {
        questionId,
        duration: Date.now() - time,
        answer: JSON.stringify(answer),
      },
    });
    setStage(Stage.End);
  };

  useEffect(() => {
    setTimeout(() => {
      setShowBtn(true);
    }, 1000 * 10);
  }, []);

  const onClick = (
    area: any,
    index: number,
    e: AreaEvent,
    updatedAreas: MapAreas[]
  ) => {
    setAnswer(
      updatedAreas
        .filter((area) => !!area.preFillColor && area.name.startsWith("right"))
        .map((i) => i.name.split("-")?.[1])
    );
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
        (data?.submitAnswer?.startTime || currentTime) + countdownDuration
      )
    );
    setTime(currentTime);
    setStage(Stage.Main);
  };

  console.log({ stage });
  return (
    <div className="flex flex-col h-screen bg-primary-200">
      <Header title="自然观察能力">
        <>
          {!isLoading &&
            stage !== Stage.Intro &&
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
                  onFinish={onSubmit}
                />
              )
            ))}
        </>
        <Image src="/countdown.png" alt="user" width="32" height="32" />
      </Header>
      {stage === Stage.Intro ? (
        <Overview {...overview} onClick={onStart} />
      ) : (
        <>
          <Progress
            currentIndex={partNo - 1}
            currentPercent={
              stage === Stage.End ? 1 : answer.length / (areas.length / 2)
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
                      <label className="w-full text-center">
                        请你尽可能多的在图片中找出题目要求的各个目标物。
                      </label>
                    }
                  >
                    <div>
                      <div className="flex flex-col items-center my-2 text-primary-700">
                        剩余{areas.length / 2 - answer.length}个目标物
                      </div>
                      <div className="flex justify-center">
                        <ImageMapper
                          src="https://carerer-planning.oss-cn-shanghai.aliyuncs.com/q138.png"
                          map={{ name: "areas", areas }}
                          onClick={onClick}
                          stayMultiHighlighted
                          spotDifference
                        />
                      </div>
                      <div className="flex flex-col items-center text-primary-700 mt-4">
                        {showBtn && (
                          <Button
                            size="large"
                            shape="round"
                            onClick={onSubmit}
                            className="mt-4"
                          >
                            提交
                          </Button>
                        )}
                      </div>
                    </div>
                  </Form.Item>
                </Form>
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

import { useSubmitAnswerMutation } from "@/graphql/generated/graphql";
import { getDataSource } from "@/graphql/queryClient";
import { Button, Form } from "antd";
import { useState } from "react";
import Intro from "@/components/Intro";
import Countdown from "antd/lib/statistic/Countdown";
import areas from "./areas.json";
import ImageMapper, {
  AreaEvent,
  MapAreas,
} from "@/components/ImageMapper/ImageMapper";

const intro = {
  title: "2. 目标比较",
  description:
    "这是自然观察能力测验的第二段。<br/>接下来电脑屏幕上会呈现出两幅图片，请你尽可能地在图片中找出10处不同之处，并用鼠标点击图片对应处。请尽力在10分钟之内完成，10分钟后自动进入下一题。如果时间充裕，可以选择提交，提前进入下一测验。<br/>现在，请开始测验。",
};

enum Stage {
  Intro,
  Main,
}

interface IProps {
  onFinish: () => void;
}

export default function Part2(props: IProps) {
  const [stage, setStage] = useState(Stage.Intro);
  const [answer, setAnswer] = useState<string[]>([]);
  const [countdown, setCountdown] = useState(0);

  const { mutate } = useSubmitAnswerMutation(getDataSource());

  const onSubmit = () => {
    mutate({
      input: {
        questionId: "138",
        time: countdown - Date.now(),
        answer: JSON.stringify(answer),
      },
    });
    props.onFinish();
  };

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

  return stage === Stage.Intro ? (
    <Intro
      {...intro}
      onClick={() => {
        setStage(Stage.Main);
        setCountdown(Date.now() + 1000 * 60 * 10);
      }}
    />
  ) : (
    <>
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
              请你尽可能地在图片中找出10处不同之处。
            </label>
          }
        >
          <div className="mt-20">
            <div className="flex justify-end mt-4 h-10 text-2xl">
              <Countdown
                value={countdown}
                format="m:ss"
                className="float-right"
                onFinish={onSubmit}
              />
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
            <div className="flex flex-col items-center">
              {answer.length === areas.length / 2 && (
                <Button type="primary" className="mt-4" onClick={onSubmit}>
                  提交
                </Button>
              )}
            </div>
          </div>
        </Form.Item>
      </Form>
    </>
  );
}

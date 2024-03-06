import { useEffect, useState } from "react";
import { initMaze } from "./canvas";
import Countdown from "antd/lib/statistic/Countdown";
import classNames from "classnames";

interface IProps {
  imgSrc: string;
  startX: number;
  startY: number;
  goalX: number;
  goalY: number;
  goalWidth: number;
  goalHeight: number;
  moveSpeed?: number;
  moverSize?: number;
  diagonalMove?: boolean;
  preTime: number;
  onSuccess: () => void;
}

const countdownDuration = 1000 * 3;

export default function Maze(props: IProps) {
  const [countdown, setCountdown] = useState<number | undefined>(undefined);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [hasWon, setHasWon] = useState<boolean>(false);
  const [showCanvas, setShowCanvas] = useState<boolean>(true);
  const {
    imgSrc,
    startX,
    startY,
    goalX,
    goalY,
    goalWidth,
    goalHeight,
    moveSpeed,
    diagonalMove,
    moverSize,
    preTime,
    onSuccess,
  } = props;

  useEffect(() => {
    window.addEventListener("collision", () => {
      setCountdown(Date.now() + countdownDuration);
      setTimeout(() => setShowHint(true), countdownDuration);
      setTimeout(() => {
        setCountdown(undefined);
        setShowHint(false);
      }, countdownDuration + 500);
    });
  }, []);

  useEffect(() => {
    setTimeout(() => {
      initMaze("canvas", "source", {
        startX,
        startY,
        goalX,
        goalY,
        goalWidth,
        goalHeight,
        moveSpeed,
        diagonalMove,
        moverSize,
        onWin,
      });
    }, preTime);
  }, []);

  const onWin = () => {
    setShowCanvas(false);
    setHasWon(true);
    onSuccess();
  };

  return (
    <>
      <img
        id="source"
        src={imgSrc}
        className="select-none z-0"
        width="500px"
        height="500px"
      />
      {showCanvas && (
        <canvas
          id="canvas"
          className="select-none absolute z-10 w-[500px] h-[500px]"
          width="500px"
          height="500px"
        ></canvas>
      )}
      {countdown !== undefined ? (
        <div className="absolute z-20 w-[500px] h-[500px] flex justify-center items-center">
          <div className="bg-white w-52 h-40 flex flex-col justify-center items-center border-4 rounded px-4">
            <img src="/face.png" width="72px" height="72px" />
            <div className="w-full text-center text-[22px] text-primary-700">
              <div>复活中</div>
              {!showHint ? (
                <Countdown
                  value={countdown + 1000}
                  format="s"
                  valueStyle={{
                    fontSize: "28px",
                  }}
                />
              ) : (
                <div>按下方向键继续移动</div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
      {hasWon ? (
        <div className="absolute z-20 w-[500px] h-[500px] flex justify-center items-center">
          <div className="bg-white w-52 h-40 flex flex-col justify-center items-center border-4 rounded px-4">
            <img src="/fireworks.png" width="72px" height="72px" />
            <div className="w-full text-center text-[22px] text-primary-700">
              <div>恭喜你</div>
              <div>你已到达终点</div>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}

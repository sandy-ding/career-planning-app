import Countdown from "antd/lib/statistic/Countdown";

interface IProps {
  countdown: number;
  onFinish: () => void;
}

export default function BigCountdown({ countdown, onFinish }: IProps) {
  return (
    <div className="flex justify-center items-center h-full">
      <div className="w-48 h-48 flex justify-center items-center rounded-full border border-4">
        <Countdown
          value={countdown}
          format="s"
          className="leading-8"
          onFinish={onFinish}
          valueStyle={{
            fontSize: "72px",
          }}
        />
      </div>
    </div>
  );
}

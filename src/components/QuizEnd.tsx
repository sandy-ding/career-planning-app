import { Button } from "antd";

interface IProps {
  disableBack?: boolean;
  goBack: () => void;
  goNext: () => void;
}

export default function QuizEnd({ disableBack, goBack, goNext }: IProps) {
  return (
    <div className="grow flex flex-col gap-10 px-10 justify-evenly items-center bg-primary-200">
      <div className="w-3/5 p-20 py-10 bg-white text-center leading-8 rounded-lg text-primary-700 text-lg">
        恭喜您完成了全部测试！！！
      </div>
      <div className="flex gap-4">
        {!disableBack && (
          <Button
            size="large"
            type="text"
            className="!text-primary-700"
            onClick={goBack}
          >
            返回
          </Button>
        )}
        <Button size="large" onClick={goNext}>
          查看结果
        </Button>
      </div>
    </div>
  );
}

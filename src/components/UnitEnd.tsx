import { Button } from "antd";

interface IProps {
  goNext: () => void;
}

export default function UnitEnd({ goNext }: IProps) {
  return (
    <div className="grow flex flex-col gap-10 px-10 justify-evenly items-center bg-primary-200">
      <div className="flex justify-bewtween items-center w-3/5 p-20 py-10 bg-white text-center leading-8 rounded-lg text-primary-700 text-lg">
        <img src="/party.png" className="w-16 h-16" />
        <div className="grow">
          您已经完成了该模块所有问题
          <br />
          接下来，我们将进入下一个模块！
        </div>
        <div className="w-16 h-16" />
      </div>
      <div className="flex">
        <Button size="large" onClick={goNext}>
          继续
        </Button>
      </div>
    </div>
  );
}

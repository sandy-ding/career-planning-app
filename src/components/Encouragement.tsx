import { Button } from "antd";

interface IProps {
  index: number;
  onClick: () => void;
}

const texts = [
  {
    line1: "您真棒！刚才的题目有难度哦！",
    line2: "继续加油！",
  },
  {
    line1: "加油！坚持就是胜利！",
    line2: "马上就可以揭晓谜底了！",
  },
  {
    line1: "厉害了！您现在处于领先水平！",
    line2: "继续加油！",
  },
  {
    line1: "您真棒！刚才的题目有难度哦！",
    line2: "继续加油！",
  },
  {
    line1: "最后几道题了，再坚持一下！",
    line2: "加油！",
  },
];

export default function Encouragement({ index, onClick }: IProps) {
  return (
    <div className="grow flex flex-col gap-10 px-10 justify-evenly items-center bg-primary-200">
      <div className="flex justify-bewtween items-center w-3/5 p-20 py-10 bg-white text-center leading-8 rounded-lg text-primary-700 text-lg">
        <img src={`/smile-${index}.png`} className="w-16 h-16" />
        <div className="grow">
          {texts[index % 5].line1}
          <br />
          {texts[index % 5].line2}
        </div>
        <div className="w-16 h-16" />
      </div>
      <div className="flex gap-4">
        <Button size="large" onClick={onClick}>
          继续
        </Button>
      </div>
    </div>
  );
}

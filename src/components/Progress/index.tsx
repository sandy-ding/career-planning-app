interface IProgressItemProps {
  title?: string;
  percent: number;
}

const ProgressItem = ({ title, percent }: IProgressItemProps) => {
  return (
    <div className="relative flex-1 h-8">
      <div
        className="absolute w-full h-full bg-primary-700"
        style={{ clipPath: `inset(0 ${(1 - percent) * 100}% 0 0)` }}
      ></div>
      <div className="absolute w-full h-full text-center text-white leading-8">
        {title}
      </div>
    </div>
  );
};

export default function Progress({
  titles,
  currentIndex,
  currentPercent,
  isDone,
}: {
  currentIndex: number;
  currentPercent: number;
  titles: string[];
  isDone?: boolean;
}) {
  return (
    <div className="sticky top-14 z-50 flex w-full justify-items-stretch bg-gray-400">
      {titles.map((title, index) => (
        <ProgressItem
          key={index}
          title={title}
          percent={
            isDone || index < currentIndex
              ? 1
              : index === currentIndex
              ? currentPercent
              : 0
          }
        />
      ))}
    </div>
  );
}

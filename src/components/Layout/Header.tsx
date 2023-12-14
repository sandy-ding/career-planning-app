import Image from "next/image";
import { ReactElement } from "react";

interface IProps {
  title?: string;
  children?: ReactElement[];
}

export default function Header({ title, children }: IProps) {
  return (
    <div className="sticky top-0 z-50 w-full border-b bg-white text-primary-700">
      <div className="px-8 flex h-14 items-center justify-between">
        <div className="mr-4 flex">
          <div className="mr-6 flex items-center space-x-2">
            <Image src="/logo.png" alt="me" width="32" height="32" />
            <div className="text-[#1A4FA3]">{title}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">{children}</div>
      </div>
    </div>
  );
}

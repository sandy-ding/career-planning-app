import { GraduationCap, UserCircle } from "lucide-react";

export default function Header() {
  return (
    <div className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="px-8 flex h-14 items-center justify-between">
        <div className="mr-4 hidden md:flex">
          <div className="mr-6 flex items-center space-x-2">
            <GraduationCap />
            <div>生涯发展测试</div>
          </div>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <UserCircle />
        </div>
      </div>
    </div>
  );
}

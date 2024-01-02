import { useRouter } from "next/router";
import Header from "@/components/Layout/Header";
import Profile from "@/components/Profile";

export default function Question() {
  const router = useRouter();
  return (
    <div className="flex flex-col h-screen bg-primary-200">
      <Header title="职业生涯测试" />
      <div className="grow flex gap-10 px-10 bg-primary-200">
        <div className="m-autobg-white px-20 py-12 rounded-lg">
          <Profile />
        </div>
      </div>
    </div>
  );
}

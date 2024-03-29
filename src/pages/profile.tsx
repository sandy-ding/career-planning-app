import Header from "@/components/Layout/Header";
import Profile from "@/features/Profile";

export default function Index() {
  return (
    <div className="flex flex-col h-screen bg-primary-200">
      <Header title="职业生涯测试" />
      <Profile />
    </div>
  );
}

import Header from "@/components/Layout/Header";
import AdminManagement from "@/features/AdminManagement";

export default function Index() {
  return (
    <div className="flex flex-col h-screen bg-primary-200">
      <Header title="后台管理" />
      {/* <AdminManagement /> */}
    </div>
  );
}

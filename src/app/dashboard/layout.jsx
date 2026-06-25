import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { userinfo } from "@/lib/core/userinfo";

const DashboardLayout = async ({ children }) => {
  const user = await userinfo();
  const role = user?.role || "donor";

  return (
    <div className="w-full flex flex-col lg:flex-row min-h-screen" style={{ background: "#F8FAFC" }}>
      <DashboardSidebar role={role} />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">{children}</main>
    </div>
  );
};

export default DashboardLayout;

import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { userinfo } from "@/lib/core/userinfo";

const DashboardLayout = async ({ children }) => {
  const user = await userinfo();        // server-side: logged-in user
  const role = user?.role || "donor";   // role ber kora

  return (
    <div className="  w-full flex flex-col lg:flex-row min-h-screen bg-[#F4F6F9]">
      <DashboardSidebar role={role} />
      <main className="flex-1 p-5 sm:p-8">{children}</main>
    </div>
  );
}; 

export default DashboardLayout;
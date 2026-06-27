import Overview from "@/components/Overview";
import { userinfo } from "@/lib/core/userinfo";

export default async function AdminHomePage() {
  const user = await userinfo();
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
     
      <div className="mb-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-xl shrink-0"
          style={{ background: "linear-gradient(135deg, #E0173C 0%, #C20E32 100%)" }}>
          {user?.name?.charAt(0).toUpperCase() || "A"}
        </div>
        <div>
          <h1 className="text-[22px] font-black text-gray-800 tracking-tight">
            Welcome back, <span style={{ color: "#E0173C" }}>{user?.name || "Admin"}</span>!
          </h1>
          <p className="text-gray-400 text-[13px] mt-0.5 ">{user?.role || "admin"} · {user?.email}</p>
        </div>
      </div>
      <Overview centered={false} />
    </div>
  );
}

import { MoreVertical } from "lucide-react";
import { revalidatePath } from "next/cache";

async function updateUserAction(userId, formData) {
  "use server";
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const token = cookieStore.get("bloodlink_token")?.value;

  const updateData = {};
  if (formData.has("status")) updateData.status = formData.get("status");
  if (formData.has("role")) updateData.role = formData.get("role");

  await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/update/${userId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updateData),
    },
  );
  revalidatePath("/dashboard/all-users");
}

function UserRow({ user }) {
  const actionWithId = updateUserAction.bind(null, user._id);
  return (
    <>
      <tr className="hidden md:table-row hover:bg-gray-50/80 transition-colors border-b border-gray-100">
        <td className="p-5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden ring-1 ring-gray-100 shrink-0">
            {user.image ? (
              <img
                src={user.image}
                className="w-full h-full object-cover"
                alt={user.name}
              />
            ) : (
              <span className="text-gray-500 font-bold text-lg">
                {user.name?.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <span className="font-bold text-gray-800 text-[14px]">
            {user.name}
          </span>
        </td>
        <td className="p-5 text-[14px] text-gray-600">{user.email}</td>
        <td className="p-5">
          <RoleBadge role={user.role} />
        </td>
        <td className="p-5">
          <StatusBadge status={user.status} />
        </td>
        <td className="p-5 text-right relative">
          <ActionMenu user={user} actionWithId={actionWithId} />
        </td>
      </tr>

      <tr className="md:hidden border-b border-gray-100">
        <td colSpan={5} className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden ring-1 ring-gray-100 shrink-0">
                {user.image ? (
                  <img
                    src={user.image}
                    className="w-full h-full object-cover"
                    alt={user.name}
                  />
                ) : (
                  <span className="text-gray-500 font-bold text-lg">
                    {user.name?.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <p className="font-bold text-gray-800 text-[14px]">
                  {user.name}
                </p>
                <p className="text-[12px] text-gray-400 mt-0.5">{user.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <RoleBadge role={user.role} />
                  <StatusBadge status={user.status} />
                </div>
              </div>
            </div>
            <ActionMenu user={user} actionWithId={actionWithId} />
          </div>
        </td>
      </tr>
    </>
  );
}

function RoleBadge({ role }) {
  return (
    <span
      className={`px-4 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider 
      ${role === "admin" ? "bg-red-100 text-red-600" : role === "volunteer" ? "bg-orange-100 text-orange-600" : "bg-blue-50 text-blue-600"}`}
    >
      {role}
    </span>
  );
}

function StatusBadge({ status }) {
  return (
    <span
      className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase flex items-center gap-1.5 w-fit 
      ${status === "active" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${status === "active" ? "bg-green-500" : "bg-red-500"}`}
      ></span>
      {status}
    </span>
  );
}

function ActionMenu({ user, actionWithId }) {
  return (
    <div className="group inline-block relative">
      <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
        <MoreVertical size={18} />
      </button>
      <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[9999] overflow-hidden">
        <form action={actionWithId}>
          <button
            name="status"
            value={user.status === "active" ? "blocked" : "active"}
            className="w-full text-left px-4 py-3 text-[13px] font-medium text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
          >
            {user.status === "active" ? "Block User" : "Unblock User"}
          </button>
          <button
            name="role"
            value="admin"
            className="w-full text-left px-4 py-3 text-[13px] font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
          >
            Make Admin
          </button>
          <button
            name="role"
            value="volunteer"
            className="w-full text-left px-4 py-3 text-[13px] font-medium text-orange-600 hover:bg-orange-50 flex items-center gap-2 transition-colors"
          >
            Make Volunteer
          </button>
          {user.role !== "donor" && (
            <button
              name="role"
              value="donor"
              className="w-full text-left px-4 py-3 text-[13px] font-medium text-blue-600 hover:bg-blue-50 flex items-center gap-2 transition-colors"
            >
              Make Donor
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

// Pagination — server component এ link-based
function Pagination({ page, totalPages }) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <div className="flex justify-end items-center gap-2 mt-6">
      <a
        href={`?page=${Math.max(1, page - 1)}`}
        className={`w-9 h-9 flex items-center justify-center rounded-lg border-2 border-[#E0173C] text-[#E0173C] font-bold hover:bg-[#E0173C] hover:text-white transition ${page === 1 ? "opacity-30 pointer-events-none" : ""}`}
      >
        ‹
      </a>
      {pages.map((p) => (
        <a
          key={p}
          href={`?page=${p}`}
          className={`w-9 h-9 flex items-center justify-center rounded-lg border-2 text-sm font-bold transition ${
            p === page
              ? "border-[#E0173C] bg-[#E0173C] text-white"
              : "border-[#E0173C] text-[#E0173C] hover:bg-[#E0173C] hover:text-white"
          }`}
        >
          {p}
        </a>
      ))}
      <a
        href={`?page=${Math.min(totalPages, page + 1)}`}
        className={`w-9 h-9 flex items-center justify-center rounded-lg border-2 border-[#E0173C] text-[#E0173C] font-bold hover:bg-[#E0173C] hover:text-white transition ${page === totalPages ? "opacity-30 pointer-events-none" : ""}`}
      >
        ›
      </a>
    </div>
  );
}

import { cookies } from "next/headers";

export default async function AllUsersPage({ searchParams }) {
  const params = await searchParams;
  const page = parseInt(params?.page) || 1;
  const limit = 5;

  const cookieStore = await cookies();
  const token = cookieStore.get("bloodlink_token")?.value;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/users?page=${page}&limit=${limit}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    },
  );
  const data = await res.json();
  const users = Array.isArray(data) ? data : data.users || [];
  const totalPages = data.totalPages || 1;

  console.log(data, "data");

  return (
    <div className="p-4 sm:p-8 bg-[#F8FAFC] min-h-screen">
      <h1 className="text-[24px] sm:text-[32px] font-black tracking-tight text-gray-800 mb-6">
        All <span style={{ color: "#E0173C" }}>Users</span>
      </h1>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-visible">
        <table className="w-full text-left border-collapse">
          <thead className="hidden md:table-header-group">
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="p-5 text-[12px] font-bold text-gray-400 uppercase">
                User
              </th>
              <th className="p-5 text-[12px] font-bold text-gray-400 uppercase">
                Email
              </th>
              <th className="p-5 text-[12px] font-bold text-gray-400 uppercase">
                Role
              </th>
              <th className="p-5 text-[12px] font-bold text-gray-400 uppercase">
                Status
              </th>
              <th className="p-5 text-[12px] font-bold text-gray-400 uppercase text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <UserRow key={user._id} user={user} />
            ))}
          </tbody>
        </table>
      </div>
      <Pagination page={page} totalPages={totalPages} />
    </div>
  );
}

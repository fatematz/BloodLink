"use client";

import React, { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditButton from "../components/EditButton";
import { authClient } from "@/lib/auth-client";

const RED = "#E0173C";

const StatusBadge = ({ status }) => {
  let bg = "bg-amber-50 text-amber-600 border-amber-100";
  let label = "Pending";
  if (status === "inprogress") { bg = "bg-blue-50 text-blue-600 border-blue-100"; label = "In Progress"; }
  else if (status === "done") { bg = "bg-green-50 text-green-600 border-green-100"; label = "Done"; }
  else if (status === "canceled") { bg = "bg-red-50 text-red-600 border-red-100"; label = "Cancelled"; }
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${bg} uppercase`}>
      {label}
    </span>
  );
};

const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <div className="flex justify-end items-center gap-2 mt-6">
      <button onClick={() => onPageChange(page - 1)} disabled={page === 1}
        className="w-9 h-9 flex items-center justify-center rounded-lg border-2 border-[#E0173C] text-[#E0173C] disabled:opacity-30 hover:bg-[#E0173C] hover:text-white transition">
        ‹
      </button>
      {pages.map((p) => (
        <button key={p} onClick={() => onPageChange(p)}
          className={`w-9 h-9 flex items-center justify-center rounded-lg border-2 text-sm font-bold transition ${
            p === page ? "border-[#E0173C] bg-[#E0173C] text-white" : "border-[#E0173C] text-[#E0173C] hover:bg-[#E0173C] hover:text-white"
          }`}>
          {p}
        </button>
      ))}
      <button onClick={() => onPageChange(page + 1)} disabled={page === totalPages}
        className="w-9 h-9 flex items-center justify-center rounded-lg border-2 border-[#E0173C] text-[#E0173C] disabled:opacity-30 hover:bg-[#E0173C] hover:text-white transition">
        ›
      </button>
    </div>
  );
};

export default function ManageDonationRequests() {
  const [requests, setRequests] = useState([]);
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

useEffect(() => {
  const init = async () => {
    const session = await authClient.getSession();
    const email = session?.data?.user?.email;
    if (!email) return;
    const res = await fetch(`http://localhost:5000/api/users/email/${email}`);
    const userData = await res.json();
    setUserRole(userData?.role || "volunteer");
  };
  init();
}, []);

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
       const res = await fetch(
  `http://localhost:5000/api/donation-requests?status=${status}&page=${page}&limit=9`,
  { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
);
        const data = await res.json();
        setRequests(data.requests || []);
        setTotalPages(data.totalPages || 1);
      } catch (error) {
        console.error("Error fetching requests:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, [status, page]);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/donation-requests/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
      if (res.ok) {
        setRequests((prev) => prev.filter((req) => req._id !== id));
        toast.success("Request deleted successfully.");
      } else {
        toast.error("Failed to delete.");
      }
    } catch {
      toast.error("Something went wrong.");
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/donation-requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify({ donationStatus: newStatus }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`Status updated to ${newStatus}!`);
        setRequests((prev) =>
          prev.map((req) => (req._id === id ? { ...req, donationStatus: newStatus } : req))
        );
      } else {
        toast.error(data.message || "Failed to update status");
      }
    } catch {
      toast.error("Something went wrong!");
    }
  };

  const isAdmin = userRole === "admin";

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-gray-200 border-t-[#E0173C] rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAFAFA] p-4 sm:p-10 font-sans">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-[24px] sm:text-[32px] font-black tracking-tight text-gray-800">
          All <span style={{ color: RED }}>Donation Requests</span>
        </h1>
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="w-full sm:w-auto bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-[14px]"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="inprogress">In Progress</option>
          <option value="done">Done</option>
          <option value="canceled">Canceled</option>
        </select>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 bg-[#FDFDFD]">
              <th className="p-4 text-[12px] font-semibold text-gray-400 uppercase">Recipient Info</th>
              <th className="p-4 text-[12px] font-semibold text-gray-400 uppercase">Location</th>
              <th className="p-4 text-[12px] font-semibold text-gray-400 uppercase">Date & Time</th>
              <th className="p-4 text-[12px] font-semibold text-gray-400 uppercase text-center">Group</th>
              <th className="p-4 text-[12px] font-semibold text-gray-400 uppercase">Status</th>
              <th className="p-4 text-[12px] font-semibold text-gray-400 uppercase text-right pr-6">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {requests.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-10 text-center text-gray-400 text-sm">No donation requests found.</td>
              </tr>
            ) : (
              requests.map((req) => (
                <tr key={req._id} className="hover:bg-gray-50/50">
                  <td className="p-4 pl-6 font-medium text-gray-800">{req.recipientName}</td>
                  <td className="p-4 text-gray-600">{req.recipientUpazila}, {req.recipientDistrict}</td>
                  <td className="p-4 text-gray-600">{req.donationDate}</td>
                  <td className="p-4 text-center font-bold" style={{ color: RED }}>{req.bloodGroup}</td>
                  <td className="p-4"><StatusBadge status={req.donationStatus} /></td>
                  <td className="p-4 text-right pr-6 space-x-1.5">
                    {/* Volunteer — শুধু status update */}
                    {req.donationStatus === "inprogress" && (
                      <div className="inline-flex gap-1 mr-2">
                        <button onClick={() => handleStatusUpdate(req._id, "done")}
                          className="bg-green-600 text-white px-2 py-1 rounded text-[11px]">Done</button>
                        <button onClick={() => handleStatusUpdate(req._id, "canceled")}
                          className="bg-gray-500 text-white px-2 py-1 rounded text-[11px]">Cancel</button>
                      </div>
                    )}
                    {/* Admin — edit ও delete */}
                    {isAdmin && (
                      <>
                        <EditButton request={req} />
                        <button onClick={() => handleDelete(req._id)} className="p-1.5 text-gray-400 hover:text-red-600">
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {requests.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400 text-sm">
            No donation requests found.
          </div>
        ) : (
          requests.map((req) => (
            <div key={req._id} className="bg-white rounded-2xl border border-gray-100 p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-bold text-gray-800 text-[15px]">{req.recipientName}</p>
                  <p className="text-[12px] text-gray-400 mt-0.5">{req.recipientUpazila}, {req.recipientDistrict}</p>
                </div>
                <span className="text-[13px] font-bold px-2.5 py-1 rounded-md" style={{ backgroundColor: `${RED}15`, color: RED }}>
                  {req.bloodGroup}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-[12px] text-gray-400">{req.donationDate}</p>
                  <StatusBadge status={req.donationStatus} />
                </div>
                <div className="flex items-center gap-1">
                  {req.donationStatus === "inprogress" && (
                    <div className="inline-flex gap-1">
                      <button onClick={() => handleStatusUpdate(req._id, "done")}
                        className="bg-green-600 text-white px-2 py-1 rounded text-[11px]">Done</button>
                      <button onClick={() => handleStatusUpdate(req._id, "canceled")}
                        className="bg-gray-500 text-white px-2 py-1 rounded text-[11px]">Cancel</button>
                    </div>
                  )}
                  {isAdmin && (
                    <>
                      <EditButton request={req} />
                      <button onClick={() => handleDelete(req._id)} className="p-1.5 text-gray-400 hover:text-red-600">
                        <Trash2 size={16} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
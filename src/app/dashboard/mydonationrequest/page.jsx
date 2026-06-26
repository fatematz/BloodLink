"use client";

import React, { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditButton from "../components/EditButton";

const RED = "#E0173C";

const StatusBadge = ({ status }) => {
  let bg = "bg-amber-50 text-amber-600 border-amber-100";
  let label = "Pending";
  if (status === "inprogress") {
    bg = "bg-blue-50 text-blue-600 border-blue-100";
    label = "In Progress";
  } else if (status === "done") {
    bg = "bg-green-50 text-green-600 border-green-100";
    label = "Done";
  } else if (status === "canceled") {
    bg = "bg-red-50 text-red-600 border-red-100";
    label = "Cancelled";
  }
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${bg} uppercase`}
    >
      {label}
    </span>
  );
};

const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <div className="flex justify-end items-center gap-2 mt-6">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="w-9 h-9 flex items-center justify-center rounded-lg border-2 border-[#E0173C] text-[#E0173C] disabled:opacity-30 hover:bg-[#E0173C] hover:text-white transition"
      >
        ‹
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`w-9 h-9 flex items-center justify-center rounded-lg border-2 text-sm font-bold transition ${
            p === page
              ? "border-[#E0173C] bg-[#E0173C] text-white"
              : "border-[#E0173C] text-[#E0173C] hover:bg-[#E0173C] hover:text-white"
          }`}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="w-9 h-9 flex items-center justify-center rounded-lg border-2 border-[#E0173C] text-[#E0173C] disabled:opacity-30 hover:bg-[#E0173C] hover:text-white transition"
      >
        ›
      </button>
    </div>
  );
};

export default function MyDonationRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRequests, setTotalRequests] = useState(0);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const session = await authClient.getSession();
        const userData = session?.data?.user;
        setUser(userData);
        if (!userData?.email) {
          setLoading(false);
          return;
        }
        const res = await fetch(
          `https://blood-link-server-phi.vercel.app/api/donation-requests?requesterEmail=${userData.email}&status=${status}&page=${page}&limit=3`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        if (res.ok) {
          const data = await res.json();
          setRequests(data.requests || []);
          setTotalPages(data.totalPages || 1);
          setTotalRequests(data.totalRequests || 0);
        }
      } catch (error) {
        console.error("Error loading requests:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [status, page]);

  const isBlocked = user?.status === "block";

  const handleDelete = async (id) => {
    if (isBlocked) return toast.error("You are blocked!");
    try {
      const res = await fetch(
        `https://blood-link-server-phi.vercel.app/api/donation-requests/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
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
      const res = await fetch(
        `https://blood-link-server-phi.vercel.app/api/donation-requests/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ donationStatus: newStatus }),
        },
      );
      const data = await res.json();
      if (res.ok) {
        toast.success(`Status updated to ${newStatus}!`);
        setRequests((prev) =>
          prev.map((req) =>
            req._id === id ? { ...req, donationStatus: newStatus } : req,
          ),
        );
      } else {
        toast.error(data.message || "Failed to update status");
      }
    } catch {
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] p-6 sm:p-10 font-sans">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-[26px] sm:text-[32px] font-black tracking-tight text-gray-800">
          My <span style={{ color: RED }}>Donation Requests</span>
        </h1>
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-[14px]"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="inprogress">In Progress</option>
          <option value="done">Done</option>
          <option value="canceled">Canceled</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 bg-[#FDFDFD]">
              <th className="p-4 text-[12px] font-semibold text-gray-400 uppercase">
                Recipient Info
              </th>
              <th className="p-4 text-[12px] font-semibold text-gray-400 uppercase">
                Location
              </th>
              <th className="p-4 text-[12px] font-semibold text-gray-400 uppercase">
                Date & Time
              </th>
              <th className="p-4 text-[12px] font-semibold text-gray-400 uppercase text-center">
                Group
              </th>
              <th className="p-4 text-[12px] font-semibold text-gray-400 uppercase">
                Status
              </th>
              <th className="p-4 text-[12px] font-semibold text-gray-400 uppercase text-right pr-6">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {requests.map((request) => (
              <tr key={request._id} className="hover:bg-gray-50/50">
                <td className="p-4 pl-6">{request.recipientName}</td>
                <td className="p-4">
                  {request.recipientUpazila}, {request.recipientDistrict}
                </td>
                <td className="p-4">{request.donationDate}</td>
                <td className="p-4 text-center">{request.bloodGroup}</td>
                <td className="p-4">
                  <StatusBadge status={request.donationStatus} />
                </td>
                <td className="p-4 text-right pr-6 space-x-1.5">
                  {!isBlocked && request.donationStatus === "inprogress" && (
                    <div className="inline-flex gap-1 mr-2">
                      <button
                        onClick={() => handleStatusUpdate(request._id, "done")}
                        className="bg-green-600 text-white px-2 py-1 rounded text-[11px]"
                      >
                        Done
                      </button>
                      <button
                        onClick={() =>
                          handleStatusUpdate(request._id, "canceled")
                        }
                        className="bg-gray-500 text-white px-2 py-1 rounded text-[11px]"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                  {!isBlocked && (
                    <>
                      <EditButton request={request} />
                      <button
                        onClick={() => handleDelete(request._id)}
                        className="p-1.5 text-gray-400 hover:text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}

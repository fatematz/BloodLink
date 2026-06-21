"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Edit2,
  Trash2,
  Eye,
  MapPin,
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const RED = "#E0173C";

export default function MyDonationRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRequests, setTotalRequests] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRequests = async () => {
      setLoading(true);
      try {
        const session = await authClient.getSession();
        const loggedInUserEmail = session?.data?.user?.email;

        if (!loggedInUserEmail) {
          console.warn("User is not logged in or email missing!");
          setLoading(false);
          return;
        }

        const res = await fetch(
          `http://localhost:5000/api/donation-requests?requesterEmail=${loggedInUserEmail}&status=${status}&page=${page}&limit=5`,
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

    loadRequests();
  }, [status, page]);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/donation-requests/${id}`,
        { method: "DELETE" },
      );

      if (res.ok) {
        setRequests((prevRequests) =>
          prevRequests.filter((req) => req._id !== id),
        );
        toast.success("Request deleted successfully.");
      } else {
        toast.error("Failed to delete. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting request:", error);
      toast.error("Something went wrong.");
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/donation-requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ donationStatus: newStatus }),
      });

      if (res.ok) {
        toast.success(`স্ট্যাটাস সফলভাবে ${newStatus} করা হয়েছে!`);
        setRequests((prevRequests) =>
          prevRequests.map((req) =>
            req._id === id ? { ...req, donationStatus: newStatus } : req
          )
        );
      } else {
        toast.error("স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে।");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("কোনো একটি সমস্যা হয়েছে।");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] p-6 sm:p-10 font-sans">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-[26px] sm:text-[32px] font-black tracking-tight text-gray-800">
            My <span style={{ color: RED }}>Donation Requests</span>
          </h1>
          <p className="text-gray-400 text-[14px] mt-1">
            View and manage all your requests here.
          </p>
        </div>

        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-[14px] text-gray-700 focus:outline-none focus:border-[#E0173C] transition shadow-sm"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="inprogress">In Progress</option>
          <option value="done">Done</option>
          <option value="canceled">Canceled</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-[#FDFDFD]">
                <th className="p-4 text-[12px] font-semibold text-gray-400 uppercase tracking-wider pl-6">Recipient Info</th>
                <th className="p-4 text-[12px] font-semibold text-gray-400 uppercase tracking-wider">Location</th>
                <th className="p-4 text-[12px] font-semibold text-gray-400 uppercase tracking-wider">Date & Time</th>
                <th className="p-4 text-[12px] font-semibold text-gray-400 uppercase tracking-wider text-center">Group</th>
                <th className="p-4 text-[12px] font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="p-4 text-[12px] font-semibold text-gray-400 uppercase tracking-wider text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-20 text-gray-400 text-[15px]">Loading requests...</td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-20 text-gray-400 text-[15px]">No donation requests found.</td>
                </tr>
              ) : (
                requests.map((request) => (
                  <tr key={request._id} className="hover:bg-gray-50/50 transition">
                    <td className="p-4 pl-6">
                      <p className="font-semibold text-gray-800 text-[14px]">{request.recipientName}</p>
                      {request.donationStatus === "inprogress" && request.donorName && (
                        <div className="mt-1 bg-blue-50/50 border border-blue-100 rounded-md p-1.5 text-[11px] text-blue-600 max-w-[180px]">
                          <p className="font-medium">Donor: {request.donorName}</p>
                          <p className="text-gray-400">{request.donorEmail}</p>
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-[13px] text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin size={14} className="text-gray-400 shrink-0" />
                        <span>{request.recipientUpazila}, {request.recipientDistrict}</span>
                      </div>
                    </td>
                    <td className="p-4 text-[13px] text-gray-600">
                      <div className="flex items-center gap-1 text-[13px]">
                        <Calendar size={14} className="text-gray-400" />
                        <span>{request.donationDate}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-gray-400 mt-0.5">
                        <Clock size={12} />
                        <span>{request.donationTime}</span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span className="inline-block text-[13px] font-bold px-2.5 py-1 rounded-md" style={{ backgroundColor: `${RED}10`, color: RED }}>
                        {request.bloodGroup}
                      </span>
                    </td>
                    <td className="p-4">
                      <StatusBadge status={request.donationStatus} />
                    </td>
                    <td className="p-4 text-right pr-6 space-x-1.5">
                      {request.donationStatus === "inprogress" && (
                        <div className="inline-flex gap-1 mr-2">
                          <button
                            onClick={() => handleStatusUpdate(request._id, "done")}
                            className="text-[11px] font-medium bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 transition"
                          >
                            Done
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(request._id, "canceled")}
                            className="text-[11px] font-medium bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600 transition"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                      <Link href={`/dashboard/donation-requests/${request._id}`} className="inline-flex p-1.5 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 transition" title="View Details">
                        <Eye size={16} />
                      </Link>
                      <Link href={`/dashboard/donation-requests/edit/${request._id}`} className="inline-flex p-1.5 text-gray-400 hover:text-blue-600 rounded-md hover:bg-blue-50 transition" title="Edit Request">
                        <Edit2 size={16} />
                      </Link>
                      <button onClick={() => handleDelete(request._id)} className="p-1.5 text-gray-400 hover:text-red-600 rounded-md hover:bg-red-50 transition" title="Delete Request">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {!loading && totalRequests > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 pt-4">
          <div className="text-[13px] text-gray-400 font-medium">
            Showing <span className="font-bold text-gray-700">{(page - 1) * 5 + 1}</span> to <span className="font-bold text-gray-700">{Math.min(page * 5, totalRequests)}</span> of <span className="font-bold text-gray-700">{totalRequests}</span> results
          </div>
          <div className="flex items-center gap-1.5">
            <button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1} className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 disabled:opacity-40 transition cursor-pointer disabled:cursor-not-allowed">
              <ChevronLeft size={16} />
            </button>
            {[...Array(totalPages)].map((_, index) => {
              const pageNum = index + 1;
              const isActive = page === pageNum;
              return (
                <button key={pageNum} onClick={() => setPage(pageNum)} className="w-8 h-8 text-[13px] font-bold rounded-lg transition flex items-center justify-center border cursor-pointer" style={{ backgroundColor: isActive ? RED : "transparent", color: isActive ? "#FFF" : "#4B5563", borderColor: isActive ? RED : "#E5E7EB" }}>
                  {pageNum}
                </button>
              );
            })}
            <button onClick={() => setPage((p) => Math.min(p + 1, totalPages))} disabled={page === totalPages} className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 disabled:opacity-40 transition cursor-pointer disabled:cursor-not-allowed">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

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
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${bg} uppercase tracking-wider`}>
      <span className="w-1 h-1 rounded-full bg-current" />
      {label}
    </span>
  );
};
"use client";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function EditRequestModal({ request, isOpen, onClose }) {
  const [formData, setFormData] = useState(request);
  const [saving, setSaving] = useState(false);
  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { _id, ...dataToUpdate } = formData;
    const token = localStorage.getItem("token");
    setSaving(true);
    try {
      const res = await fetch(
        `https://blood-link-server-phi.vercel.app/api/donation-requests/edit/${request._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify(dataToUpdate),
        },
      );
      if (res.ok) {
        toast.success("Request updated successfully!");
        setTimeout(() => {
          onClose();
          window.location.reload();
        }, 1000);
      } else {
        const err = await res.json();
        toast.error(err.message || "Failed to update.");
      }
    } catch (err) {
      toast.error("Network error occurred.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <ToastContainer position="top-right" autoClose={2000} />
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <h2 className="mb-4 font-bold text-xl">Edit Request</h2>
        <label className="block text-sm font-medium mb-1">Recipient Name</label>
        <input
          className="w-full border p-2 mb-3 rounded"
          value={formData.recipientName}
          onChange={(e) =>
            setFormData({ ...formData, recipientName: e.target.value })
          }
        />
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-medium mb-1">District</label>
            <input
              className="w-full border p-2 mb-3 rounded"
              value={formData.recipientDistrict}
              onChange={(e) =>
                setFormData({ ...formData, recipientDistrict: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Upazila</label>
            <input
              className="w-full border p-2 mb-3 rounded"
              value={formData.recipientUpazila}
              onChange={(e) =>
                setFormData({ ...formData, recipientUpazila: e.target.value })
              }
            />
          </div>
        </div>
        <label className="block text-sm font-medium mb-1">Hospital Name</label>
        <input
          className="w-full border p-2 mb-3 rounded"
          value={formData.hospitalName}
          onChange={(e) =>
            setFormData({ ...formData, hospitalName: e.target.value })
          }
        />
        <label className="block text-sm font-medium mb-1">Blood Group</label>
        <select
          className="w-full border p-2 mb-3 rounded"
          value={formData.bloodGroup}
          onChange={(e) =>
            setFormData({ ...formData, bloodGroup: e.target.value })
          }
        >
          {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="date"
            className="w-full border p-2 mb-3 rounded"
            value={formData.donationDate}
            onChange={(e) =>
              setFormData({ ...formData, donationDate: e.target.value })
            }
          />
          <input
            type="time"
            className="w-full border p-2 mb-3 rounded"
            value={formData.donationTime}
            onChange={(e) =>
              setFormData({ ...formData, donationTime: e.target.value })
            }
          />
        </div>
        <label className="block text-sm font-medium mb-1">
          Request Message
        </label>
        <textarea
          className="w-full border p-2 mb-3 rounded"
          value={formData.requestMessage}
          onChange={(e) =>
            setFormData({ ...formData, requestMessage: e.target.value })
          }
        />
        <div className="flex gap-2 justify-end mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-red-600 text-white rounded disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}

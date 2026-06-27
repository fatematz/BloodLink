"use client";

import { useState, useRef, useEffect } from "react";
import { MoreVertical } from "lucide-react";

export default function ActionMenu({ user, actionWithId }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  return (
    <div ref={ref} className="inline-block relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
      >
        <MoreVertical size={18} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] z-[9999] overflow-hidden">
          <form action={actionWithId} onSubmit={() => setOpen(false)}>
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
      )}
    </div>
  );
}

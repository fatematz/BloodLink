"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { Edit2, MapPin, Droplet, Shield, Mail, User, X, Save, Loader2 } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LOCATIONS from "@/lib/locations";

const RED = "#E0173C";
const RED_DARK = "#C20E32";

export default function ProfilePage() {
  const { data: session, isPending } = useSession();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ bloodGroup: "", district: "", upazila: "" });

  useEffect(() => {
    if (!session?.user?.email) return;
    const getUser = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/users/email/${session.user.email}`);
        if (!res.ok) throw new Error("User not found");
        const data = await res.json();
        setUser(data);
        setFormData({ bloodGroup: data.bloodGroup || "", district: data.district || "", upazila: data.upazila || "" });
      } catch (err) { console.log(err); } finally { setLoading(false); }
    };
    getUser();
  }, [session]);

  const handleUpdate = async () => {
    setSaving(true);
    try {
      const res = await fetch(`http://localhost:5000/api/users/update-profile/${user._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setUser({ ...user, ...formData });
        setIsEditing(false);
        toast.success("Profile updated!");
      } else {
        toast.error("Update failed.");
      }
    } catch (err) {
      toast.error("Something went wrong!");
    } finally {
      setSaving(false);
    }
  };

  if (isPending || loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="animate-spin" size={36} style={{ color: RED }} />
    </div>
  );

  const isBlocked = user?.status === "blocked";
  const districts = Object.keys(LOCATIONS);

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 sm:p-6 lg:p-8">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="max-w-2xl mx-auto space-y-5">
        {/* Header Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="h-20 w-full" style={{ background: `linear-gradient(135deg, ${RED} 0%, ${RED_DARK} 100%)` }} />
          <div className="px-6 pb-6 -mt-10">
            <div className="flex items-end justify-between">
              <div className="relative">
                {user?.image ? (
                  <img src={user.image} className="w-20 h-20 rounded-2xl border-4 border-white shadow-md object-cover" alt={user.name} />
                ) : (
                  <div className="w-20 h-20 rounded-2xl border-4 border-white shadow-md flex items-center justify-center text-white font-black text-2xl"
                    style={{ background: `linear-gradient(135deg, ${RED} 0%, ${RED_DARK} 100%)` }}>
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${isBlocked ? "bg-red-400" : "bg-emerald-400"}`} />
              </div>
              {!isBlocked && (
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-semibold transition"
                  style={isEditing
                    ? { background: "#F3F4F6", color: "#6B7280" }
                    : { background: `linear-gradient(135deg, ${RED} 0%, ${RED_DARK} 100%)`, color: "white" }
                  }
                >
                  {isEditing ? <><X size={14} /> Cancel</> : <><Edit2 size={14} /> Edit Profile</>}
                </button>
              )}
            </div>
            <div className="mt-4">
              <h1 className="text-[22px] font-black text-gray-800">{user?.name}</h1>
              <p className="text-gray-400 text-[13px] mt-0.5">{user?.email}</p>
              <div className="flex gap-2 mt-3 flex-wrap">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${isBlocked ? "bg-red-50 text-red-500" : "bg-emerald-50 text-emerald-600"}`}>
                  ● {isBlocked ? "Blocked" : "Active"}
                </span>
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-600">
                  {user?.role}
                </span>
                {user?.bloodGroup && (
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                    style={{ background: `${RED}15`, color: RED }}>
                    Blood: {user.bloodGroup}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-[15px] font-bold text-gray-700 mb-4">Profile Details</h2>

          {!isEditing ? (
            <div className="space-y-3">
              {[
                { icon: Mail, label: "Email", value: user?.email },
                { icon: User, label: "Role", value: user?.role },
                { icon: Droplet, label: "Blood Group", value: user?.bloodGroup || "Not set" },
                { icon: MapPin, label: "District", value: user?.district || "Not set" },
                { icon: MapPin, label: "Upazila", value: user?.upazila || "Not set" },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2.5 text-gray-500">
                    <Icon size={15} />
                    <span className="text-[13px] font-medium">{label}</span>
                  </div>
                  <span className="text-[13px] font-semibold text-gray-700 capitalize">{value}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="block text-[12px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Blood Group</label>
                <select value={formData.bloodGroup} onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#E0173C]">
                  <option value="">Select</option>
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">District</label>
                <select value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value, upazila: "" })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#E0173C]">
                  <option value="">Select District</option>
                  {districts.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Upazila</label>
                <select value={formData.upazila} onChange={(e) => setFormData({ ...formData, upazila: e.target.value })}
                  disabled={!formData.district}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#E0173C] disabled:opacity-50">
                  <option value="">Select Upazila</option>
                  {(LOCATIONS[formData.district] || []).map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
              <button onClick={handleUpdate} disabled={saving}
                className="w-full py-3 rounded-xl text-white font-semibold text-[14px] flex items-center justify-center gap-2 disabled:opacity-60 mt-2"
                style={{ background: `linear-gradient(135deg, ${RED} 0%, ${RED_DARK} 100%)` }}>
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

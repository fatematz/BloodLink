"use client";

import React, { useState, useRef } from "react";
import {
  ChevronLeft,
  ChevronDown,
  Camera,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  X,
} from "lucide-react";
import Link from "next/link";
// import { platform } from "node:os";

/* ───────────────────────── Theme tokens (from the design) ───────────────────────── */
const RED = "#E0173C";
const RED_DARK = "#C20E32";
const MINT = "#C20E32";

const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMAGE_API;

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const LOCATIONS = {
  Joypurhat: ["Joypurhat Sadar", "Akkelpur", "Kalai", "Khetlal", "Panchbibi"],
  Bogura: ["Bogura Sadar", "Adamdighi", "Dhunat", "Gabtali", "Kahaloo", "Sherpur", "Shibganj"],
  Dhaka: ["Dhamrai", "Dohar", "Keraniganj", "Nawabganj", "Savar"],
  Rajshahi: ["Bagha", "Bagmara", "Charghat", "Godagari", "Paba", "Puthia", "Tanore"],
  Chattogram: ["Anwara", "Boalkhali", "Hathazari", "Patiya", "Rangunia", "Raozan", "Sitakunda"],
  Sylhet: ["Sylhet Sadar", "Beanibazar", "Bishwanath", "Golapganj", "Gowainghat", "Zakiganj"],
  Khulna: ["Khulna Sadar", "Batiaghata", "Dumuria", "Dighalia", "Paikgachha", "Rupsha"],
  Rangpur: ["Rangpur Sadar", "Badarganj", "Gangachhara", "Kaunia", "Mithapukur", "Pirganj"],
};

const SignUp = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    bloodGroup: "",
    district: "",
    upazila: "",
    password: "",
    confirmPassword: "",
  });
  const [agree, setAgree] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(null);
  const fileRef = useRef(null);

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  /* district change → reset upazila */
  const onDistrict = (value) => setForm((f) => ({ ...f, district: value, upazila: "" }));

  const handleAvatar = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarPreview(URL.createObjectURL(file)); // instant local preview
    setErrors((x) => ({ ...x, avatar: undefined }));
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (data?.success) setAvatarUrl(data.data.display_url);
    } catch (err) {
      console.error("imgBB upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
    // if (!avatarPreview) e.avatar = "Please add a photo";
    if (!form.bloodGroup) e.bloodGroup = "Select a blood group";
    if (!form.district) e.district = "Select a district";
    if (!form.upazila) e.upazila = "Select an upazila";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "At least 6 characters";
    if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match";
    if (!agree) e.agree = "Please accept the terms";
    return e;
  };

const handleSubmit = async () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      avatar: avatarUrl,
      bloodGroup: form.bloodGroup,
      district: form.district,
      upazila: form.upazila,
      password: form.password,
      confirmPassword: form.confirmPassword,  
      role: "donor",
      status: "active",
    };

    console.log(payload);

    try {
      const res = await fetch("http://localhost:5000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrors({ email: data.message || "Something went wrong" });
        return;
      }
      setSubmitted(payload);   
    } catch (err) {
      console.error(err);
      setErrors({ email: "Network error, try again" });
    }
  };

  const reset = () => {
    setForm({ name: "", email: "", bloodGroup: "", district: "", upazila: "", password: "", confirmPassword: "" });
    setAgree(false);
    setAvatarPreview(null);
    setAvatarUrl(null);
    setErrors({});
    setSubmitted(null);
  };

  const upazilas = form.district ? LOCATIONS[form.district] || [] : [];

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4 pt-28"
      style={{ background: "#F4F6F9", fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif" }}
    >
      {/* focus + placeholder styling scoped to this form */}
      <style>{`
        .bd-field:focus { outline:none; border-color:${RED} !important; box-shadow:0 0 0 3px rgba(224,23,60,0.12); }
        .bd-field::placeholder { color:#9CA3AF; }
        .bd-btn-shadow { box-shadow:0 10px 22px -8px rgba(224,23,60,0.65); }
      `}</style>

      {/* centered card — same on mobile & desktop, just a box in the middle */}
      <div className="w-full max-w-[680px] bg-white rounded-3xl shadow-xl overflow-hidden my-6">
        {/* ── red header ── */}
        <div style={{ background: `linear-gradient(140deg, ${RED} 0%, ${RED_DARK} 100%)` }} className="px-6 pt-6 pb-1">
          <div className="relative flex items-center justify-center h-11">
            <Link href='/' className="absolute left-0 text-white active:scale-90 transition" aria-label="Go back">
              <ChevronLeft size={24} strokeWidth={2.5} />
            </Link>
            <h1 className="text-white text-[20px] mb-4 font-bold tracking-wide">Create Account</h1>
            <button className="absolute right-0 text-white/90 hover:text-white active:scale-90 transition" aria-label="Close">
              
            </button>
          </div>
        </div>

        <svg viewBox="0 0 392 56" preserveAspectRatio="none" className="block w-full" style={{ height: 46, marginTop: -1 }}>
          <path d="M0,0 L392,0 L392,16 Q196,70 0,16 Z" fill={RED_DARK} />
        </svg>

        <div className="-mt-14 flex justify-center">
          <div className="relative">
            <div
              className="w-[112px] h-[112px] rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-md"
              style={{ background: MINT }}
            >
              {avatarPreview ? (
                <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <Camera size={34} color="#F4F6F9" strokeWidth={1.8} />
              )}
              {uploading && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Loader2 size={26} className="text-white animate-spin" />
                </div>
              )}
            </div>
            <button
              onClick={() => fileRef.current?.click()}
              className="absolute bottom-0 right-0 w-9 h-9 rounded-full flex items-center justify-center border-[3px] border-white shadow active:scale-95 transition"
              style={{ background: RED }}
              aria-label="Upload photo"
            >
              <Camera size={16} className="text-white" />
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatar} />
          </div>
        </div>

        {submitted ? (
          <div className="px-6 sm:px-8 pt-6 pb-8 text-center">
            <CheckCircle2 size={54} className="mx-auto" style={{ color: RED }} />
            <h2 className="mt-3 text-[20px] font-bold text-gray-800">Registration successful</h2>
            <p className="mt-1 text-sm text-gray-500">
              Welcome, {submitted.name}! Your account is created as a{" "}
              <span className="font-semibold" style={{ color: RED }}>donor</span>.
            </p>

            <div className="mt-5 text-left bg-gray-50 border border-gray-200 rounded-xl divide-y divide-gray-100">
              {[    { label: "Name", value: submitted.name },
    { label: "Email", value: submitted.email },
    { label: "Blood Group", value: submitted.bloodGroup },
    { label: "District", value: submitted.district },
    { label: "Upazila", value: submitted.upazila },
    { label: "Role", value: submitted.role },
    { label: "Status", value: submitted.status }, ].map((row) => ( <div key={row.label} className="flex justify-between gap-4 px-4 py-2.5">
      <span className="text-[13px] font-medium text-gray-500">{row.label}</span>
      <span className="text-[13px] font-semibold text-gray-800 text-right break-all">
        {row.value}
      </span>
    </div> ))}
            </div>

            <button
              onClick={reset}
              className="mt-5 w-full text-white font-semibold py-3.5 rounded-xl bd-btn-shadow active:scale-[0.99] transition"
              style={{ background: RED }}
            >
              Go Back
            </button>
          </div>
        ) : (
          <div className="px-6 sm:px-8 pt-3 pb-8 space-y-4">
            <p className="text-center text-[13px] text-gray-500 -mt-1">
              Already have an account?{" "}
              <Link href='/auth/signin' className="font-semibold cursor-pointer" style={{ color: RED }}>Sign in</Link>
            </p>

            {avatarPreview && !avatarUrl && !uploading && (
              <p className="text-[11px] text-amber-600 text-center">Photo previewed locally. Add your imgBB key to host it.</p>
            )}

            <Field label="Name" error={errors.name}>
              <input
                className="bd-field w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[15px] text-gray-700"
                placeholder="Rhonda Rhodes"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
              />
            </Field>

            <Field label="Email" error={errors.email}>
              <input
                type="email"
                className="bd-field w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[15px] text-gray-700"
                placeholder="rhonda@outlook.com"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
              />
            </Field>

            <Field label="Blood Group" error={errors.bloodGroup}>
              <SelectBox value={form.bloodGroup} placeholder="Select blood group" onChange={(v) => set("bloodGroup", v)} options={BLOOD_GROUPS} />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="District" error={errors.district}>
                <SelectBox value={form.district} placeholder="District" onChange={onDistrict} options={Object.keys(LOCATIONS)} />
              </Field>
              <Field label="Upazila" error={errors.upazila}>
                <SelectBox
                  value={form.upazila}
                  placeholder={form.district ? "Upazila" : "Pick district"}
                  onChange={(v) => set("upazila", v)}
                  options={upazilas}
                  disabled={!form.district}
                />
              </Field>
            </div>

            <Field label="Password" error={errors.password}>
              <PasswordInput value={form.password} onChange={(v) => set("password", v)} show={showPass} toggle={() => setShowPass((s) => !s)} placeholder="••••••••" />
            </Field>

            <Field label="Confirm Password" error={errors.confirmPassword}>
              <PasswordInput value={form.confirmPassword} onChange={(v) => set("confirmPassword", v)} show={showConfirm} toggle={() => setShowConfirm((s) => !s)} placeholder="••••••••" />
            </Field>

            <div>
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-gray-300"
                  style={{ accentColor: RED }}
                />
                <span className="text-[12.5px] text-gray-500 leading-snug">
                  By creating your account you agree to the{" "}
                  <span className="underline" style={{ color: RED }}>terms of use</span> and our{" "}
                  <span className="underline" style={{ color: RED }}>privacy policy</span>.
                </span>
              </label>
              {errors.agree && <p className="mt-1 text-[12px]" style={{ color: RED }}>{errors.agree}</p>}
            </div>

            <button
              onClick={handleSubmit}
              disabled={uploading}
              className="w-full text-white font-semibold py-3.5 rounded-xl bd-btn-shadow active:scale-[0.99] transition disabled:opacity-60"
              style={{ background: RED }}
            >
              {uploading ? "Uploading photo…" : "Sign Up"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/* ───────────────────────── small reusable pieces ───────────────────────── */
const Field = ({ label, error, children }) => (
  <div>
    <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">{label}</label>
    {children}
    {error && <p className="mt-1 text-[12px]" style={{ color: RED }}>{error}</p>}
  </div>
);

const SelectBox = ({ value, placeholder, onChange, options, disabled }) => (
  <div className="relative">
    <select
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      className={`bd-field w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3 text-[15px] pr-9 ${
        value ? "text-gray-700" : "text-gray-400"
      } ${disabled ? "opacity-60" : ""}`}
    >
      <option value="" disabled>{placeholder}</option>
      {options.map((o) => (
        <option key={o} value={o} className="text-gray-700">{o}</option>
      ))}
    </select>
    <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
  </div>
);

const PasswordInput = ({ value, onChange, show, toggle, placeholder }) => (
  <div className="relative">
    <input
      type={show ? "text" : "password"}
      className="bd-field w-full bg-white border border-gray-200 rounded-xl px-4 py-3 pr-11 text-[15px] text-gray-700"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
    <button
      type="button"
      onClick={toggle}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 active:scale-90 transition"
      aria-label={show ? "Hide password" : "Show password"}
    >
      {show ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  </div>
);

export default SignUp;
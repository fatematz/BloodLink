"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  Droplet,
  Eye,
  EyeOff,
  CheckCircle2,
} from "lucide-react";


const RED = "#E0173C";
const RED_DARK = "#C20E32";
const MINT = "#F4F6F9";

const Signin = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [remember, setRemember] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});
  const [loggedIn, setLoggedIn] = useState(null);

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password) e.password = "Password is required";
    return e;
  };

const handleSubmit = async () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;

    const payload = { email: form.email.trim(), password: form.password, remember };

    try {
      const res = await fetch("http://localhost:5000/login", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrors({ email: data.message || "Invalid credentials" });
        return;
      }

      setLoggedIn(data.user); 
    } catch (err) {
      console.error(err);
      setErrors({ email: "Network error, try again" });
    }
  };
  return (
    <div
      className="min-h-screen w-full flex items-start justify-center px-4 pb-10 pt-28"
      style={{ background: "#F4F6F9", fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif" }}
    >
      <style>{`
        .bd-field:focus { outline:none; border-color:${RED} !important; box-shadow:0 0 0 3px rgba(224,23,60,0.12); }
        .bd-field::placeholder { color:#9CA3AF; }
        .bd-btn-shadow { box-shadow:0 10px 22px -8px rgba(224,23,60,0.65); }
      `}</style>

      {/* centered card */}
      <div className="w-full max-w-[680px] bg-white rounded-3xl shadow-xl overflow-hidden my-6">
        {/* ── red header ── */}
        <div style={{ background: `linear-gradient(140deg, ${RED} 0%, ${RED_DARK} 100%)` }} className="px-6 pt-6 pb-1">
          <div className="relative flex items-center justify-center h-11">
            <Link href="/" className="absolute left-0 text-white active:scale-90 transition" aria-label="Go back">
              <ChevronLeft size={24} strokeWidth={2.5} />
            </Link>
            <h1 className="text-white text-[20px] mb-4 font-bold tracking-wide">Welcome Back</h1>
          </div>
        </div>

        {/* curved bottom of header */}
        <svg viewBox="0 0 392 56" preserveAspectRatio="none" className="block w-full" style={{ height: 46, marginTop: -1 }}>
          <path d="M0,0 L392,0 L392,16 Q196,70 0,16 Z" fill={RED_DARK} />
        </svg>

        {/* icon circle overlapping the curve */}
        <div className="-mt-14 flex justify-center">
          <div
            className="w-[112px] h-[112px] rounded-full flex items-center justify-center border-4 border-white shadow-md"
            style={{ background: "#C20E32" }}
          >
            <Droplet size={44} color="#F4F6F9" fill="#F4F6F9" strokeWidth={1.5} />
          </div>
        </div>

        {loggedIn ? (
          /* ── success view ── */
          <div className="px-6 sm:px-8 pt-6 pb-8 text-center">
            <CheckCircle2 size={54} className="mx-auto" style={{ color: RED }} />
            <h2 className="mt-3 text-[20px] font-bold text-gray-800">Logged in successfully</h2>
            <p className="mt-1 text-sm text-gray-500">
              Welcome back, <span className="font-semibold" style={{ color: RED }}>{loggedIn.email}</span>
            </p>
            <Link
              href="/dashboard"
              className="mt-6 inline-block w-full text-white font-semibold py-3.5 rounded-xl bd-btn-shadow active:scale-[0.99] transition"
              style={{ background: RED }}
            >
              Go to Dashboard
            </Link>
          </div>
        ) : (
          /* ── form ── */
          <div className="px-6 sm:px-8 pt-5 pb-8 space-y-4">
            <p className="text-center text-[13px] text-gray-500 -mt-1">
              Sign in to continue to <span className="font-semibold" style={{ color: RED }}>BloodLink</span>
            </p>

            <Field label="Email" error={errors.email}>
              <input
                type="email"
                className="bd-field w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[15px] text-gray-700"
                placeholder="rhonda@outlook.com"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
              />
            </Field>

            <Field label="Password" error={errors.password}>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  className="bd-field w-full bg-white border border-gray-200 rounded-xl px-4 py-3 pr-11 text-[15px] text-gray-700"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => set("password", e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 active:scale-90 transition"
                  aria-label={showPass ? "Hide password" : "Show password"}
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </Field>

            {/* remember me */}
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300"
                style={{ accentColor: RED }}
              />
              <span className="text-[13px] text-gray-600">Remember me</span>
            </label>

            <button
              onClick={handleSubmit}
              className="w-full text-white font-semibold py-3.5 rounded-xl bd-btn-shadow active:scale-[0.99] transition"
              style={{ background: RED }}
            >
              Sign In
            </button>

            <p className="text-center text-[13px] text-gray-500">
              Don&apos;t have an account?{" "}
              <Link href="/auth/signup" className="font-semibold" style={{ color: RED }}>
                Register
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

/* ───────────────────────── small reusable piece ───────────────────────── */
const Field = ({ label, error, children }) => (
  <div>
    <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">{label}</label>
    {children}
    {error && <p className="mt-1 text-[12px]" style={{ color: RED }}>{error}</p>}
  </div>
);

export default Signin;
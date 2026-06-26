"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, Droplet, Eye, EyeOff } from "lucide-react";
import Navbar from "@/app/homepage/navbar";

const RED = "#E0173C";
const RED_DARK = "#C20E32";

const Signin = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Enter a valid email";
    if (!form.password) e.password = "Password is required";
    return e;
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    const errorsFound = validate();
    setErrors(errorsFound);
    if (Object.keys(errorsFound).length) return;

    setIsLoading(true);

    try {
      const { data, error: authError } = await authClient.signIn.email({
        email: form.email.trim(),
        password: form.password,
      });

      if (authError) {
        setErrors({ email: authError.message || "Invalid credentials" });
      } else if (data) {
        try {
          const tokenRes = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/jwt`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email: form.email.trim() }),
            },
          );
          const tokenData = await tokenRes.json();
          if (tokenData.token) {
            localStorage.setItem("token", tokenData.token);
            document.cookie = `bloodlink_token=${tokenData.token}; path=/; max-age=${604800}`;
          }
        } catch (tokenErr) {
          console.error("JWT fetch failed:", tokenErr);
        }
        // ────────────────────────────────

        router.push(redirectTo);
      }
    } catch (err) {
      console.error(err);
      setErrors({ email: "Something went wrong. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-start justify-center px-4 pb-10 pt-28"
      style={{
        background: "#F4F6F9",
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
      }}
    >
      <Navbar />
      <style>{`
        .bd-field:focus { outline:none; border-color:${RED} !important; box-shadow:0 0 0 3px rgba(224,23,60,0.12); }
        .bd-field::placeholder { color:#9CA3AF; }
        .bd-btn-shadow { box-shadow:0 10px 22px -8px rgba(224,23,60,0.65); }
      `}</style>

      <div className="w-full max-w-[680px] bg-white rounded-3xl shadow-xl overflow-hidden my-6">
        <div
          style={{
            background: `linear-gradient(140deg, ${RED} 0%, ${RED_DARK} 100%)`,
          }}
          className="px-6 pt-6 pb-1"
        >
          <div className="relative flex items-center justify-center h-11">
            <Link
              href="/"
              className="absolute left-0 text-white active:scale-90 transition"
              aria-label="Go back"
            >
              <ChevronLeft size={24} strokeWidth={2.5} />
            </Link>
            <h1 className="text-white text-[20px] mb-4 font-bold tracking-wide">
              Welcome Back
            </h1>
          </div>
        </div>

        <svg
          viewBox="0 0 392 56"
          preserveAspectRatio="none"
          className="block w-full"
          style={{ height: 46, marginTop: -1 }}
        >
          <path d="M0,0 L392,0 L392,16 Q196,70 0,16 Z" fill={RED_DARK} />
        </svg>

        <div className="-mt-14 flex justify-center">
          <div
            className="w-[112px] h-[112px] rounded-full flex items-center justify-center border-4 border-white shadow-md"
            style={{ background: "#C20E32" }}
          >
            <Droplet
              size={44}
              color="#F4F6F9"
              fill="#F4F6F9"
              strokeWidth={1.5}
            />
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="px-6 sm:px-8 pt-5 pb-8 space-y-4"
        >
          <p className="text-center text-[13px] text-gray-500 -mt-1">
            Sign in to continue to{" "}
            <span className="font-semibold" style={{ color: RED }}>
              BloodLink
            </span>
          </p>

          <Field label="Email" error={errors.email}>
            <input
              type="email"
              disabled={isLoading}
              className="bd-field w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[15px] text-gray-700 disabled:opacity-60"
              placeholder="rhonda@outlook.com"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
            />
          </Field>

          <Field label="Password" error={errors.password}>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                disabled={isLoading}
                className="bd-field w-full bg-white border border-gray-200 rounded-xl px-4 py-3 pr-11 text-[15px] text-gray-700 disabled:opacity-60"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => set("password", e.target.value)}
              />
              <button
                type="button"
                disabled={isLoading}
                onClick={() => setShowPass((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 active:scale-90 transition disabled:opacity-50"
                aria-label={showPass ? "Hide password" : "Show password"}
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </Field>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full text-white font-semibold py-3.5 rounded-xl bd-btn-shadow active:scale-[0.99] transition disabled:bg-red-400 disabled:cursor-not-allowed text-center flex items-center justify-center h-12"
            style={{ background: isLoading ? undefined : RED }}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>

          <p className="text-center text-[13px] text-gray-500">
            Don&apos;t have an account?{" "}
            <Link
              href={`/auth/signup?redirect=${redirectTo}`}
              className="font-semibold"
              style={{ color: RED }}
            >
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

const Field = ({ label, error, children }) => (
  <div>
    <label className="block text-[14px] font-semibold text-gray-700 mb-1.5">
      {label}
    </label>
    {children}
    {error && (
      <p className="mt-1 text-[12px]" style={{ color: RED }}>
        {error}
      </p>
    )}
  </div>
);

export default function SigninPage() {
  return (
    <Suspense>
      <Signin />
    </Suspense>
  );
}

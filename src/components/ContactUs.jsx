"use client";

import React, { useState } from "react";
import { Phone, Mail, MapPin, Send, CheckCircle2, Droplet } from "lucide-react";

const RED = "#E0173C";
const RED_DARK = "#C20E32";

const ContactUs = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
    if (!form.message.trim()) e.message = "Please write a message";
    return e;
  };

//   const handleSubmit = () => {
//     const e = validate();
//     setErrors(e);
//     if (Object.keys(e).length) return;
//     setSent(true); // UI only
//   };

  return (
    <section className="w-full px-4 md:px-0 py-16" style={{ background: "#F4F6F9" }}>
      <style>{`
        .bd-field:focus { outline:none; border-color:${RED} !important; box-shadow:0 0 0 3px rgba(224,23,60,0.12); }
        .bd-field::placeholder { color:#9CA3AF; }
        .bd-btn-shadow { box-shadow:0 10px 22px -8px rgba(224,23,60,0.65); }
      `}</style>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black tracking-tight text-[#0E1E45] sm:text-4xl">
            Contact Us
          </h2>
        </div>

        {/* ── Main Contact Card ── */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden grid lg:grid-cols-2">
          {/* ── left: red info panel ── */}
          <div
            className="relative p-8 sm:p-12 text-white overflow-hidden"
            style={{ background: `linear-gradient(140deg, ${RED} 0%, ${RED_DARK} 100%)` }}
          >
            {/* glow */}
            <div
              className="absolute -right-20 -top-20 w-72 h-72 rounded-full blur-3xl opacity-25"
              style={{ background: "radial-gradient(circle, #FFFFFF 0%, transparent 70%)" }}
            />
            <div className="relative">
              <span className="inline-flex items-center gap-2 text-[13px] font-semibold px-3 py-1.5 rounded-full mb-6"
                style={{ background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.4)" }}>
                <Droplet size={14} fill="#fff" /> Get in Touch
              </span>

              <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight">
                We'd love to <br /> hear from you.
              </h2>
              <p className="mt-4 text-[15px] text-white/85 max-w-sm leading-relaxed">
                Questions, feedback, or need urgent help finding a donor? Reach out anytime —
                our team is here for you.
              </p>

              <div className="mt-9 space-y-5">
                <span href="+8801700000000" className="flex items-center gap-4">
                  <span className="w-11 h-11 rounded-full flex items-center justify-center shrink-0" style={{ background: "rgba(255,255,255,0.18)" }}>
                    <Phone size={18} />
                  </span>
                  <div className="leading-tight">
                    <p className="text-[12px] text-white/70">Call us</p>
                    <p className="text-[16px] font-semibold">+880 1700-000000</p>
                  </div>
                </span>
                <span href="help@bloodlink.com" className="flex items-center gap-4">
                  <span className="w-11 h-11 rounded-full flex items-center justify-center shrink-0" style={{ background: "rgba(255,255,255,0.18)" }}>
                    <Mail size={18} />
                  </span>
                  <div className="leading-tight">
                    <p className="text-[12px] text-white/70">Email us</p>
                    <p className="text-[16px] font-semibold">help@bloodlink.com</p>
                  </div>
                </span>
                <div className="flex items-center gap-4">
                  <span className="w-11 h-11 rounded-full flex items-center justify-center shrink-0" style={{ background: "rgba(255,255,255,0.18)" }}>
                    <MapPin size={18} />
                  </span>
                  <div className="leading-tight">
                    <p className="text-[12px] text-white/70">Visit us</p>
                    <p className="text-[16px] font-semibold">Joypurhat, Bangladesh</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── right: form ── */}
          <div className="p-8 sm:p-12">
            {sent ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-10">
                <CheckCircle2 size={56} style={{ color: RED }} />
                <h3 className="mt-4 text-[22px] font-bold text-gray-800">Message sent</h3>
                <p className="mt-1 text-sm text-gray-500 max-w-xs">
                  Thanks {form.name}, we'll get back to you at{" "}
                  <span className="font-semibold" style={{ color: RED }}>{form.email}</span> soon.
                </p>
                <button
                  onClick={() => { setSent(false); setForm({ name: "", email: "", message: "" }); }}
                  className="mt-6 text-white font-semibold px-8 py-3 rounded-xl bd-btn-shadow active:scale-[0.99] transition"
                  style={{ background: RED }}
                >
                  Send another
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Send us a message</h3>

                <Field label="Name" error={errors.name}>
                  <input
                    className="bd-field w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[15px] text-gray-700"
                    placeholder="Your name"
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                  />
                </Field>

                <Field label="Email" error={errors.email}>
                  <input
                    type="email"
                    className="bd-field w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[15px] text-gray-700"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                  />
                </Field>

                <Field label="Message" error={errors.message}>
                  <textarea
                    rows={5}
                    className="bd-field w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[15px] text-gray-700 resize-none"
                    placeholder="How can we help you?"
                    value={form.message}
                    onChange={(e) => set("message", e.target.value)}
                  />
                </Field>

                <button
                 
                  className="w-full inline-flex items-center justify-center gap-2 text-white font-semibold py-3.5 rounded-xl bd-btn-shadow active:scale-[0.99] transition"
                  style={{ background: RED }}
                >
                  <Send size={17} /> Send Message
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
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

export default ContactUs;
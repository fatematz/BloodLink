"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, Loader2 } from "lucide-react";
import Navbar from "../homepage/navbar";
import Footer from "@/components/Footer";

const RED = "#E0173C";
const RED_DARK = "#C20E32";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");

  const [status, setStatus] = useState("loading");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!sessionId) {
      router.replace("/funding");
      return;
    }

    const saveFund = async () => {
      try {
        setStatus("saving");
        const verifyRes = await fetch(
          `/api/verify-payment?session_id=${sessionId}`,
        );
        const verifyData = await verifyRes.json();
        if (!verifyRes.ok || verifyData.error)
          throw new Error(verifyData.error || "Payment verification failed");

        const { userName, userEmail, amount, stripeTransactionId } = verifyData;
        const token = localStorage.getItem("token");

        const saveRes = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/funds`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(token && { Authorization: `Bearer ${token}` }),
            },
            body: JSON.stringify({
              name: userName,
              email: userEmail,
              amount: parseFloat(amount),
              transactionId: stripeTransactionId,
            }),
          },
        );

        if (!saveRes.ok) throw new Error("Failed to save fund to database");
        setStatus("done");
      } catch (err) {
        setErrorMsg(err.message);
        setStatus("error");
      }
    };
    saveFund();
  }, [sessionId, router]);

  return (
    <div className="min-h-screen bg-[#F4F6F9]">
      <Navbar />
      <div className="flex items-center justify-center min-h-[80vh] px-4">
        <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center">
          {(status === "loading" || status === "saving") && (
            <>
              <Loader2 className="w-14 h-14 mx-auto mb-4 animate-spin text-gray-400" />
              <h2 className="text-xl font-bold text-gray-700">
                Processing your payment…
              </h2>
              <p className="text-sm text-gray-400 mt-2">
                Please wait, we're saving your contribution.
              </p>
            </>
          )}
          {status === "done" && (
            <>
              <CheckCircle
                className="w-16 h-16 mx-auto mb-4"
                style={{ color: RED }}
              />
              <h2 className="text-2xl font-black text-gray-800">Thank You!</h2>
              <p className="text-gray-500 mt-2 text-sm">
                Your donation has been received and recorded successfully.
              </p>
              <button
                onClick={() => router.push("/funding")}
                className="mt-6 px-8 py-3 rounded-xl text-white font-bold text-sm transition active:scale-[0.98]"
                style={{
                  background: `linear-gradient(135deg, ${RED} 0%, ${RED_DARK} 100%)`,
                }}
              >
                View Funding History
              </button>
            </>
          )}
          {status === "error" && (
            <>
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center text-3xl">
                ❌
              </div>
              <h2 className="text-xl font-bold text-gray-800">
                Something went wrong
              </h2>
              <p className="text-sm text-red-400 mt-2">{errorMsg}</p>
              <button
                onClick={() => router.push("/funding")}
                className="mt-6 px-8 py-3 rounded-xl text-white font-bold text-sm"
                style={{
                  background: `linear-gradient(135deg, ${RED} 0%, ${RED_DARK} 100%)`,
                }}
              >
                Go Back
              </button>
            </>
          )}
        </div>
      </div>
      <div className="mt-16">
        <Footer />
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}

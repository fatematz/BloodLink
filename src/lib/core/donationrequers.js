import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const myDonationRequests = async (status = "", page = 1, limit = 5) => {
  const session = await auth.api.getSession({ headers: await headers() });
  
  if (!session?.user?.email) {
    return { requests: [], totalPages: 1, currentPage: 1, totalRequests: 0 };
  }

  const email = session.user.email;
  const url = `http://localhost:5000/api/donation-requests?email=${email}&status=${status}&page=${page}&limit=${limit}`;
  
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch data");
    
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    return { requests: [], totalPages: 1, currentPage: 1, totalRequests: 0 };
  }
};
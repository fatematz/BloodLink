export async function ensureToken(email) {
  if (typeof window === "undefined") return;
  if (localStorage.getItem("token")) return;
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/jwt`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      },
    );
    const data = await res.json();
    if (data.token) {
      localStorage.setItem("token", data.token);
      document.cookie = `bloodlink_token=${data.token}; path=/; max-age=${604800}`;
    }
  } catch {}
}

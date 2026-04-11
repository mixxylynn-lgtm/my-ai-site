"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignIn = async () => {
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setIsLoading(true);
    setError("");

    const { data: existingUser } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (!existingUser) {
      const { error: insertError } = await supabase
        .from("users")
        .insert([{ email, plan: "free", generations_used: 0 }]);

  if (insertError) {
  setError(insertError.message);
  setIsLoading(false);
  return;
}
    }

    localStorage.setItem("copyai_user", email);
    router.push("/");
  };

  return (
    <main style={{ fontFamily: "Georgia, serif", background: "#0a0a0f", minHeight: "100vh", color: "#f0ede6", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: "420px", padding: "48px", background: "#111118", border: "1px solid #2a2a3a", borderRadius: "8px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "900", marginBottom: "8px" }}>
          Copy<span style={{ color: "#e8c97a" }}>AI</span> Pro
        </h1>
        <p style={{ color: "#7a7060", marginBottom: "32px", fontSize: "15px" }}>Sign in to access the generator</p>

        {error && <p style={{ color: "#e05555", marginBottom: "16px", fontSize: "14px" }}>{error}</p>}

        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#9a9080", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px" }}>Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ width: "100%", background: "#0a0a0f", border: "1px solid #2a2a3a", borderRadius: "4px", padding: "12px 14px", color: "#f0ede6", fontSize: "15px", outline: "none", boxSizing: "border-box" }}
          />
        </div>

        <div style={{ marginBottom: "24px" }}>
          <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#9a9080", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px" }}>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ width: "100%", background: "#0a0a0f", border: "1px solid #2a2a3a", borderRadius: "4px", padding: "12px 14px", color: "#f0ede6", fontSize: "15px", outline: "none", boxSizing: "border-box" }}
          />
        </div>

        <button
          onClick={handleSignIn}
          disabled={isLoading}
          style={{ background: isLoading ? "#4a4030" : "#e8c97a", color: "#0a0a0f", border: "none", padding: "16px", borderRadius: "4px", fontWeight: "800", fontSize: "16px", cursor: "pointer", width: "100%" }}
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </button>

        <p style={{ textAlign: "center", color: "#7a7060", fontSize: "13px", marginTop: "24px" }}>
          No account needed — just enter any email and password to get started.
        </p>
      </div>
    </main>
  );
}
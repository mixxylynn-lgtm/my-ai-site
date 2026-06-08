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
    <main style={{ fontFamily: "system-ui,sans-serif", background: "radial-gradient(1100px 600px at 50% -120px, rgba(34,211,238,0.16), rgba(34,211,238,0.05) 35%, transparent 70%), #0a0a0a", minHeight: "100vh", color: "white", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ width: "100%", maxWidth: "420px", padding: "40px", background: "#111", border: "1px solid #1f1f1f", borderRadius: "16px" }}>
        <div style={{ display: "inline-block", background: "#0d1f24", color: "#22d3ee", fontSize: "12px", fontWeight: "700", padding: "5px 14px", borderRadius: "999px", marginBottom: "20px", border: "1px solid #22d3ee", letterSpacing: "0.5px" }}>
          3 free listings — no credit card
        </div>
        <h1 style={{ fontSize: "26px", fontWeight: "800", marginBottom: "8px", letterSpacing: "-0.5px" }}>
          Create your free account
        </h1>
        <p style={{ color: "#888", marginBottom: "28px", fontSize: "15px", lineHeight: "1.6" }}>Enter your email to start generating listings + prices in seconds.</p>

        {error && <p style={{ color: "#ef4444", marginBottom: "16px", fontSize: "14px" }}>{error}</p>}

        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#888", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px" }}>Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ width: "100%", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "8px", padding: "12px 14px", color: "white", fontSize: "15px", outline: "none", boxSizing: "border-box" }}
          />
        </div>

        <div style={{ marginBottom: "24px" }}>
          <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#888", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px" }}>Password</label>
          <input
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") handleSignIn(); }}
            style={{ width: "100%", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "8px", padding: "12px 14px", color: "white", fontSize: "15px", outline: "none", boxSizing: "border-box" }}
          />
        </div>

        <button
          onClick={handleSignIn}
          disabled={isLoading}
          style={{ background: isLoading ? "#1a1a1a" : "#22d3ee", color: isLoading ? "#444" : "black", border: "none", padding: "15px", borderRadius: "8px", fontWeight: "800", fontSize: "16px", cursor: isLoading ? "not-allowed" : "pointer", width: "100%" }}
        >
          {isLoading ? "Setting up your account..." : "Start generating — free"}
        </button>

        <p style={{ textAlign: "center", color: "#555", fontSize: "13px", marginTop: "20px", lineHeight: "1.6" }}>
          Free to start. No credit card required.<br />Already have an account? Use the same email to sign back in.
        </p>
      </div>
    </main>
  );
}
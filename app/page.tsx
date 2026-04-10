"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const FREE_LIMIT = 3;

export default function Home() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [brand, setBrand] = useState("");
  const [details, setDetails] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [usageCount, setUsageCount] = useState(0);
  const [showPaywall, setShowPaywall] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("copyai_user");
    if (user) setIsSignedIn(true);
    const count = parseInt(localStorage.getItem("copyai_usage") || "0");
    setUsageCount(count);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("copyai_user");
    setIsSignedIn(false);
  };

  const handleGenerate = async () => {
    if (usageCount >= FREE_LIMIT) {
      setShowPaywall(true);
      return;
    }
    if (!brand || !details) {
      setError("Please fill in brand and details.");
      return;
    }
    setError("");
    setLoading(true);
    setOutput("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brand, details }),
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setOutput(data.content || data.result || "No output.");
      const newCount = usageCount + 1;
      setUsageCount(newCount);
      localStorage.setItem("copyai_usage", newCount.toString());
      if (newCount >= FREE_LIMIT) setShowPaywall(true);
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ fontFamily: "Georgia, serif", background: "#0a0a0f", minHeight: "100vh", color: "#f0ede6" }}>

      <header style={{ padding: "20px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #2a2a3a" }}>
        <span style={{ fontSize: "22px", fontWeight: "bold" }}>
          Copy<span style={{ color: "#e8c97a" }}>AI</span> Pro
        </span>
        <div>
          {!isSignedIn && (
            <button onClick={() => router.push("/signin")} style={{ background: "#e8c97a", color: "#0a0a0f", padding: "8px 20px", borderRadius: "4px", fontWeight: "700", fontSize: "14px", border: "none", cursor: "pointer" }}>
              Sign In
            </button>
          )}
          {isSignedIn && (
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <span style={{ fontSize: "13px", color: "#7a7060" }}>{FREE_LIMIT - usageCount > 0 ? `${FREE_LIMIT - usageCount} free generations left` : "Free limit reached"}</span>
              <button onClick={handleSignOut} style={{ background: "transparent", color: "#9a9080", padding: "8px 20px", borderRadius: "4px", fontWeight: "700", fontSize: "14px", border: "1px solid #2a2a3a", cursor: "pointer" }}>
                Sign Out
              </button>
            </div>
          )}
        </div>
      </header>

      <section style={{ textAlign: "center", padding: "80px 20px" }}>
        <h1 style={{ fontSize: "60px", fontWeight: "900", lineHeight: 1.1, marginBottom: "24px" }}>
          Copy that converts.<br />
          <span style={{ color: "#e8c97a" }}>Generated in seconds.</span>
        </h1>
        <p style={{ fontSize: "18px", color: "#7a7060", maxWidth: "500px", margin: "0 auto 40px" }}>
          Stop staring at a blank page. CopyAI Pro writes high-converting copy for your brand instantly.
        </p>
        {!isSignedIn && (
          <button onClick={() => router.push("/signin")} style={{ display: "inline-block", background: "#e8c97a", color: "#0a0a0f", padding: "16px 40px", borderRadius: "4px", fontWeight: "800", fontSize: "16px", border: "none", cursor: "pointer" }}>
            Get Started Free
          </button>
        )}
        {isSignedIn && (
          <a href="#generator" style={{ display: "inline-block", background: "#e8c97a", color: "#0a0a0f", padding: "16px 40px", borderRadius: "4px", fontWeight: "800", fontSize: "16px", textDecoration: "none" }}>
            Try It Now
          </a>
        )}
      </section>

      {isSignedIn && (
        <section id="generator" style={{ maxWidth: "700px", margin: "0 auto", padding: "60px 24px" }}>
          <h2 style={{ fontSize: "32px", fontWeight: "800", marginBottom: "8px" }}>AI Copy Generator</h2>
          <p style={{ color: "#7a7060", fontSize: "14px", marginBottom: "32px" }}>
            {usageCount < FREE_LIMIT ? `${FREE_LIMIT - usageCount} of ${FREE_LIMIT} free generations remaining` : "You've used all your free generations — upgrade to keep going!"}
          </p>

          {showPaywall && (
            <div style={{ background: "#14111f", border: "2px solid #e8c97a", borderRadius: "8px", padding: "36px", textAlign: "center", marginBottom: "32px" }}>
              <h3 style={{ fontSize: "24px", fontWeight: "900", marginBottom: "12px" }}>You've used your 3 free generations!</h3>
              <p style={{ color: "#7a7060", marginBottom: "28px", fontSize: "15px" }}>Upgrade to Starter to get 50 generations/mo for just $9.</p>
              <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
                <a href="https://buy.stripe.com/aFaaEWeJE66EgLW9ti2cg00" target="_blank" rel="noopener noreferrer" style={{ background: "#e8c97a", color: "#0a0a0f", padding: "14px 32px", borderRadius: "4px", fontWeight: "800", fontSize: "15px", textDecoration: "none" }}>
                  Get Starter — $9/mo
                </a>
                <a href="https://buy.stripe.com/6oU4gyeJEgLi53e8pe2cg01" target="_blank" rel="noopener noreferrer" style={{ background: "transparent", color: "#e8c97a", padding: "14px 32px", borderRadius: "4px", fontWeight: "800", fontSize: "15px", textDecoration: "none", border: "1px solid #e8c97a" }}>
                  Get Pro — $29/mo
                </a>
              </div>
            </div>
          )}

          {!showPaywall && (
            <>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#9a9080", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px" }}>Brand Name</label>
                <input type="text" placeholder="e.g. CopyAI Pro" value={brand} onChange={e => setBrand(e.target.value)} style={{ width: "100%", background: "#111118", border: "1px solid #2a2a3a", borderRadius: "4px", padding: "12px 14px", color: "#f0ede6", fontSize: "15px", outline: "none", boxSizing: "border-box" }} />
              </div>
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#9a9080", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px" }}>Key Details</label>
                <textarea rows={4} placeholder="Describe your product, offer, audience..." value={details} onChange={e => setDetails(e.target.value)} style={{ width: "100%", background: "#111118", border: "1px solid #2a2a3a", borderRadius: "4px", padding: "12px 14px", color: "#f0ede6", fontSize: "15px", outline: "none", boxSizing: "border-box", resize: "vertical" }} />
              </div>
              {error && <p style={{ color: "#e05555", marginBottom: "16px" }}>{error}</p>}
              <button onClick={handleGenerate} disabled={loading} style={{ background: loading ? "#4a4030" : "#e8c97a", color: "#0a0a0f", border: "none", padding: "16px", borderRadius: "4px", fontWeight: "800", fontSize: "16px", cursor: "pointer", width: "100%" }}>
                {loading ? "Generating..." : `Generate Copy (${FREE_LIMIT - usageCount} left)`}
              </button>
            </>
          )}

          {output && (
            <div style={{ marginTop: "32px", background: "#111118", border: "1px solid #2a2a3a", borderLeft: "3px solid #e8c97a", borderRadius: "6px", padding: "28px" }}>
              <p style={{ fontSize: "12px", color: "#e8c97a", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "16px" }}>Generated Copy</p>
              <p style={{ whiteSpace: "pre-wrap", lineHeight: 1.8, color: "#f0ede6", margin: 0 }}>{output}</p>
            </div>
          )}
        </section>
      )}

      {!isSignedIn && (
        <section style={{ textAlign: "center", padding: "60px 24px", background: "#07070c" }}>
          <h2 style={{ fontSize: "32px", fontWeight: "800", marginBottom: "16px" }}>Sign in to use the generator</h2>
          <p style={{ color: "#7a7060", marginBottom: "32px" }}>Get 3 free generations, no credit card required.</p>
          <button onClick={() => router.push("/signin")} style={{ background: "#e8c97a", color: "#0a0a0f", padding: "16px 40px", borderRadius: "4px", fontWeight: "800", fontSize: "16px", border: "none", cursor: "pointer" }}>
            Get Started Free
          </button>
        </section>
      )}

      <section id="pricing" style={{ padding: "80px 24px", background: "#07070c" }}>
        <div style={{ maxWidth: "980px", margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: "40px", fontWeight: "900", marginBottom: "48px" }}>Simple, honest pricing.</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
            <div style={{ background: "#0f0f18", border: "1px solid #2a2a3a", borderRadius: "8px", padding: "36px 28px", display: "flex", flexDirection: "column" }}>
              <h3 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "8px" }}>Starter</h3>
              <p style={{ color: "#7a7060", fontSize: "14px", marginBottom: "20px" }}>Perfect for solo creators.</p>
              <div style={{ marginBottom: "28px" }}><span style={{ fontSize: "48px", fontWeight: "900" }}>$9</span><span style={{ color: "#7a7060" }}>/mo</span></div>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px", flex: 1 }}>
                <li style={{ padding: "8px 0", borderBottom: "1px solid #1a1a26" }}>50 AI generations/mo</li>
                <li style={{ padding: "8px 0", borderBottom: "1px solid #1a1a26" }}>5 copy templates</li>
                <li style={{ padding: "8px 0" }}>Email support</li>
              </ul>
              <a href="https://buy.stripe.com/aFaaEWeJE66EgLW9ti2cg00" target="_blank" rel="noopener noreferrer" style={{ display: "block", textAlign: "center", padding: "14px", borderRadius: "4px", fontWeight: "800", fontSize: "15px", textDecoration: "none", color: "#e8c97a", border: "1px solid #e8c97a" }}>Get Starter</a>
            </div>
            <div style={{ background: "#14111f", border: "2px solid #e8c97a", borderRadius: "8px", padding: "36px 28px", position: "relative", display: "flex", flexDirection: "column" }}>
              <span style={{ position: "absolute", top: "-13px", left: "50%", transform: "translateX(-50%)", background: "#e8c97a", color: "#0a0a0f", fontSize: "11px", fontWeight: "800", padding: "4px 16px", borderRadius: "20px", whiteSpace: "nowrap" }}>Most Popular</span>
              <h3 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "8px" }}>Pro</h3>
              <p style={{ color: "#7a7060", fontSize: "14px", marginBottom: "20px" }}>For growing businesses.</p>
              <div style={{ marginBottom: "28px" }}><span style={{ fontSize: "48px", fontWeight: "900", color: "#e8c97a" }}>$29</span><span style={{ color: "#7a7060" }}>/mo</span></div>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px", flex: 1 }}>
                <li style={{ padding: "8px 0", borderBottom: "1px solid #1a1a26" }}>Unlimited generations</li>
                <li style={{ padding: "8px 0", borderBottom: "1px solid #1a1a26" }}>30+ copy templates</li>
                <li style={{ padding: "8px 0", borderBottom: "1px solid #1a1a26" }}>Priority support</li>
                <li style={{ padding: "8px 0" }}>Brand voice settings</li>
              </ul>
              <a href="https://buy.stripe.com/6oU4gyeJEgLi53e8pe2cg01" target="_blank" rel="noopener noreferrer" style={{ display: "block", textAlign: "center", padding: "14px", borderRadius: "4px", fontWeight: "800", fontSize: "15px", textDecoration: "none", background: "#e8c97a", color: "#0a0a0f" }}>Get Pro</a>
            </div>
            <div style={{ background: "#0f0f18", border: "1px solid #2a2a3a", borderRadius: "8px", padding: "36px 28px", display: "flex", flexDirection: "column" }}>
              <h3 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "8px" }}>Business</h3>
              <p style={{ color: "#7a7060", fontSize: "14px", marginBottom: "20px" }}>Full-scale for teams.</p>
              <div style={{ marginBottom: "28px" }}><span style={{ fontSize: "48px", fontWeight: "900" }}>$69</span><span style={{ color: "#7a7060" }}>/mo</span></div>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px", flex: 1 }}>
                <li style={{ padding: "8px 0", borderBottom: "1px solid #1a1a26" }}>Everything in Pro</li>
                <li style={{ padding: "8px 0", borderBottom: "1px solid #1a1a26" }}>Team seats (5 users)</li>
                <li style={{ padding: "8px 0", borderBottom: "1px solid #1a1a26" }}>API access</li>
                <li style={{ padding: "8px 0" }}>Dedicated account manager</li>
              </ul>
              <a href="https://buy.stripe.com/9B600i30Wcv2dzKbBq2cg02" target="_blank" rel="noopener noreferrer" style={{ display: "block", textAlign: "center", padding: "14px", borderRadius: "4px", fontWeight: "800", fontSize: "15px", textDecoration: "none", color: "#e8c97a", border: "1px solid #e8c97a" }}>Get Business</a>
            </div>
          </div>
        </div>
      </section>

      <footer style={{ borderTop: "1px solid #1a1a26", padding: "32px 40px", textAlign: "center", color: "#4a4840", fontSize: "13px" }}>
        <p>2025 CopyAI Pro - All rights reserved.</p>
      </footer>

    </main>
  );
}
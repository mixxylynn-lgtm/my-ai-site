"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "./lib/supabase";

const FREE_LIMIT = 3;

export default function Home() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [brand, setBrand] = useState("");
  const [details, setDetails] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [usageCount, setUsageCount] = useState(0);
  const [userPlan, setUserPlan] = useState("free");
  const [showPaywall, setShowPaywall] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const email = localStorage.getItem("copyai_user");
    if (email) {
      setIsSignedIn(true);
      loadUserFromSupabase(email);
    }
  }, []);

  const loadUserFromSupabase = async (email: string) => {
    const { data } = await supabase.from("users").select("*").eq("email", email).single();
    if (data) {
      setUsageCount(data.generations_used);
      setUserPlan(data.plan);
      if (data.plan === "free" && data.generations_used >= FREE_LIMIT) setShowPaywall(true);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("copyai_user");
    setIsSignedIn(false);
    setUserPlan("free");
    setUsageCount(0);
    setShowPaywall(false);
  };

  const handleGenerate = async () => {
    const isPaid = userPlan !== "free";
    if (!isPaid && usageCount >= FREE_LIMIT) { setShowPaywall(true); return; }
    if (!brand || !details) { setError("Please fill in brand and details."); return; }
    setError(""); setLoading(true); setOutput("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brand, details }),
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setOutput(data.content || data.result || "No output.");
      const email = localStorage.getItem("copyai_user");
      const newCount = usageCount + 1;
      setUsageCount(newCount);
      await supabase.from("users").update({ generations_used: newCount }).eq("email", email);
      if (!isPaid && newCount >= FREE_LIMIT) setShowPaywall(true);
    } catch { setError("Something went wrong."); } 
    finally { setLoading(false); }
  };

  const isPaid = userPlan !== "free";
  const s: Record<string, React.CSSProperties> = {
    page: { fontFamily: "system-ui, -apple-system, sans-serif", background: "#09090b", minHeight: "100vh", color: "#fafafa" },
    nav: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 40px", borderBottom: "0.5px solid #27272a" },
    logo: { fontSize: "18px", fontWeight: 500, color: "#fafafa" },
    navCta: { background: "#e8c97a", color: "#09090b", border: "none", padding: "8px 20px", borderRadius: "6px", fontWeight: 500, fontSize: "14px", cursor: "pointer" },
    hero: { textAlign: "center", padding: "100px 24px 80px", maxWidth: "780px", margin: "0 auto" },
    badge: { display: "inline-block", background: "#1c1c1f", border: "0.5px solid #3f3f46", color: "#a1a1aa", fontSize: "12px", padding: "4px 12px", borderRadius: "20px", marginBottom: "28px" },
    h1: { fontSize: "clamp(36px, 6vw, 56px)", fontWeight: 500, lineHeight: 1.1, marginBottom: "20px", letterSpacing: "-1px" },
    accent: { color: "#e8c97a" },
    heroP: { fontSize: "18px", color: "#a1a1aa", marginBottom: "36px", lineHeight: 1.6, maxWidth: "500px", margin: "0 auto 36px" },
    ctaGroup: { display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" as const, marginBottom: "48px" },
    btnPrimary: { background: "#e8c97a", color: "#09090b", border: "none", padding: "12px 28px", borderRadius: "6px", fontWeight: 500, fontSize: "15px", cursor: "pointer" },
    btnSecondary: { background: "transparent", color: "#fafafa", border: "0.5px solid #3f3f46", padding: "12px 28px", borderRadius: "6px", fontWeight: 500, fontSize: "15px", cursor: "pointer" },
    stats: { display: "flex", gap: "40px", justifyContent: "center", color: "#a1a1aa", fontSize: "13px", flexWrap: "wrap" as const },
    demoBox: { background: "#111113", border: "0.5px solid #27272a", borderRadius: "12px", maxWidth: "700px", margin: "60px auto", overflow: "hidden" },
    demoHeader: { padding: "14px 20px", borderBottom: "0.5px solid #27272a", display: "flex", gap: "6px" },
    demoBody: { display: "grid", gridTemplateColumns: "1fr 1fr" },
    demoCol: { padding: "20px" },
    demoLabel: { fontSize: "10px", fontWeight: 500, letterSpacing: "1px", color: "#52525b", textTransform: "uppercase" as const, marginBottom: "10px" },
    section: { padding: "80px 24px", maxWidth: "900px", margin: "0 auto" },
    sectionLabel: { fontSize: "11px", fontWeight: 500, letterSpacing: "2px", color: "#e8c97a", textTransform: "uppercase" as const, marginBottom: "12px" },
    h2: { fontSize: "clamp(28px, 4vw, 38px)", fontWeight: 500, lineHeight: 1.2, marginBottom: "40px", letterSpacing: "-0.5px" },
    steps: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" },
    step: { background: "#111113", border: "0.5px solid #27272a", borderRadius: "10px", padding: "24px" },
    stepNum: { fontSize: "11px", color: "#e8c97a", fontWeight: 500, letterSpacing: "1px", marginBottom: "10px" },
    stepH3: { fontSize: "15px", fontWeight: 500, marginBottom: "8px" },
    stepP: { fontSize: "13px", color: "#71717a", lineHeight: 1.6, margin: 0 },
    testimonials: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" },
    testimonial: { background: "#111113", border: "0.5px solid #27272a", borderRadius: "10px", padding: "20px" },
    tP: { fontSize: "13px", color: "#a1a1aa", lineHeight: 1.6, marginBottom: "16px" },
    tAuthor: { display: "flex", alignItems: "center", gap: "10px" },
    avatar: { width: "32px", height: "32px", borderRadius: "50%", background: "#27272a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 500, color: "#e8c97a", flexShrink: 0 },
    tName: { fontSize: "13px", fontWeight: 500 },
    tRole: { fontSize: "11px", color: "#52525b" },
    pricing: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" },
    priceCard: { background: "#111113", border: "0.5px solid #27272a", borderRadius: "10px", padding: "24px", display: "flex", flexDirection: "column" as const },
    priceCardFeatured: { background: "#111113", border: "0.5px solid #e8c97a", borderRadius: "10px", padding: "24px", display: "flex", flexDirection: "column" as const },
    priceName: { fontSize: "13px", fontWeight: 500, marginBottom: "4px" },
    priceAmount: { fontSize: "36px", fontWeight: 500, margin: "12px 0 4px" },
    priceDesc: { fontSize: "12px", color: "#71717a", marginBottom: "20px", flex: 1 },
    priceBtn: { width: "100%", padding: "10px", borderRadius: "6px", fontSize: "13px", fontWeight: 500, cursor: "pointer", border: "0.5px solid #3f3f46", background: "transparent", color: "#fafafa", textDecoration: "none", textAlign: "center" as const, display: "block" },
    priceBtnFeatured: { width: "100%", padding: "10px", borderRadius: "6px", fontSize: "13px", fontWeight: 500, cursor: "pointer", border: "none", background: "#e8c97a", color: "#09090b", textDecoration: "none", textAlign: "center" as const, display: "block" },
    finalCta: { textAlign: "center" as const, padding: "80px 24px", borderTop: "0.5px solid #27272a" },
    divider: { border: "none", borderTop: "0.5px solid #27272a" },
    generatorSection: { maxWidth: "700px", margin: "0 auto", padding: "60px 24px" },
    input: { width: "100%", background: "#111113", border: "0.5px solid #27272a", borderRadius: "6px", padding: "12px 14px", color: "#fafafa", fontSize: "15px", outline: "none", boxSizing: "border-box" as const },
    label: { display: "block", fontSize: "11px", fontWeight: 500, color: "#71717a", marginBottom: "8px", textTransform: "uppercase" as const, letterSpacing: "1px" },
    paywallBox: { background: "#111113", border: "0.5px solid #e8c97a", borderRadius: "10px", padding: "36px", textAlign: "center" as const, marginBottom: "32px" },
    outputBox: { marginTop: "32px", background: "#111113", border: "0.5px solid #27272a", borderLeft: "3px solid #e8c97a", borderRadius: "6px", padding: "28px" },
  };

  return (
    <main style={s.page}>
      <nav style={s.nav}>
        <div style={s.logo}>Copy<span style={s.accent}>AI</span> Pro</div>
        <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
          <a href="#pricing" style={{ color: "#a1a1aa", fontSize: "14px", textDecoration: "none" }}>Pricing</a>
          {!isSignedIn ? (
            <>
              <a href="/signin" style={{ color: "#a1a1aa", fontSize: "14px", textDecoration: "none" }}>Sign in</a>
              <button style={s.navCta} onClick={() => router.push("/signin")}>Start free</button>
            </>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <span style={{ fontSize: "13px", color: "#71717a" }}>
                {isPaid ? `${userPlan.charAt(0).toUpperCase() + userPlan.slice(1)} plan ✓` : `${Math.max(0, FREE_LIMIT - usageCount)} generations left`}
              </span>
              <a href="#generator" style={{ ...s.navCta, textDecoration: "none" }}>Generator</a>
              <button onClick={handleSignOut} style={{ background: "transparent", color: "#71717a", border: "0.5px solid #27272a", padding: "8px 16px", borderRadius: "6px", fontSize: "14px", cursor: "pointer" }}>Sign out</button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero */}
      <div style={s.hero}>
        <div style={s.badge}>AI-powered copy for marketplace sellers</div>
        <h1 style={s.h1}>Stop losing sales to <span style={s.accent}>bad listings</span></h1>
        <p style={s.heroP}>CopyAI Pro writes high-converting product listings for Amazon, Etsy, and eBay in seconds — so you can sell more without writing a single word.</p>
        <div style={s.ctaGroup}>
          <button style={s.btnPrimary} onClick={() => router.push("/signin")}>Start free — 3 listings on us</button>
          <a href="#demo" style={{ ...s.btnSecondary, textDecoration: "none" }}>See a demo</a>
        </div>
        <div style={s.stats}>
          <div><strong style={{ color: "#fafafa", display: "block", fontSize: "22px", fontWeight: 500 }}>2,400+</strong> sellers trust us</div>
          <div><strong style={{ color: "#fafafa", display: "block", fontSize: "22px", fontWeight: 500 }}>3 free</strong> listings to start</div>
          <div><strong style={{ color: "#fafafa", display: "block", fontSize: "22px", fontWeight: 500 }}>30 sec</strong> to generate</div>
        </div>
      </div>

      {/* Demo */}
      <div id="demo" style={s.demoBox}>
        <div style={s.demoHeader}>
          <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ef4444" }}></div>
          <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#f59e0b" }}></div>
          <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#22c55e" }}></div>
        </div>
        <div style={s.demoBody}>
          <div style={{ ...s.demoCol, borderRight: "0.5px solid #27272a" }}>
            <div style={s.demoLabel}>Before</div>
            <p style={{ color: "#52525b", fontSize: "13px", lineHeight: 1.6 }}>Handmade candle. Smells good. Made with soy wax. Different scents available.</p>
          </div>
          <div style={s.demoCol}>
            <div style={s.demoLabel}>After — CopyAI Pro</div>
            <p style={{ color: "#a1a1aa", fontSize: "13px", lineHeight: 1.6 }}><span style={{ color: "#e8c97a", fontWeight: 500 }}>Luxury Soy Candle | 60-Hour Burn | Hand-Poured</span><br /><br />Transform your space with our hand-poured soy wax candles. 100% natural, toxin-free, and crafted to fill your home with rich, lasting fragrance for up to 60 hours...</p>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div style={s.section}>
        <div style={s.sectionLabel}>How it works</div>
        <h2 style={s.h2}>From blank page to live listing in 3 steps</h2>
        <div style={s.steps}>
          {[
            { num: "01", title: "Describe your product", desc: "Tell us your brand name and key details about what you're selling." },
            { num: "02", title: "AI writes the copy", desc: "Our AI generates a full listing — title, bullets, description — optimized to convert." },
            { num: "03", title: "Paste and sell", desc: "Copy your listing, paste it into Amazon, Etsy, or eBay, and start getting sales." },
          ].map(step => (
            <div key={step.num} style={s.step}>
              <div style={s.stepNum}>{step.num}</div>
              <h3 style={s.stepH3}>{step.title}</h3>
              <p style={s.stepP}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div style={{ ...s.section, borderTop: "0.5px solid #27272a" }}>
        <div style={s.sectionLabel}>Social proof</div>
        <h2 style={s.h2}>Sellers who stopped writing, started selling</h2>
        <div style={s.testimonials}>
          {[
            { initials: "JM", quote: "I went from spending 2 hours per listing to under 5 minutes. My conversion rate went up 34% in the first month.", name: "Jamie M.", role: "Etsy seller, 400+ sales/mo" },
            { initials: "RK", quote: "Finally an AI tool that actually sounds human. My Amazon listings went from page 4 to page 1 in 3 weeks.", name: "Ryan K.", role: "Amazon FBA seller" },
            { initials: "SL", quote: "I sell on 3 platforms and was drowning in copy. CopyAI Pro saved me 10+ hours a week. Worth every penny.", name: "Sara L.", role: "eBay powerseller" },
          ].map(t => (
            <div key={t.initials} style={s.testimonial}>
              <p style={s.tP}>"{t.quote}"</p>
              <div style={s.tAuthor}>
                <div style={s.avatar}>{t.initials}</div>
                <div>
                  <div style={s.tName}>{t.name}</div>
                  <div style={s.tRole}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing */}
      <div id="pricing" style={{ ...s.section, borderTop: "0.5px solid #27272a" }}>
        <div style={s.sectionLabel}>Pricing</div>
        <h2 style={s.h2}>Simple pricing, no surprises</h2>
        <div style={s.pricing}>
          <div style={s.priceCard}>
            <div style={s.priceName}>Starter</div>
            <div style={s.priceAmount}>$9<span style={{ fontSize: "14px", color: "#71717a", fontWeight: 400 }}>/mo</span></div>
            <div style={s.priceDesc}>50 listings/mo. Perfect for solo sellers.</div>
            <a href="https://buy.stripe.com/aFaaEWeJE66EgLW9ti2cg00" target="_blank" rel="noopener noreferrer" style={s.priceBtn}>Get Starter</a>
          </div>
          <div style={s.priceCardFeatured}>
            <div style={{ ...s.priceName, color: "#e8c97a" }}>Pro — most popular</div>
            <div style={s.priceAmount}>$29<span style={{ fontSize: "14px", color: "#71717a", fontWeight: 400 }}>/mo</span></div>
            <div style={s.priceDesc}>Unlimited listings. All platforms.</div>
            <a href="https://buy.stripe.com/6oU4gyeJEgLi53e8pe2cg01" target="_blank" rel="noopener noreferrer" style={s.priceBtnFeatured}>Get Pro</a>
          </div>
          <div style={s.priceCard}>
            <div style={s.priceName}>Business</div>
            <div style={s.priceAmount}>$69<span style={{ fontSize: "14px", color: "#71717a", fontWeight: 400 }}>/mo</span></div>
            <div style={s.priceDesc}>Everything in Pro + 5 team seats.</div>
            <a href="https://buy.stripe.com/9B600i30Wcv2dzKbBq2cg02" target="_blank" rel="noopener noreferrer" style={s.priceBtn}>Get Business</a>
          </div>
        </div>
      </div>

      {/* Generator (signed in) */}
      {isSignedIn && (
        <div id="generator" style={{ ...s.section, borderTop: "0.5px solid #27272a" }}>
          <div style={s.sectionLabel}>Generator</div>
          <h2 style={{ ...s.h2, marginBottom: "8px" }}>AI Copy Generator</h2>
          <p style={{ color: "#71717a", fontSize: "14px", marginBottom: "32px" }}>
            {isPaid ? "Unlimited generations — enjoy!" : `${Math.max(0, FREE_LIMIT - usageCount)} of ${FREE_LIMIT} free generations remaining`}
          </p>

          {showPaywall && !isPaid && (
            <div style={s.paywallBox}>
              <h3 style={{ fontSize: "22px", fontWeight: 500, marginBottom: "12px" }}>You've used your 3 free listings</h3>
              <p style={{ color: "#71717a", marginBottom: "28px", fontSize: "15px" }}>Upgrade to keep generating high-converting copy.</p>
              <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" as const }}>
                <a href="https://buy.stripe.com/aFaaEWeJE66EgLW9ti2cg00" target="_blank" rel="noopener noreferrer" style={s.priceBtnFeatured}>Get Starter — $9/mo</a>
                <a href="https://buy.stripe.com/6oU4gyeJEgLi53e8pe2cg01" target="_blank" rel="noopener noreferrer" style={{ ...s.priceBtn, width: "auto", padding: "10px 24px" }}>Get Pro — $29/mo</a>
              </div>
            </div>
          )}

          {(isPaid || !showPaywall) && (
            <>
              <div style={{ marginBottom: "16px" }}>
                <label style={s.label}>Brand Name</label>
                <input type="text" placeholder="e.g. CopyAI Pro" value={brand} onChange={e => setBrand(e.target.value)} style={s.input} />
              </div>
              <div style={{ marginBottom: "24px" }}>
                <label style={s.label}>Product Details</label>
                <textarea rows={4} placeholder="Describe your product, key features, target audience..." value={details} onChange={e => setDetails(e.target.value)} style={{ ...s.input, resize: "vertical" }} />
              </div>
              {error && <p style={{ color: "#ef4444", marginBottom: "16px", fontSize: "14px" }}>{error}</p>}
              <button onClick={handleGenerate} disabled={loading} style={{ ...s.btnPrimary, width: "100%", padding: "14px", fontSize: "15px", opacity: loading ? 0.6 : 1 }}>
                {loading ? "Generating..." : isPaid ? "Generate copy" : `Generate copy (${Math.max(0, FREE_LIMIT - usageCount)} left)`}
              </button>
            </>
          )}

          {output && (
            <div style={s.outputBox}>
              <p style={{ fontSize: "11px", color: "#e8c97a", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "16px" }}>Generated Copy</p>
              <p style={{ whiteSpace: "pre-wrap", lineHeight: 1.8, color: "#fafafa", margin: 0 }}>{output}</p>
            </div>
          )}
        </div>
      )}

      {/* Final CTA */}
      <div style={s.finalCta}>
        <h2 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 500, marginBottom: "16px", letterSpacing: "-0.5px" }}>Your next listing writes itself</h2>
        <p style={{ color: "#a1a1aa", fontSize: "16px", marginBottom: "32px" }}>Start free. No credit card required. 3 listings on us.</p>
        <button style={{ ...s.btnPrimary, fontSize: "16px", padding: "14px 36px" }} onClick={() => router.push("/signin")}>Start free today</button>
      </div>

      <footer style={{ borderTop: "0.5px solid #27272a", padding: "32px 40px", textAlign: "center", color: "#3f3f46", fontSize: "13px" }}>
        <p>© 2026 CopyAI Pro — All rights reserved.</p>
      </footer>
    </main>
  );
}
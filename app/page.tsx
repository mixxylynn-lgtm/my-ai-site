"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "./lib/supabase";

const FREE_LIMIT = 3;

export default function Home() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [brand, setBrand] = useState("");
  const [details, setDetails] = useState("");
  const [images, setImages] = useState<{data: string, type: string}[]>([]);
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const limited = files.slice(0, 3);
    Promise.all(
      limited.map(file => new Promise<{data: string, type: string}>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve({ data: reader.result as string, type: file.type });
        reader.readAsDataURL(file);
      }))
    ).then(results => setImages(results));
  };

  const handleGenerate = async () => {
    const isPaid = userPlan !== "free";
    if (!isPaid && usageCount >= FREE_LIMIT) { setShowPaywall(true); return; }
    if (!brand && !details && images.length === 0) { setError("Please add photos or fill in some details."); return; }
    setError(""); setLoading(true); setOutput("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brand, details, images }),
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

  return (
    <main style={{ fontFamily: "system-ui, -apple-system, sans-serif", background: "#09090b", minHeight: "100vh", color: "#fafafa" }}>

      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 40px", borderBottom: "0.5px solid #27272a" }}>
        <div style={{ fontSize: "18px", fontWeight: 500 }}>Copy<span style={{ color: "#e8c97a" }}>AI</span> Pro</div>
        <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
          <a href="#pricing" style={{ color: "#a1a1aa", fontSize: "14px", textDecoration: "none" }}>Pricing</a>
          {!isSignedIn ? (
            <>
              <a href="/signin" style={{ color: "#a1a1aa", fontSize: "14px", textDecoration: "none" }}>Sign in</a>
              <button onClick={() => router.push("/signin")} style={{ background: "#e8c97a", color: "#09090b", border: "none", padding: "8px 20px", borderRadius: "6px", fontWeight: 500, fontSize: "14px", cursor: "pointer" }}>Start free</button>
            </>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <span style={{ fontSize: "13px", color: "#71717a" }}>
                {isPaid ? `${userPlan.charAt(0).toUpperCase() + userPlan.slice(1)} plan ✓` : `${Math.max(0, FREE_LIMIT - usageCount)} generations left`}
              </span>
              <a href="#generator" style={{ background: "#e8c97a", color: "#09090b", border: "none", padding: "8px 20px", borderRadius: "6px", fontWeight: 500, fontSize: "14px", cursor: "pointer", textDecoration: "none" }}>Generator</a>
              <button onClick={handleSignOut} style={{ background: "transparent", color: "#71717a", border: "0.5px solid #27272a", padding: "8px 16px", borderRadius: "6px", fontSize: "14px", cursor: "pointer" }}>Sign out</button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero */}
      <div style={{ textAlign: "center", padding: "100px 24px 80px", maxWidth: "780px", margin: "0 auto" }}>
        <div style={{ display: "inline-block", background: "#1c1c1f", border: "0.5px solid #3f3f46", color: "#a1a1aa", fontSize: "12px", padding: "4px 12px", borderRadius: "20px", marginBottom: "28px" }}>AI-powered copy for eBay, Etsy & Amazon sellers</div>
        <h1 style={{ fontSize: "clamp(36px, 6vw, 56px)", fontWeight: 500, lineHeight: 1.1, marginBottom: "20px", letterSpacing: "-1px" }}>
          Stop losing eBay sales to <span style={{ color: "#e8c97a" }}>bad listings</span>
        </h1>
        <p style={{ fontSize: "18px", color: "#a1a1aa", marginBottom: "36px", lineHeight: 1.6, maxWidth: "500px", margin: "0 auto 36px" }}>
          CopyAI Pro writes high-converting eBay listings in seconds — works for Etsy and Amazon too. Upload photos or describe your item and let AI do the rest.
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", marginBottom: "48px" }}>
          <button onClick={() => router.push("/signin")} style={{ background: "#e8c97a", color: "#09090b", border: "none", padding: "12px 28px", borderRadius: "6px", fontWeight: 500, fontSize: "15px", cursor: "pointer" }}>Start free — 3 listings on us</button>
          <a href="#demo" style={{ background: "transparent", color: "#fafafa", border: "0.5px solid #3f3f46", padding: "12px 28px", borderRadius: "6px", fontWeight: 500, fontSize: "15px", textDecoration: "none" }}>See a demo</a>
        </div>
        <div style={{ display: "flex", gap: "40px", justifyContent: "center", color: "#a1a1aa", fontSize: "13px", flexWrap: "wrap" }}>
          <div><strong style={{ color: "#fafafa", display: "block", fontSize: "22px", fontWeight: 500 }}>2,400+</strong>eBay sellers trust us</div>
          <div><strong style={{ color: "#fafafa", display: "block", fontSize: "22px", fontWeight: 500 }}>3 free</strong>listings to start</div>
          <div><strong style={{ color: "#fafafa", display: "block", fontSize: "22px", fontWeight: 500 }}>30 sec</strong>to generate</div>
        </div>
      </div>

      {/* Demo */}
      <div id="demo" style={{ background: "#111113", border: "0.5px solid #27272a", borderRadius: "12px", maxWidth: "700px", margin: "0 auto 80px", overflow: "hidden" }}>
        <div style={{ padding: "14px 20px", borderBottom: "0.5px solid #27272a", display: "flex", gap: "6px" }}>
          <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ef4444" }}></div>
          <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#f59e0b" }}></div>
          <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#22c55e" }}></div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
          <div style={{ padding: "20px", borderRight: "0.5px solid #27272a" }}>
            <div style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "1px", color: "#52525b", textTransform: "uppercase", marginBottom: "10px" }}>Before</div>
            <p style={{ color: "#52525b", fontSize: "13px", lineHeight: 1.6 }}>Blue vintage jacket. Size M. Good condition. Pick up or shipping available.</p>
          </div>
          <div style={{ padding: "20px" }}>
            <div style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "1px", color: "#52525b", textTransform: "uppercase", marginBottom: "10px" }}>After — CopyAI Pro</div>
            <p style={{ color: "#a1a1aa", fontSize: "13px", lineHeight: 1.6 }}><span style={{ color: "#e8c97a", fontWeight: 500 }}>Vintage 90s Levi's Denim Jacket | Size M | Distressed Wash | Rare Find — Ships Fast</span><br /><br />Head-turning vintage style meets everyday wearability. This authentic 90s Levi's denim jacket features a classic distressed wash, perfect for collectors and streetwear lovers alike...</p>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div style={{ padding: "80px 24px", maxWidth: "900px", margin: "0 auto", borderTop: "0.5px solid #27272a" }}>
        <div style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "2px", color: "#e8c97a", textTransform: "uppercase", marginBottom: "12px" }}>How it works</div>
        <h2 style={{ fontSize: "clamp(28px, 4vw, 38px)", fontWeight: 500, lineHeight: 1.2, marginBottom: "40px", letterSpacing: "-0.5px" }}>From blank page to live listing in 3 steps</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
          {[
            { num: "01", title: "Upload photos or describe your item", desc: "Snap a photo of your item or type a few details — condition, size, brand, era, anything relevant." },
            { num: "02", title: "AI writes the listing", desc: "Our AI analyzes your photos and details to generate a full eBay listing — title, description, keywords — optimized to convert." },
            { num: "03", title: "Paste and sell", desc: "Copy your listing, paste it into eBay, Etsy, or Amazon, and start getting sales." },
          ].map(step => (
            <div key={step.num} style={{ background: "#111113", border: "0.5px solid #27272a", borderRadius: "10px", padding: "24px" }}>
              <div style={{ fontSize: "11px", color: "#e8c97a", fontWeight: 500, letterSpacing: "1px", marginBottom: "10px" }}>{step.num}</div>
              <h3 style={{ fontSize: "15px", fontWeight: 500, marginBottom: "8px" }}>{step.title}</h3>
              <p style={{ fontSize: "13px", color: "#71717a", lineHeight: 1.6, margin: 0 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div style={{ padding: "80px 24px", maxWidth: "900px", margin: "0 auto", borderTop: "0.5px solid #27272a" }}>
        <div style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "2px", color: "#e8c97a", textTransform: "uppercase", marginBottom: "12px" }}>Social proof</div>
        <h2 style={{ fontSize: "clamp(28px, 4vw, 38px)", fontWeight: 500, lineHeight: 1.2, marginBottom: "40px", letterSpacing: "-0.5px" }}>Sellers who stopped writing, started selling</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
          {[
            { initials: "JM", quote: "I flip 50+ items a week on eBay. Writing listings was killing me. CopyAI Pro cut my listing time by 80% — I'm making more and working less.", name: "Jamie M.", role: "eBay powerseller, 2,000+ sales" },
            { initials: "RK", quote: "My eBay titles used to be terrible. Now they're optimized and my click-through rate doubled in 2 weeks. This tool pays for itself.", name: "Ryan K.", role: "eBay & Amazon seller" },
            { initials: "SL", quote: "I was spending 3 hours a day writing listings. Now it takes 20 minutes. CopyAI Pro is the best $9 I spend every month.", name: "Sara L.", role: "Etsy & eBay seller" },
          ].map(t => (
            <div key={t.initials} style={{ background: "#111113", border: "0.5px solid #27272a", borderRadius: "10px", padding: "20px" }}>
              <p style={{ fontSize: "13px", color: "#a1a1aa", lineHeight: 1.6, marginBottom: "16px" }}>"{t.quote}"</p>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#27272a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 500, color: "#e8c97a", flexShrink: 0 }}>{t.initials}</div>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 500 }}>{t.name}</div>
                  <div style={{ fontSize: "11px", color: "#52525b" }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing */}
      <div id="pricing" style={{ padding: "80px 24px", maxWidth: "900px", margin: "0 auto", borderTop: "0.5px solid #27272a" }}>
        <div style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "2px", color: "#e8c97a", textTransform: "uppercase", marginBottom: "12px" }}>Pricing</div>
        <h2 style={{ fontSize: "clamp(28px, 4vw, 38px)", fontWeight: 500, lineHeight: 1.2, marginBottom: "40px", letterSpacing: "-0.5px" }}>Simple pricing, no surprises</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
          <div style={{ background: "#111113", border: "0.5px solid #27272a", borderRadius: "10px", padding: "24px", display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: "13px", fontWeight: 500, marginBottom: "4px" }}>Starter</div>
            <div style={{ fontSize: "36px", fontWeight: 500, margin: "12px 0 4px" }}>$9<span style={{ fontSize: "14px", color: "#71717a", fontWeight: 400 }}>/mo</span></div>
            <div style={{ fontSize: "12px", color: "#71717a", marginBottom: "20px", flex: 1 }}>50 listings/mo. Perfect for casual flippers.</div>
            <a href="https://buy.stripe.com/aFaaEWeJE66EgLW9ti2cg00" target="_blank" rel="noopener noreferrer" style={{ width: "100%", padding: "10px", borderRadius: "6px", fontSize: "13px", fontWeight: 500, border: "0.5px solid #3f3f46", background: "transparent", color: "#fafafa", textDecoration: "none", textAlign: "center", display: "block" }}>Get Starter</a>
          </div>
          <div style={{ background: "#111113", border: "0.5px solid #e8c97a", borderRadius: "10px", padding: "24px", display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: "13px", fontWeight: 500, marginBottom: "4px", color: "#e8c97a" }}>Pro — most popular</div>
            <div style={{ fontSize: "36px", fontWeight: 500, margin: "12px 0 4px" }}>$29<span style={{ fontSize: "14px", color: "#71717a", fontWeight: 400 }}>/mo</span></div>
            <div style={{ fontSize: "12px", color: "#71717a", marginBottom: "20px", flex: 1 }}>Unlimited listings. Best for serious sellers.</div>
            <a href="https://buy.stripe.com/6oU4gyeJEgLi53e8pe2cg01" target="_blank" rel="noopener noreferrer" style={{ width: "100%", padding: "10px", borderRadius: "6px", fontSize: "13px", fontWeight: 500, border: "none", background: "#e8c97a", color: "#09090b", textDecoration: "none", textAlign: "center", display: "block" }}>Get Pro</a>
          </div>
          <div style={{ background: "#111113", border: "0.5px solid #27272a", borderRadius: "10px", padding: "24px", display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: "13px", fontWeight: 500, marginBottom: "4px" }}>Business</div>
            <div style={{ fontSize: "36px", fontWeight: 500, margin: "12px 0 4px" }}>$69<span style={{ fontSize: "14px", color: "#71717a", fontWeight: 400 }}>/mo</span></div>
            <div style={{ fontSize: "12px", color: "#71717a", marginBottom: "20px", flex: 1 }}>Everything in Pro + 5 team seats.</div>
            <a href="https://buy.stripe.com/9B600i30Wcv2dzKbBq2cg02" target="_blank" rel="noopener noreferrer" style={{ width: "100%", padding: "10px", borderRadius: "6px", fontSize: "13px", fontWeight: 500, border: "0.5px solid #3f3f46", background: "transparent", color: "#fafafa", textDecoration: "none", textAlign: "center", display: "block" }}>Get Business</a>
          </div>
        </div>
      </div>

      {/* Generator */}
      {isSignedIn && (
        <div id="generator" style={{ padding: "80px 24px", maxWidth: "700px", margin: "0 auto", borderTop: "0.5px solid #27272a" }}>
          <div style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "2px", color: "#e8c97a", textTransform: "uppercase", marginBottom: "12px" }}>Generator</div>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 38px)", fontWeight: 500, marginBottom: "8px", letterSpacing: "-0.5px" }}>AI Listing Generator</h2>
          <p style={{ color: "#71717a", fontSize: "14px", marginBottom: "32px" }}>
            {isPaid ? "Unlimited generations — enjoy!" : `${Math.max(0, FREE_LIMIT - usageCount)} of ${FREE_LIMIT} free generations remaining`}
          </p>

          {showPaywall && !isPaid && (
            <div style={{ background: "#111113", border: "0.5px solid #e8c97a", borderRadius: "10px", padding: "36px", textAlign: "center", marginBottom: "32px" }}>
              <h3 style={{ fontSize: "22px", fontWeight: 500, marginBottom: "12px" }}>You've used your 3 free listings</h3>
              <p style={{ color: "#71717a", marginBottom: "28px", fontSize: "15px" }}>Upgrade to keep generating high-converting listings.</p>
              <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                <a href="https://buy.stripe.com/aFaaEWeJE66EgLW9ti2cg00" target="_blank" rel="noopener noreferrer" style={{ background: "#e8c97a", color: "#09090b", padding: "10px 24px", borderRadius: "6px", fontWeight: 500, fontSize: "14px", textDecoration: "none" }}>Get Starter — $9/mo</a>
                <a href="https://buy.stripe.com/6oU4gyeJEgLi53e8pe2cg01" target="_blank" rel="noopener noreferrer" style={{ background: "transparent", color: "#e8c97a", padding: "10px 24px", borderRadius: "6px", fontWeight: 500, fontSize: "14px", textDecoration: "none", border: "0.5px solid #e8c97a" }}>Get Pro — $29/mo</a>
              </div>
            </div>
          )}

          {(isPaid || !showPaywall) && (
            <>
              {/* Image Upload */}
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 500, color: "#71717a", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px" }}>Item Photos (up to 3)</label>
                <div
                  onClick={() => document.getElementById("image-upload")?.click()}
                  style={{ border: "0.5px dashed #3f3f46", borderRadius: "6px", padding: "24px", textAlign: "center", cursor: "pointer", background: "#111113" }}
                >
                  <p style={{ color: "#71717a", fontSize: "13px", margin: 0 }}>📸 Click to upload photos — AI will analyze them to write your listing</p>
                  <p style={{ color: "#52525b", fontSize: "11px", margin: "4px 0 0" }}>JPG, PNG — up to 3 images</p>
                </div>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  style={{ display: "none" }}
                  onChange={handleImageUpload}
                />
                {images.length > 0 && (
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "8px" }}>
                    {images.map((img, i) => (
                      <div key={i} style={{ position: "relative" }}>
                        <img src={img.data} alt={`upload ${i + 1}`} style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "6px", border: "0.5px solid #27272a" }} />
                        <button
                          onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                          style={{ position: "absolute", top: "-6px", right: "-6px", background: "#ef4444", border: "none", borderRadius: "50%", width: "18px", height: "18px", color: "white", fontSize: "10px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                        >×</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Brand */}
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 500, color: "#71717a", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px" }}>Brand / Store Name</label>
                <input type="text" placeholder="e.g. Stevie's Thrift Shop" value={brand} onChange={e => setBrand(e.target.value)} style={{ width: "100%", background: "#111113", border: "0.5px solid #27272a", borderRadius: "6px", padding: "12px 14px", color: "#fafafa", fontSize: "15px", outline: "none", boxSizing: "border-box" }} />
              </div>

              {/* Details */}
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 500, color: "#71717a", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px" }}>Item Details (optional if uploading photos)</label>
                <textarea rows={4} placeholder="Describe your item — brand, size, condition, color, era, anything relevant..." value={details} onChange={e => setDetails(e.target.value)} style={{ width: "100%", background: "#111113", border: "0.5px solid #27272a", borderRadius: "6px", padding: "12px 14px", color: "#fafafa", fontSize: "15px", outline: "none", boxSizing: "border-box", resize: "vertical" }} />
              </div>

              {error && <p style={{ color: "#ef4444", marginBottom: "16px", fontSize: "14px" }}>{error}</p>}
              <button onClick={handleGenerate} disabled={loading} style={{ background: loading ? "#4a4030" : "#e8c97a", color: "#09090b", border: "none", padding: "14px", borderRadius: "6px", fontWeight: 500, fontSize: "15px", cursor: "pointer", width: "100%", opacity: loading ? 0.6 : 1 }}>
                {loading ? "Analyzing & generating..." : isPaid ? "Generate listing" : `Generate listing (${Math.max(0, FREE_LIMIT - usageCount)} left)`}
              </button>
            </>
          )}

          {output && (
            <div style={{ marginTop: "32px", background: "#111113", border: "0.5px solid #27272a", borderLeft: "3px solid #e8c97a", borderRadius: "6px", padding: "28px" }}>
              <p style={{ fontSize: "11px", color: "#e8c97a", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "16px" }}>Generated Listing</p>
              <div style={{ lineHeight: 1.8, color: "#fafafa" }} dangerouslySetInnerHTML={{ __html: output
  .replace(/^### \*\*(.*?)\*\*/gm, '<h3 style="font-size:15px;font-weight:500;color:#fafafa;margin:20px 0 8px">$1</h3>')
  .replace(/^### (.*?)$/gm, '<h3 style="font-size:15px;font-weight:500;color:#fafafa;margin:20px 0 8px">$1</h3>')
  .replace(/^## \*\*(.*?)\*\*/gm, '<h2 style="font-size:17px;font-weight:500;color:#e8c97a;margin:20px 0 8px">$1</h2>')
  .replace(/^## (.*?)$/gm, '<h2 style="font-size:17px;font-weight:500;color:#e8c97a;margin:20px 0 8px">$1</h2>')
  .replace(/^# (.*?)$/gm, '<h1 style="font-size:20px;font-weight:500;color:#e8c97a;margin:0 0 16px">$1</h1>')
  .replace(/\*\*(.*?)\*\*/g, '<strong style="color:#fafafa;font-weight:500">$1</strong>')
  .replace(/`(.*?)`/g, '<code style="background:#1c1c1f;padding:2px 6px;border-radius:4px;font-size:13px;color:#e8c97a">$1</code>')
  .replace(/^- ✅ (.*?)$/gm, '<div style="display:flex;gap:8px;margin:4px 0"><span style="color:#22c55e">✅</span><span>$1</span></div>')
  .replace(/^- (.*?)$/gm, '<div style="display:flex;gap:8px;margin:4px 0"><span style="color:#e8c97a">•</span><span>$1</span></div>')
  .replace(/^---$/gm, '<hr style="border:none;border-top:0.5px solid #27272a;margin:16px 0"/>')
  .replace(/\n\n/g, '<br/><br/>')
}} />
            </div>
          )}
        </div>
      )}

      {/* Final CTA */}
      <div style={{ textAlign: "center", padding: "80px 24px", borderTop: "0.5px solid #27272a" }}>
        <h2 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 500, marginBottom: "16px", letterSpacing: "-0.5px" }}>Your next listing writes itself</h2>
        <p style={{ color: "#a1a1aa", fontSize: "16px", marginBottom: "32px" }}>Upload a photo. Get a listing. Start selling.</p>
        <button onClick={() => router.push("/signin")} style={{ background: "#e8c97a", color: "#09090b", border: "none", padding: "14px 36px", borderRadius: "6px", fontWeight: 500, fontSize: "16px", cursor: "pointer" }}>Start free today</button>
      </div>

      <footer style={{ borderTop: "0.5px solid #27272a", padding: "32px 40px", textAlign: "center", color: "#3f3f46", fontSize: "13px" }}>
        <p>© 2026 CopyAI Pro — All rights reserved.</p>
      </footer>
    </main>
  );
}
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "./lib/supabase";

function formatText(text: string) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/\n/g, "<br/>");
}

export default function Home() {
  const [item, setItem] = useState("");
  const [platform, setPlatform] = useState("eBay");
  const [result, setResult] = useState("");
  const [price, setPrice] = useState("");
  const [xpost, setXpost] = useState("");
  const [photo, setPhoto] = useState<{ data: string; type: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [generationsUsed, setGenerationsUsed] = useState(0);
  const [showPaywall, setShowPaywall] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const email = localStorage.getItem("copyai_user");
    if (email) {
      setUserEmail(email);
      fetchUserData(email);
    }
  }, []);

  const fetchUserData = async (email: string) => {
    const { data } = await supabase
      .from("users")
      .select("generations_used, plan")
      .eq("email", email)
      .single();
    if (data) {
      setGenerationsUsed(data.generations_used || 0);
      if (data.plan === "free" && (data.generations_used || 0) >= 3) {
        setShowPaywall(true);
      }
    }
  };

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto({ data: reader.result as string, type: file.type });
    reader.readAsDataURL(file);
  };

  const generate = async () => {
    if (!userEmail) {
      router.push("/signin");
      return;
    }
    if (showPaywall) return;
    if (!item && !photo) return;
    setLoading(true);
    setResult("");
    setPrice("");
    setXpost("");

    const details = `Platform: ${platform}. Write a full optimized listing and suggest the best price to sell it for.`;

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        brand: item,
        details,
        images: photo ? [photo] : undefined,
      }),
    });

    const data = await res.json();
    setResult(data.content || data.error || "Something went wrong.");
    setPrice(data.price || "");
    setXpost(data.xpost || "");

    const newCount = generationsUsed + 1;
    await supabase
      .from("users")
      .update({ generations_used: newCount })
      .eq("email", userEmail);
    setGenerationsUsed(newCount);
    if (newCount >= 3) setShowPaywall(true);

    setLoading(false);
  };

  const handleSignOut = () => {
    localStorage.removeItem("copyai_user");
    setUserEmail(null);
    setGenerationsUsed(0);
    setShowPaywall(false);
  };

  const [billing, setBilling] = useState<"monthly" | "annual" | "lifetime">("monthly");
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const startCheckout = async (plan: "monthly" | "annual" | "lifetime") => {
    setCheckoutLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, email: userEmail }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Could not start checkout. Please try again.");
        setCheckoutLoading(false);
      }
    } catch {
      alert("Could not start checkout. Please try again.");
      setCheckoutLoading(false);
    }
  };

  return (
    <main style={{ minHeight: "100vh", background: "radial-gradient(1100px 600px at 50% -120px, rgba(34,211,238,0.16), rgba(34,211,238,0.05) 35%, transparent 70%), #0a0a0a", backgroundRepeat: "no-repeat", color: "white", fontFamily: "system-ui,sans-serif" }}>

      <header className="site-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #1f1f1f" }}>
        <div style={{ fontSize: "18px", fontWeight: "bold" }}>CopyAI Pro</div>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          {userEmail ? (
            <>
              <span style={{ color: "#555", fontSize: "13px" }}>{userEmail}</span>
              <button onClick={handleSignOut} style={{ background: "transparent", border: "1px solid #333", color: "#555", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", fontSize: "13px" }}>Sign out</button>
            </>
          ) : (
            <button onClick={() => router.push("/signin")} style={{ background: "#22d3ee", color: "black", fontWeight: "bold", padding: "10px 22px", borderRadius: "8px", border: "none", cursor: "pointer", fontSize: "14px" }}>
              Start free
            </button>
          )}
        </div>
      </header>

      <section className="hero-section" style={{ maxWidth: "680px", margin: "0 auto", textAlign: "center" }}>
        <div style={{ display: "inline-block", background: "#1a1a1a", color: "#aaa", fontSize: "13px", padding: "6px 16px", borderRadius: "999px", marginBottom: "28px", border: "1px solid #2a2a2a" }}>
          Built by a reseller, for resellers
        </div>
        <h1 className="hero-h1" style={{ fontWeight: "800", lineHeight: "1.15", marginBottom: "20px", letterSpacing: "-1px" }}>
          Snap a photo.<br />
          <span style={{ color: "#22d3ee" }}>Get a listing.</span>
        </h1>
        <p style={{ color: "#888", fontSize: "17px", lineHeight: "1.75", maxWidth: "520px", margin: "0 auto 16px" }}>
          Take a photo of your item and CopyAI Pro — an AI eBay listing generator — writes an optimized listing and prices it in 30 seconds. No typing needed. Works for eBay, Etsy, Depop, Poshmark and Facebook Marketplace, or write eBay listings with AI from a quick description.
        </p>
        <p style={{ color: "#555", fontSize: "14px", marginBottom: "32px" }}>
          — Stevie Ray, <a href="https://x.com/ThriftAndStack" target="_blank" style={{ color: "#666", textDecoration: "none" }}>@ThriftAndStack</a> — I built this because I sell on eBay myself and got tired of writing listings
        </p>
        <a href="#tools" style={{ display: "inline-block", background: "#22d3ee", color: "black", fontWeight: "bold", padding: "14px 36px", borderRadius: "8px", textDecoration: "none", fontSize: "16px" }}>
          Snap a photo — get my listing free
        </a>
        <p style={{ color: "#444", fontSize: "13px", marginTop: "12px" }}>3 free listings. No credit card needed.</p>
      </section>

      <section style={{ maxWidth: "780px", margin: "0 auto", padding: "0 24px 72px" }}>
        <div className="grid-2">
          <div style={{ background: "#111", border: "1px solid #1f1f1f", borderRadius: "12px", padding: "24px" }}>
            <div style={{ fontSize: "11px", fontWeight: "700", color: "#444", marginBottom: "12px", letterSpacing: "1.5px" }}>📸 YOUR PHOTO</div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0a0a", border: "1px solid #1f1f1f", borderRadius: "10px", padding: "28px", marginBottom: "10px" }}>
              <div style={{ fontSize: "64px", lineHeight: 1 }}>🧥</div>
            </div>
            <p style={{ color: "#555", fontSize: "13px", lineHeight: "1.6", margin: 0, textAlign: "center" }}>
              Just a quick phone snap — no caption needed.
            </p>
          </div>
          <div style={{ background: "#0d1f24", border: "1px solid #22d3ee", borderRadius: "12px", padding: "24px" }}>
            <div style={{ fontSize: "11px", fontWeight: "700", color: "#22d3ee", marginBottom: "12px", letterSpacing: "1.5px" }}>AFTER — WRITTEN FROM YOUR PHOTO</div>
            <p style={{ color: "#ddd", fontSize: "14px", lineHeight: "1.7", margin: 0 }}>
              <strong style={{ color: "white" }}>Vintage 90s Levi's Denim Jacket | Size M | Distressed Wash | Rare Find — Ships Fast</strong>
              <br /><br />
              Head-turning vintage style meets everyday wearability. Authentic 90s Levi's with classic distressed wash — perfect for collectors and streetwear lovers. Ships same day.
            </p>
          </div>
        </div>
      </section>

      <section id="tools" style={{ maxWidth: "620px", margin: "0 auto", padding: "0 24px 80px" }}>
        <h2 style={{ textAlign: "center", fontSize: "22px", fontWeight: "700", marginBottom: "6px" }}>Write eBay listings with AI — free to try</h2>
        <p style={{ textAlign: "center", color: "#666", fontSize: "14px", marginBottom: "20px" }}>
          Snap a photo of your item and get a ready-to-paste listing <span style={{ color: "#22d3ee" }}>and</span> a suggested price — together. Or type a description instead.
        </p>

        <div style={{ background: "#111", border: "1px solid #1f1f1f", borderRadius: "16px", padding: "28px" }}>

          {userEmail && (
            <div style={{ marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "13px", color: "#555" }}>Free listings used</span>
              <span style={{ fontSize: "13px", color: generationsUsed >= 3 ? "#ef4444" : "#22d3ee", fontWeight: "700" }}>
                {Math.min(generationsUsed, 3)} / 3
              </span>
            </div>
          )}

          {showPaywall ? (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ fontSize: "32px", marginBottom: "12px" }}>🔒</div>
              <h3 style={{ fontWeight: "800", fontSize: "20px", marginBottom: "8px" }}>You have used your 3 free listings</h3>
              <p style={{ color: "#555", fontSize: "14px", marginBottom: "24px" }}>Upgrade to keep generating unlimited listings for just $9/mo.</p>
              <button onClick={() => startCheckout("monthly")} disabled={checkoutLoading} style={{ display: "block", width: "100%", background: "#22d3ee", color: "black", fontWeight: "bold", padding: "14px", borderRadius: "8px", border: "none", cursor: checkoutLoading ? "not-allowed" : "pointer", fontSize: "15px" }}>
                {checkoutLoading ? "Starting checkout…" : "Upgrade — $9/mo"}
              </button>
            </div>
          ) : (
            <div>
              <div style={{ marginBottom: "20px" }}>
                {photo ? (
                  <div style={{ position: "relative", display: "inline-block" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={photo.data} alt="Item to list" style={{ maxHeight: "220px", maxWidth: "100%", borderRadius: "12px", border: "2px solid #22d3ee", display: "block" }} />
                    <button
                      onClick={() => setPhoto(null)}
                      style={{ position: "absolute", top: "8px", right: "8px", background: "rgba(0,0,0,0.7)", border: "1px solid #333", color: "#ddd", borderRadius: "999px", width: "28px", height: "28px", cursor: "pointer", fontSize: "14px", lineHeight: "1" }}
                      aria-label="Remove photo">
                      ✕
                    </button>
                  </div>
                ) : (
                  <label style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px", padding: "40px 20px", background: "#0d1f24", border: "2px dashed #22d3ee", borderRadius: "14px", cursor: "pointer", textAlign: "center" }}>
                    <div style={{ fontSize: "44px", lineHeight: 1 }}>📸</div>
                    <div style={{ fontSize: "18px", fontWeight: "800", color: "white" }}>Snap or upload a photo</div>
                    <div style={{ fontSize: "13px", color: "#7fd9e8", maxWidth: "360px" }}>AI identifies your item and writes the full listing + price — no typing needed.</div>
                    <input type="file" accept="image/*" onChange={handlePhoto} style={{ display: "none" }} />
                  </label>
                )}
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "13px", color: "#555", marginBottom: "8px" }}>Which platform?</label>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {["eBay", "Etsy", "Facebook Marketplace", "Depop", "Poshmark"].map(p => (
                    <button key={p} onClick={() => setPlatform(p)} style={{ padding: "7px 14px", borderRadius: "999px", border: "1px solid", borderColor: platform === p ? "#22d3ee" : "#2a2a2a", background: platform === p ? "#0d1f24" : "transparent", color: platform === p ? "#22d3ee" : "#555", fontSize: "13px", cursor: "pointer", fontWeight: platform === p ? "700" : "400" }}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "18px 0 14px" }}>
                <div style={{ flex: 1, height: "1px", background: "#1f1f1f" }} />
                <span style={{ color: "#444", fontSize: "12px", fontWeight: 700, letterSpacing: "1px" }}>{photo ? "ADD DETAILS (OPTIONAL)" : "OR DESCRIBE IT INSTEAD"}</span>
                <div style={{ flex: 1, height: "1px", background: "#1f1f1f" }} />
              </div>

              <textarea
                value={item}
                onChange={e => setItem(e.target.value)}
                placeholder={photo ? "Add anything the photo can't show — flaws, measurements, brand…" : "e.g. Vintage Levi's denim jacket, size M, 90s wash, good condition, no rips"}
                rows={photo ? 2 : 3}
                style={{ width: "100%", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "8px", padding: "12px", color: "white", fontSize: "14px", boxSizing: "border-box", resize: "vertical", fontFamily: "inherit", marginBottom: "16px" }}
              />
              <button
                onClick={generate}
                disabled={loading || (!item && !photo)}
                style={{ width: "100%", background: loading ? "#1a1a1a" : "#22d3ee", color: loading ? "#444" : "black", fontWeight: "bold", padding: "13px", borderRadius: "8px", border: "none", cursor: loading ? "not-allowed" : "pointer", fontSize: "15px" }}>
                {loading
                  ? "Writing listing + pricing it..."
                  : !userEmail ? "Generate free — no credit card →"
                  : `Generate my ${platform} listing + price`}
              </button>
            </div>
          )}

          {result && (
            <div style={{ marginTop: "20px" }}>
              <div style={{ background: "#0a0a0a", border: "1px solid #22d3ee", borderRadius: "10px", padding: "20px", marginBottom: "16px" }}>
                <div style={{ fontSize: "11px", fontWeight: "700", color: "#22d3ee", marginBottom: "10px", letterSpacing: "1.5px" }}>
                  YOUR LISTING:
                </div>
                <div style={{ color: "#ccc", fontSize: "14px", lineHeight: "1.8" }} dangerouslySetInnerHTML={{ __html: formatText(result) }} />
              </div>
              {price && (
                <div style={{ background: "#0d1f24", border: "1px solid #22d3ee", borderRadius: "10px", padding: "20px", marginBottom: xpost ? "16px" : "0" }}>
                  <div style={{ fontSize: "11px", fontWeight: "700", color: "#22d3ee", marginBottom: "10px", letterSpacing: "1.5px" }}>💰 SUGGESTED PRICE:</div>
                  <div style={{ color: "#ddd", fontSize: "14px", lineHeight: "1.8" }} dangerouslySetInnerHTML={{ __html: formatText(price) }} />
                </div>
              )}
              {xpost && (
                <div style={{ background: "#0a0a0a", border: "1px solid #333", borderRadius: "10px", padding: "20px", marginTop: "16px" }}>
                  <div style={{ fontSize: "11px", fontWeight: "700", color: "#aaa", marginBottom: "10px", letterSpacing: "1.5px" }}>𝕏 POST DRAFT:</div>
                  <div style={{ color: "#ccc", fontSize: "14px", lineHeight: "1.8" }} dangerouslySetInnerHTML={{ __html: formatText(xpost) }} />
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <section style={{ maxWidth: "680px", margin: "0 auto", padding: "0 24px 80px", textAlign: "center" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "700", marginBottom: "40px" }}>How the AI listing generator works</h2>
        <div className="grid-3">
          {[
            { n: "01", t: "Pick your platform", b: "eBay, Etsy, Depop, Facebook Marketplace — choose where you're selling." },
            { n: "02", t: "Describe your item", b: "Brand, size, condition. One sentence is enough. AI handles the rest." },
            { n: "03", t: "Paste and list", b: "Copy the listing straight in. Done in under a minute." },
          ].map(s => (
            <div key={s.n} style={{ background: "#111", borderRadius: "12px", padding: "24px", border: "1px solid #1f1f1f" }}>
              <div style={{ fontSize: "28px", fontWeight: "800", color: "#22d3ee", marginBottom: "10px" }}>{s.n}</div>
              <h3 style={{ fontWeight: "700", marginBottom: "8px", fontSize: "15px" }}>{s.t}</h3>
              <p style={{ color: "#555", fontSize: "13px", lineHeight: "1.6", margin: 0 }}>{s.b}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: "560px", margin: "0 auto", padding: "0 24px 80px" }}>
        <div style={{ background: "#111", border: "1px solid #1f1f1f", borderRadius: "16px", padding: "28px" }}>
          <div style={{ fontSize: "11px", color: "#444", marginBottom: "14px", fontWeight: "700", letterSpacing: "1.5px" }}>WHY I BUILT THIS</div>
          <p style={{ color: "#aaa", fontSize: "15px", lineHeight: "1.8", marginBottom: "16px" }}>
            I flip thrift finds on eBay every week under <a href="https://x.com/ThriftAndStack" target="_blank" style={{ color: "#22d3ee", textDecoration: "none" }}>@ThriftAndStack</a>. Writing listings always slowed me down. Bad titles meant less visibility. Weak descriptions meant fewer sales.
          </p>
          <p style={{ color: "#aaa", fontSize: "15px", lineHeight: "1.8", marginBottom: "16px" }}>
            So I built CopyAI Pro to handle it. Thirty seconds. I use it on every single item I list. It's the AI Etsy listing tool and eBay listing writer I always wished I had.
          </p>
          <p style={{ color: "#555", fontSize: "13px" }}>— Stevie Ray, reseller & builder</p>
        </div>
      </section>

      <section id="pricing" style={{ maxWidth: "440px", margin: "0 auto", padding: "0 24px 100px", textAlign: "center" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "700", marginBottom: "8px" }}>Simple pricing.</h2>
        <p style={{ color: "#555", fontSize: "15px", marginBottom: "24px" }}>Cancel anytime. No contracts. No tiers.</p>

        <div style={{ display: "inline-flex", background: "#111", border: "1px solid #1f1f1f", borderRadius: "999px", padding: "4px", marginBottom: "28px" }}>
          {([
            { key: "monthly", label: "Monthly" },
            { key: "annual", label: "Annual" },
            { key: "lifetime", label: "Lifetime" },
          ] as const).map(opt => (
            <button
              key={opt.key}
              onClick={() => setBilling(opt.key)}
              style={{ padding: "8px 18px", borderRadius: "999px", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: billing === opt.key ? "700" : "400", background: billing === opt.key ? "#22d3ee" : "transparent", color: billing === opt.key ? "black" : "#888" }}>
              {opt.label}
            </button>
          ))}
        </div>

        <div style={{ position: "relative", background: "#111", border: "1px solid #22d3ee", borderRadius: "16px", padding: "32px" }}>
          {billing === "annual" && (
            <div style={{ position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)", background: "#22d3ee", color: "black", fontSize: "11px", fontWeight: "800", letterSpacing: "0.5px", padding: "5px 14px", borderRadius: "999px", whiteSpace: "nowrap" }}>
              BEST VALUE — SAVE $39
            </div>
          )}
          {billing === "lifetime" && (
            <div style={{ position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)", background: "#22d3ee", color: "black", fontSize: "11px", fontWeight: "800", letterSpacing: "0.5px", padding: "5px 14px", borderRadius: "999px", whiteSpace: "nowrap" }}>
              PAY ONCE — NO SUBSCRIPTION
            </div>
          )}
          <div style={{ fontSize: "44px", fontWeight: "800", marginBottom: "4px" }}>
            {billing === "lifetime" ? "$350" : billing === "annual" ? "$69" : "$9"}
            <span style={{ fontSize: "16px", fontWeight: "400", color: "#555" }}>
              {billing === "lifetime" ? " once" : billing === "annual" ? "/yr" : "/mo"}
            </span>
          </div>
          <p style={{ color: "#555", fontSize: "13px", marginBottom: "24px" }}>
            {billing === "lifetime"
              ? "Pay once. Yours forever — no recurring bill."
              : billing === "annual" ? "That's $5.75/mo — billed yearly." : "Everything included."}
          </p>
          <ul style={{ listStyle: "none", padding: 0, marginBottom: "24px", textAlign: "left" }}>
            {["Unlimited listing generations", "Works for eBay, Etsy, Depop & more", "AI price estimator", "Keyword-optimized titles", "Full item descriptions", "Email support"].map(f => (
              <li key={f} style={{ padding: "8px 0", borderBottom: "1px solid #1a1a1a", fontSize: "14px", color: "#aaa" }}>✓ {f}</li>
            ))}
          </ul>
          <button
            onClick={() => startCheckout(billing)}
            disabled={checkoutLoading}
            style={{ display: "block", width: "100%", background: "#22d3ee", color: "black", fontWeight: "bold", padding: "14px", borderRadius: "8px", border: "none", cursor: checkoutLoading ? "not-allowed" : "pointer", fontSize: "15px", marginBottom: "10px" }}>
            {checkoutLoading
              ? "Starting checkout…"
              : billing === "lifetime" ? "Get lifetime access — $350"
              : billing === "annual" ? "Get started — $69/yr" : "Get started — $9/mo"}
          </button>
          <p style={{ color: "#444", fontSize: "12px" }}>3 free listings included. No credit card to start.</p>
        </div>
      </section>

      <section style={{ textAlign: "center", padding: "0 24px 80px" }}>
        <h2 style={{ fontSize: "26px", fontWeight: "700", marginBottom: "12px" }}>Stop writing listings by hand.</h2>
        <p style={{ color: "#555", marginBottom: "24px", fontSize: "15px" }}>Describe your item. Get a listing. Paste and sell.</p>
        <a href="#tools" style={{ display: "inline-block", background: "#22d3ee", color: "black", fontWeight: "bold", padding: "14px 36px", borderRadius: "8px", textDecoration: "none", fontSize: "15px" }}>
          Write my first listing — free
        </a>
      </section>

      <footer style={{ textAlign: "center", padding: "28px 24px", borderTop: "1px solid #1a1a1a" }}>
        <p style={{ color: "#333", fontSize: "13px", marginBottom: "6px" }}>© 2026 CopyAI Pro — All rights reserved.</p>
        <p style={{ color: "#2a2a2a", fontSize: "13px" }}>Built by a reseller who got tired of writing listings. Questions? DM us on X → <a href="https://x.com/ThriftAndStack" target="_blank" style={{ color: "#333", textDecoration: "none" }}>@ThriftAndStack</a></p>
      </footer>

    </main>
  );
}
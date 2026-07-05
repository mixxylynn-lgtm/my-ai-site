"use client";
import { useState } from "react";

export default function Home() {
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const startCheckout = async () => {
    setCheckoutLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
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

  const buyButton = (label: string) => (
    <button
      onClick={startCheckout}
      disabled={checkoutLoading}
      style={{
        background: "#22d3ee",
        color: "black",
        fontWeight: 800,
        padding: "16px 40px",
        borderRadius: "10px",
        border: "none",
        cursor: checkoutLoading ? "not-allowed" : "pointer",
        fontSize: "17px",
      }}
    >
      {checkoutLoading ? "Starting checkout…" : label}
    </button>
  );

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(1100px 600px at 50% -120px, rgba(34,211,238,0.16), rgba(34,211,238,0.05) 35%, transparent 70%), #0a0a0a",
        backgroundRepeat: "no-repeat",
        color: "white",
        fontFamily: "system-ui,sans-serif",
      }}
    >
      <header
        className="site-header"
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #1f1f1f" }}
      >
        <div style={{ fontSize: "18px", fontWeight: "bold" }}>CopyAI Pro</div>
        <a href="#get-access" style={{ color: "#22d3ee", fontSize: "14px", fontWeight: 700, textDecoration: "none" }}>
          Get bot access
        </a>
      </header>

      {/* Hero */}
      <section className="hero-section" style={{ maxWidth: "720px", margin: "0 auto", textAlign: "center" }}>
        <div
          style={{
            display: "inline-block",
            background: "#1a1a1a",
            color: "#aaa",
            fontSize: "13px",
            padding: "6px 16px",
            borderRadius: "999px",
            marginBottom: "28px",
            border: "1px solid #2a2a2a",
          }}
        >
          📸 Photo in → full listing out, on Telegram
        </div>
        <h1 className="hero-h1" style={{ fontWeight: 800, lineHeight: 1.15, marginBottom: "20px", letterSpacing: "-1px" }}>
          Get a full marketplace listing<br />
          <span style={{ color: "#22d3ee" }}>from any photo in seconds</span>
        </h1>
        <p style={{ color: "#999", fontSize: "18px", lineHeight: 1.7, maxWidth: "560px", margin: "0 auto 36px" }}>
          Works for eBay, Etsy, Depop, Poshmark, Facebook Marketplace and more. Just send a photo to our Telegram bot and
          get a complete listing back instantly.
        </p>
        {buyButton("Get bot access — $4.99")}
        <p style={{ color: "#555", fontSize: "13px", marginTop: "14px" }}>One-time payment. No subscription.</p>
      </section>

      {/* Three steps */}
      <section style={{ maxWidth: "760px", margin: "0 auto", padding: "24px 24px 80px" }}>
        <div className="grid-3">
          {[
            { n: "1", t: "Pay", b: "One-time $4.99. Takes about 20 seconds through secure Stripe checkout." },
            { n: "2", t: "Message the bot", b: "Tap the activation link, then send a photo of your item to @copyaipro_bot." },
            { n: "3", t: "Get your listing", b: "A full title, description and suggested price come straight back to your chat." },
          ].map((s) => (
            <div key={s.n} style={{ background: "#111", borderRadius: "12px", padding: "26px", border: "1px solid #1f1f1f" }}>
              <div
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "999px",
                  background: "#0d1f24",
                  border: "1px solid #22d3ee",
                  color: "#22d3ee",
                  fontWeight: 800,
                  fontSize: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "14px",
                }}
              >
                {s.n}
              </div>
              <h3 style={{ fontWeight: 700, marginBottom: "8px", fontSize: "16px" }}>{s.t}</h3>
              <p style={{ color: "#666", fontSize: "13px", lineHeight: 1.6, margin: 0 }}>{s.b}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Example conversations */}
      <section style={{ maxWidth: "820px", margin: "0 auto", padding: "0 24px 80px" }}>
        <h2 style={{ textAlign: "center", fontSize: "24px", fontWeight: 700, marginBottom: "8px" }}>
          Real listings, straight from a photo
        </h2>
        <p style={{ textAlign: "center", color: "#666", fontSize: "14px", marginBottom: "36px" }}>
          Here&apos;s what the bot sends back the moment you drop in a photo.
        </p>
        <div className="grid-2">
          <BotExample
            item="🧥"
            caption="You: 📷 photo of a denim jacket"
            title="Vintage 90s Levi's Denim Jacket | Size M | Distressed Wash | Rare"
            body="Authentic 90s Levi's with classic distressed wash — perfect for collectors and streetwear lovers. Ships same day."
            price="💰 Suggested price: $58–72"
          />
          <BotExample
            item="👟"
            caption="You: 📷 photo of sneakers"
            title="Nike Air Max 90 | Men's 10 | White/Grey | Great Condition"
            body="Clean, lightly-worn Air Max 90s with plenty of life left. Iconic silhouette that always sells. Fast shipping."
            price="💰 Suggested price: $65–85"
          />
        </div>
        <p style={{ textAlign: "center", color: "#333", fontSize: "12px", marginTop: "16px" }}>
          {/* Swap these mock cards for real bot screenshots: drop PNGs in /public and replace <BotExample>. */}
          Illustrative examples of the bot&apos;s output.
        </p>
      </section>

      {/* Get access CTA */}
      <section id="get-access" style={{ maxWidth: "480px", margin: "0 auto", padding: "0 24px 100px", textAlign: "center" }}>
        <div style={{ background: "#111", border: "1px solid #22d3ee", borderRadius: "18px", padding: "40px 32px" }}>
          <div style={{ fontSize: "48px", fontWeight: 800, marginBottom: "4px" }}>
            $4.99<span style={{ fontSize: "16px", fontWeight: 400, color: "#555" }}> once</span>
          </div>
          <p style={{ color: "#666", fontSize: "14px", marginBottom: "24px" }}>Pay once. No subscription, no contracts.</p>
          <ul style={{ listStyle: "none", padding: 0, marginBottom: "28px", textAlign: "left" }}>
            {[
              "Unlimited listings from photos",
              "eBay, Etsy, Depop, Poshmark, Facebook & more",
              "Titles, descriptions & suggested pricing",
              "Right inside Telegram — nothing to install",
            ].map((f) => (
              <li key={f} style={{ padding: "9px 0", borderBottom: "1px solid #1a1a1a", fontSize: "14px", color: "#aaa" }}>
                ✓ {f}
              </li>
            ))}
          </ul>
          {buyButton("Get bot access — $4.99")}
          <p style={{ color: "#444", fontSize: "12px", marginTop: "14px" }}>
            Secure checkout by Stripe. Activation link sent right after payment.
          </p>
        </div>
      </section>

      <footer style={{ textAlign: "center", padding: "28px 24px", borderTop: "1px solid #1a1a1a" }}>
        <p style={{ color: "#333", fontSize: "13px", marginBottom: "6px" }}>© 2026 CopyAI Pro — All rights reserved.</p>
        <p style={{ color: "#2a2a2a", fontSize: "13px" }}>
          Built by a reseller who got tired of writing listings. Questions? DM us on X →{" "}
          <a href="https://x.com/ThriftAndStack" target="_blank" style={{ color: "#333", textDecoration: "none" }}>
            @ThriftAndStack
          </a>
        </p>
      </footer>
    </main>
  );
}

function BotExample({
  item,
  caption,
  title,
  body,
  price,
}: {
  item: string;
  caption: string;
  title: string;
  body: string;
  price: string;
}) {
  return (
    <div style={{ background: "#0e1a1d", border: "1px solid #1f2f33", borderRadius: "16px", padding: "18px" }}>
      {/* Incoming photo bubble */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "12px" }}>
        <div
          style={{
            background: "#0d1f24",
            border: "1px solid #22d3ee",
            borderRadius: "14px 14px 4px 14px",
            padding: "12px 14px",
            maxWidth: "80%",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "40px", lineHeight: 1 }}>{item}</div>
          <div style={{ color: "#7fd9e8", fontSize: "11px", marginTop: "6px" }}>{caption}</div>
        </div>
      </div>
      {/* Bot reply bubble */}
      <div style={{ display: "flex", justifyContent: "flex-start" }}>
        <div
          style={{
            background: "#111",
            border: "1px solid #1f1f1f",
            borderRadius: "14px 14px 14px 4px",
            padding: "14px 16px",
            maxWidth: "92%",
          }}
        >
          <div style={{ fontSize: "10px", fontWeight: 700, color: "#22d3ee", letterSpacing: "1px", marginBottom: "8px" }}>
            📝 COPYAI PRO BOT
          </div>
          <strong style={{ color: "white", fontSize: "13px", lineHeight: 1.5, display: "block", marginBottom: "8px" }}>
            {title}
          </strong>
          <p style={{ color: "#aaa", fontSize: "12px", lineHeight: 1.6, margin: "0 0 10px" }}>{body}</p>
          <div style={{ color: "#22d3ee", fontSize: "12px", fontWeight: 700 }}>{price}</div>
        </div>
      </div>
    </div>
  );
}

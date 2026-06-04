"use client";
import { useState } from "react";

export default function Home() {
  const [tab, setTab] = useState<"listing"|"price">("listing");
  const [item, setItem] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    setResult("");
    const prompt = tab === "listing"
      ? `You are an expert eBay seller. Write a high-converting eBay listing for this item: "${item}". Include: 1) An optimized title (80 chars max, keyword-rich), 2) A compelling description (3-4 paragraphs), 3) Suggested keywords/tags. Format it clearly with labels.`
      : `You are an expert eBay reseller with deep knowledge of sold listings and market prices. For this item: "${item}" — provide: 1) A suggested selling price range on eBay, 2) What condition affects the price, 3) Tips to get the highest price, 4) Whether it's worth selling or not. Be specific and practical. Base this on typical eBay sold prices.`;

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topic: prompt,
        audience: "eBay sellers",
        tone: "direct and helpful",
      }),
    });
    const data = await res.json();
    setResult(data.result || data.error);
    setLoading(false);
  };

  return (
    <main style={{minHeight:"100vh",background:"#0a0a0a",color:"white",fontFamily:"system-ui,sans-serif"}}>

      {/* Header */}
      <header style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"20px 40px",borderBottom:"1px solid #1f1f1f"}}>
        <div style={{fontSize:"18px",fontWeight:"bold",color:"white"}}>CopyAI Pro</div>
        <a href="https://buy.stripe.com/aFaaEWeJE66EgLW9ti2cg00" target="_blank" style={{background:"white",color:"black",fontWeight:"bold",padding:"10px 22px",borderRadius:"8px",textDecoration:"none",fontSize:"14px"}}>
          Start free
        </a>
      </header>

      {/* Hero */}
      <section style={{maxWidth:"720px",margin:"0 auto",padding:"80px 24px 60px",textAlign:"center"}}>
        <div style={{display:"inline-block",background:"#1a1a1a",color:"#aaa",fontSize:"13px",padding:"6px 16px",borderRadius:"999px",marginBottom:"28px",border:"1px solid #2a2a2a"}}>
          Built by a flipper, for flippers
        </div>
        <h1 style={{fontSize:"48px",fontWeight:"800",lineHeight:"1.15",marginBottom:"20px",letterSpacing:"-1px"}}>
          Your eBay listings are<br/>
          <span style={{color:"#22d3ee"}}>losing you sales</span>
        </h1>
        <p style={{color:"#888",fontSize:"18px",lineHeight:"1.7",marginBottom:"16px",maxWidth:"560px",margin:"0 auto 16px"}}>
          I flip thrift finds on eBay every week. Bad titles and weak descriptions cost me sales — so I built CopyAI Pro to fix that. Describe your item and get an optimized listing in 30 seconds.
        </p>
        <p style={{color:"#666",fontSize:"14px",marginBottom:"36px"}}>— Stevie Ray, <a href="https://x.com/ThriftAndStack" target="_blank" style={{color:"#888",textDecoration:"none"}}>@ThriftAndStack</a></p>
        <div style={{display:"flex",gap:"12px",justifyContent:"center",flexWrap:"wrap"}}>
          <a href="#tools" style={{background:"#22d3ee",color:"black",fontWeight:"bold",padding:"14px 32px",borderRadius:"8px",textDecoration:"none",fontSize:"16px"}}>
            Try free — 3 listings on us
          </a>
          <a href="#how" style={{background:"transparent",color:"white",fontWeight:"bold",padding:"14px 32px",borderRadius:"8px",textDecoration:"none",fontSize:"16px",border:"1px solid #333"}}>
            See how it works
          </a>
        </div>
        <p style={{color:"#555",fontSize:"13px",marginTop:"16px"}}>No credit card required to start</p>
      </section>

      {/* Before/After */}
      <section style={{maxWidth:"800px",margin:"0 auto",padding:"20px 24px 80px"}}>
        <h2 style={{textAlign:"center",fontSize:"28px",fontWeight:"700",marginBottom:"40px",color:"#fff"}}>What it actually does</h2>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px"}}>
          <div style={{background:"#111",border:"1px solid #222",borderRadius:"12px",padding:"24px"}}>
            <div style={{fontSize:"12px",fontWeight:"700",color:"#666",marginBottom:"12px",letterSpacing:"1px"}}>BEFORE</div>
            <p style={{color:"#666",fontSize:"14px",lineHeight:"1.7",margin:0}}>
              Blue vintage jacket. Size M. Good condition. Pick up or shipping available.
            </p>
          </div>
          <div style={{background:"#111",border:"1px solid #22d3ee",borderRadius:"12px",padding:"24px"}}>
            <div style={{fontSize:"12px",fontWeight:"700",color:"#22d3ee",marginBottom:"12px",letterSpacing:"1px"}}>AFTER — COPYAI PRO</div>
            <p style={{color:"#ddd",fontSize:"14px",lineHeight:"1.7",margin:0}}>
              <strong>Vintage 90s Levi's Denim Jacket | Size M | Distressed Wash | Rare Find — Ships Fast</strong><br/><br/>
              Head-turning vintage style meets everyday wearability. Authentic 90s Levi's with classic distressed wash — perfect for collectors and streetwear lovers. Ships same day.
            </p>
          </div>
        </div>
      </section>

      {/* Tools */}
      <section id="tools" style={{maxWidth:"640px",margin:"0 auto",padding:"0 24px 80px"}}>
        <div style={{display:"flex",gap:"8px",marginBottom:"24px",background:"#111",padding:"6px",borderRadius:"10px",border:"1px solid #222"}}>
          <button
            onClick={()=>{setTab("listing");setResult("");}}
            style={{flex:1,padding:"12px",borderRadius:"8px",border:"none",cursor:"pointer",fontWeight:"700",fontSize:"15px",background:tab==="listing"?"#22d3ee":"transparent",color:tab==="listing"?"black":"#666",transition:"all 0.2s"}}>
            ✍️ Write My Listing
          </button>
          <button
            onClick={()=>{setTab("price");setResult("");}}
            style={{flex:1,padding:"12px",borderRadius:"8px",border:"none",cursor:"pointer",fontWeight:"700",fontSize:"15px",background:tab==="price"?"#22d3ee":"transparent",color:tab==="price"?"black":"#666",transition:"all 0.2s"}}>
            💰 Price My Item
          </button>
        </div>

        <div style={{background:"#111",border:"1px solid #222",borderRadius:"16px",padding:"32px"}}>
          {tab === "listing" ? (
            <>
              <h2 style={{fontSize:"20px",fontWeight:"700",marginBottom:"8px"}}>Write my eBay listing</h2>
              <p style={{color:"#666",fontSize:"14px",marginBottom:"24px"}}>Describe your item and get a full optimized listing in seconds.</p>
            </>
          ) : (
            <>
              <h2 style={{fontSize:"20px",fontWeight:"700",marginBottom:"8px"}}>What's my item worth?</h2>
              <p style={{color:"#666",fontSize:"14px",marginBottom:"24px"}}>Describe your item and get a suggested eBay price range plus tips to maximize your sale.</p>
            </>
          )}

          <div style={{marginBottom:"16px"}}>
            <label style={{display:"block",fontSize:"13px",color:"#666",marginBottom:"8px"}}>
              {tab === "listing" ? "Describe your item" : "What are you selling?"}
            </label>
            <textarea
              value={item}
              onChange={e=>setItem(e.target.value)}
              placeholder={tab === "listing"
                ? "e.g. Vintage Levi's denim jacket, size M, 90s, distressed wash, good condition"
                : "e.g. Nike Air Max 90, size 10, 2019, worn a few times, no box"}
              rows={3}
              style={{width:"100%",background:"#1a1a1a",border:"1px solid #2a2a2a",borderRadius:"8px",padding:"12px",color:"white",fontSize:"14px",boxSizing:"border-box",resize:"vertical",fontFamily:"inherit"}}
            />
          </div>

          <button
            onClick={generate}
            disabled={loading||!item}
            style={{width:"100%",background:loading?"#333":"#22d3ee",color:loading?"#666":"black",fontWeight:"bold",padding:"14px",borderRadius:"8px",border:"none",cursor:loading?"not-allowed":"pointer",fontSize:"16px"}}>
            {loading
              ? tab === "listing" ? "Writing your listing..." : "Estimating price..."
              : tab === "listing" ? "Generate my listing" : "What's it worth?"}
          </button>

          {result && (
            <div style={{marginTop:"24px",background:"#0f0f0f",border:"1px solid #22d3ee",borderRadius:"12px",padding:"24px"}}>
              <div style={{fontSize:"12px",fontWeight:"700",color:"#22d3ee",marginBottom:"12px",letterSpacing:"1px"}}>
                {tab === "listing" ? "YOUR LISTING:" : "PRICE ESTIMATE:"}
              </div>
              <div style={{color:"#ddd",fontSize:"14px",lineHeight:"1.8",whiteSpace:"pre-wrap"}}>{result}</div>
            </div>
          )}
        </div>
      </section>

      {/* How it works */}
      <section id="how" style={{maxWidth:"720px",margin:"0 auto",padding:"0 24px 80px"}}>
        <h2 style={{textAlign:"center",fontSize:"28px",fontWeight:"700",marginBottom:"48px"}}>From blank page to live listing in 3 steps</h2>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"24px"}}>
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:"32px",fontWeight:"800",color:"#22d3ee",marginBottom:"12px"}}>01</div>
            <h3 style={{fontWeight:"700",marginBottom:"8px",fontSize:"16px"}}>Describe your item</h3>
            <p style={{color:"#666",fontSize:"14px",lineHeight:"1.6"}}>Type a few details — brand, size, condition, era. The more you give, the better it writes.</p>
          </div>
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:"32px",fontWeight:"800",color:"#22d3ee",marginBottom:"12px"}}>02</div>
            <h3 style={{fontWeight:"700",marginBottom:"8px",fontSize:"16px"}}>AI writes the listing</h3>
            <p style={{color:"#666",fontSize:"14px",lineHeight:"1.6"}}>Optimized title, full description, and keywords — written to convert buyers, not just describe the item.</p>
          </div>
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:"32px",fontWeight:"800",color:"#22d3ee",marginBottom:"12px"}}>03</div>
            <h3 style={{fontWeight:"700",marginBottom:"8px",fontSize:"16px"}}>Paste and sell</h3>
            <p style={{color:"#666",fontSize:"14px",lineHeight:"1.6"}}>Copy it straight into eBay. Done. List more, sell more, spend less time writing.</p>
          </div>
        </div>
      </section>

      {/* Founder note */}
      <section style={{maxWidth:"600px",margin:"0 auto",padding:"0 24px 80px"}}>
        <div style={{background:"#111",border:"1px solid #222",borderRadius:"16px",padding:"32px"}}>
          <div style={{fontSize:"13px",color:"#666",marginBottom:"16px",fontWeight:"700",letterSpacing:"1px"}}>WHY I BUILT THIS</div>
          <p style={{color:"#ccc",fontSize:"16px",lineHeight:"1.8",marginBottom:"20px"}}>
            I flip thrift finds on eBay every week under <a href="https://x.com/ThriftAndStack" target="_blank" style={{color:"#22d3ee",textDecoration:"none"}}>@ThriftAndStack</a>. Writing listings always slowed me down — bad titles meant less visibility, weak descriptions meant fewer sales.
          </p>
          <p style={{color:"#ccc",fontSize:"16px",lineHeight:"1.8",marginBottom:"20px"}}>
            So I built CopyAI Pro to do it for me. It takes 30 seconds. I use it on every single listing now.
          </p>
          <p style={{color:"#888",fontSize:"14px"}}>— Stevie Ray, Texas flipper & builder</p>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{maxWidth:"480px",margin:"0 auto",padding:"0 24px 100px",textAlign:"center"}}>
        <h2 style={{fontSize:"28px",fontWeight:"700",marginBottom:"12px"}}>Simple pricing</h2>
        <p style={{color:"#666",fontSize:"16px",marginBottom:"40px"}}>One plan. Everything included. Cancel anytime.</p>
        <div style={{background:"#111",border:"1px solid #22d3ee",borderRadius:"16px",padding:"36px"}}>
          <div style={{fontSize:"48px",fontWeight:"800",marginBottom:"4px"}}>$9<span style={{fontSize:"18px",fontWeight:"400",color:"#666"}}>/mo</span></div>
          <p style={{color:"#666",fontSize:"14px",marginBottom:"28px"}}>Cancel anytime. No contracts.</p>
          <ul style={{listStyle:"none",padding:0,marginBottom:"28px",textAlign:"left"}}>
            {["Unlimited AI listing generations","eBay, Etsy & Amazon ready","Title, description & keywords","Price estimator tool","Custom X post for every listing","Email support"].map(f=>(
              <li key={f} style={{padding:"8px 0",borderBottom:"1px solid #1a1a1a",fontSize:"15px",color:"#ccc"}}>✓ {f}</li>
            ))}
          </ul>
          <a href="https://buy.stripe.com/aFaaEWeJE66EgLW9ti2cg00" target="_blank" style={{display:"block",background:"#22d3ee",color:"black",fontWeight:"bold",padding:"16px",borderRadius:"8px",textDecoration:"none",fontSize:"16px",marginBottom:"12px"}}>
            Get started — $9/mo
          </a>
          <p style={{color:"#555",fontSize:"13px"}}>3 free listings included. No credit card to start.</p>
        </div>
      </section>

      {/* Footer CTA */}
      <section style={{textAlign:"center",padding:"0 24px 80px"}}>
        <h2 style={{fontSize:"28px",fontWeight:"700",marginBottom:"16px"}}>Your next listing writes itself</h2>
        <p style={{color:"#666",marginBottom:"28px"}}>Describe your item. Get a listing. Start selling.</p>
        <a href="#tools" style={{display:"inline-block",background:"#22d3ee",color:"black",fontWeight:"bold",padding:"16px 40px",borderRadius:"8px",textDecoration:"none",fontSize:"16px"}}>
          Start free today
        </a>
      </section>

      {/* Footer */}
      <footer style={{textAlign:"center",padding:"24px",borderTop:"1px solid #1a1a1a",color:"#444",fontSize:"13px"}}>
        © 2026 CopyAI Pro — All rights reserved.
      </footer>

    </main>
  );
}
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
        <a href="#tools" style={{background:"#22d3ee",color:"black",fontWeight:"bold",padding:"10px 22px",borderRadius:"8px",textDecoration:"none",fontSize:"14px"}}>
          Try it free
        </a>
      </header>

      {/* Hero */}
      <section style={{maxWidth:"680px",margin:"0 auto",padding:"80px 24px 48px",textAlign:"center"}}>
        <div style={{display:"inline-block",background:"#1a1a1a",color:"#aaa",fontSize:"13px",padding:"6px 16px",borderRadius:"999px",marginBottom:"28px",border:"1px solid #2a2a2a"}}>
          Built by an eBay flipper, for eBay flippers
        </div>
        <h1 style={{fontSize:"46px",fontWeight:"800",lineHeight:"1.15",marginBottom:"20px",letterSpacing:"-1px"}}>
          Better eBay listings.<br/>
          <span style={{color:"#22d3ee"}}>Written in 30 seconds.</span>
        </h1>
        <p style={{color:"#888",fontSize:"17px",lineHeight:"1.75",marginBottom:"16px",maxWidth:"520px",margin:"0 auto 16px"}}>
          I flip thrift finds on eBay every week. Weak titles and generic descriptions were costing me sales. So I built a tool that writes optimized listings instantly — I use it on every item I sell.
        </p>
        <p style={{color:"#555",fontSize:"14px",marginBottom:"32px"}}>— Stevie Ray, <a href="https://x.com/ThriftAndStack" target="_blank" style={{color:"#666",textDecoration:"none"}}>@ThriftAndStack</a></p>
        <a href="#tools" style={{display:"inline-block",background:"#22d3ee",color:"black",fontWeight:"bold",padding:"14px 36px",borderRadius:"8px",textDecoration:"none",fontSize:"16px"}}>
          Write my first listing free
        </a>
        <p style={{color:"#444",fontSize:"13px",marginTop:"12px"}}>3 free listings. No credit card needed.</p>
      </section>

      {/* Before/After */}
      <section style={{maxWidth:"780px",margin:"0 auto",padding:"0 24px 72px"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px"}}>
          <div style={{background:"#111",border:"1px solid #1f1f1f",borderRadius:"12px",padding:"24px"}}>
            <div style={{fontSize:"11px",fontWeight:"700",color:"#444",marginBottom:"12px",letterSpacing:"1.5px"}}>WITHOUT COPYAI PRO</div>
            <p style={{color:"#555",fontSize:"14px",lineHeight:"1.7",margin:0}}>
              Blue vintage jacket. Size M. Good condition. Pick up or shipping available.
            </p>
          </div>
          <div style={{background:"#0d1f24",border:"1px solid #22d3ee",borderRadius:"12px",padding:"24px"}}>
            <div style={{fontSize:"11px",fontWeight:"700",color:"#22d3ee",marginBottom:"12px",letterSpacing:"1.5px"}}>WITH COPYAI PRO</div>
            <p style={{color:"#ddd",fontSize:"14px",lineHeight:"1.7",margin:0}}>
              <strong style={{color:"white"}}>Vintage 90s Levi's Denim Jacket | Size M | Distressed Wash | Rare Find — Ships Fast</strong>
              <br/><br/>
              Head-turning vintage style meets everyday wearability. Authentic 90s Levi's with classic distressed wash — perfect for collectors and streetwear lovers. Ships same day.
            </p>
          </div>
        </div>
      </section>

      {/* Tools */}
      <section id="tools" style={{maxWidth:"620px",margin:"0 auto",padding:"0 24px 80px"}}>
        <h2 style={{textAlign:"center",fontSize:"22px",fontWeight:"700",marginBottom:"20px"}}>Try it now — free</h2>
        <div style={{display:"flex",gap:"8px",marginBottom:"20px",background:"#111",padding:"5px",borderRadius:"10px",border:"1px solid #1f1f1f"}}>
          <button
            onClick={()=>{setTab("listing");setResult("");}}
            style={{flex:1,padding:"11px",borderRadius:"7px",border:"none",cursor:"pointer",fontWeight:"700",fontSize:"14px",background:tab==="listing"?"#22d3ee":"transparent",color:tab==="listing"?"black":"#555"}}>
            ✍️ Write My Listing
          </button>
          <button
            onClick={()=>{setTab("price");setResult("");}}
            style={{flex:1,padding:"11px",borderRadius:"7px",border:"none",cursor:"pointer",fontWeight:"700",fontSize:"14px",background:tab==="price"?"#22d3ee":"transparent",color:tab==="price"?"black":"#555"}}>
            💰 Price My Item
          </button>
        </div>

        <div style={{background:"#111",border:"1px solid #1f1f1f",borderRadius:"16px",padding:"28px"}}>
          <label style={{display:"block",fontSize:"13px",color:"#555",marginBottom:"8px"}}>
            {tab === "listing" ? "Describe your item" : "What are you selling?"}
          </label>
          <textarea
            value={item}
            onChange={e=>setItem(e.target.value)}
            placeholder={tab === "listing"
              ? "e.g. Vintage Levi's denim jacket, size M, 90s wash, good condition, no rips"
              : "e.g. Nike Air Max 90, size 10, worn a few times, 2019, no box"}
            rows={3}
            style={{width:"100%",background:"#1a1a1a",border:"1px solid #2a2a2a",borderRadius:"8px",padding:"12px",color:"white",fontSize:"14px",boxSizing:"border-box",resize:"vertical",fontFamily:"inherit",marginBottom:"16px"}}
          />
          <button
            onClick={generate}
            disabled={loading||!item}
            style={{width:"100%",background:loading?"#1a1a1a":"#22d3ee",color:loading?"#444":"black",fontWeight:"bold",padding:"13px",borderRadius:"8px",border:"none",cursor:loading?"not-allowed":"pointer",fontSize:"15px"}}>
            {loading
              ? tab==="listing" ? "Writing your listing..." : "Estimating price..."
              : tab==="listing" ? "Generate my listing" : "What's it worth on eBay?"}
          </button>

          {result && (
            <div style={{marginTop:"20px",background:"#0a0a0a",border:"1px solid #22d3ee",borderRadius:"10px",padding:"20px"}}>
              <div style={{fontSize:"11px",fontWeight:"700",color:"#22d3ee",marginBottom:"10px",letterSpacing:"1.5px"}}>
                {tab==="listing" ? "YOUR LISTING:" : "PRICE ESTIMATE:"}
              </div>
              <div style={{color:"#ccc",fontSize:"14px",lineHeight:"1.8",whiteSpace:"pre-wrap"}}>{result}</div>
            </div>
          )}
        </div>
      </section>

      {/* How it works */}
      <section id="how" style={{maxWidth:"680px",margin:"0 auto",padding:"0 24px 80px",textAlign:"center"}}>
        <h2 style={{fontSize:"24px",fontWeight:"700",marginBottom:"40px"}}>How it works</h2>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"20px"}}>
          {[
            {n:"01",t:"Describe your item",b:"Brand, size, condition — a sentence or two is enough."},
            {n:"02",t:"AI writes it",b:"Keyword-rich title, full description, optimized to show up and sell."},
            {n:"03",t:"Paste into eBay",b:"Copy it straight in. Done in under a minute."},
          ].map(s=>(
            <div key={s.n} style={{background:"#111",borderRadius:"12px",padding:"24px",border:"1px solid #1f1f1f"}}>
              <div style={{fontSize:"28px",fontWeight:"800",color:"#22d3ee",marginBottom:"10px"}}>{s.n}</div>
              <h3 style={{fontWeight:"700",marginBottom:"8px",fontSize:"15px"}}>{s.t}</h3>
              <p style={{color:"#555",fontSize:"13px",lineHeight:"1.6",margin:0}}>{s.b}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Founder note */}
      <section style={{maxWidth:"560px",margin:"0 auto",padding:"0 24px 80px"}}>
        <div style={{background:"#111",border:"1px solid #1f1f1f",borderRadius:"16px",padding:"28px"}}>
          <div style={{fontSize:"11px",color:"#444",marginBottom:"14px",fontWeight:"700",letterSpacing:"1.5px"}}>WHY I BUILT THIS</div>
          <p style={{color:"#aaa",fontSize:"15px",lineHeight:"1.8",marginBottom:"16px"}}>
            I flip thrift finds on eBay every week under <a href="https://x.com/ThriftAndStack" target="_blank" style={{color:"#22d3ee",textDecoration:"none"}}>@ThriftAndStack</a>. Writing listings always slowed me down. Bad titles meant less visibility. Weak descriptions meant fewer sales.
          </p>
          <p style={{color:"#aaa",fontSize:"15px",lineHeight:"1.8",marginBottom:"16px"}}>
            So I built CopyAI Pro to handle it. Thirty seconds. I use it on every single item I list.
          </p>
          <p style={{color:"#555",fontSize:"13px"}}>— Stevie Ray, Texas flipper & builder</p>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{maxWidth:"440px",margin:"0 auto",padding:"0 24px 100px",textAlign:"center"}}>
        <h2 style={{fontSize:"24px",fontWeight:"700",marginBottom:"8px"}}>One plan. $9 a month.</h2>
        <p style={{color:"#555",fontSize:"15px",marginBottom:"32px"}}>Cancel anytime. No contracts. No tiers.</p>
        <div style={{background:"#111",border:"1px solid #22d3ee",borderRadius:"16px",padding:"32px"}}>
          <div style={{fontSize:"44px",fontWeight:"800",marginBottom:"4px"}}>$9<span style={{fontSize:"16px",fontWeight:"400",color:"#555"}}>/mo</span></div>
          <p style={{color:"#555",fontSize:"13px",marginBottom:"24px"}}>Everything included.</p>
          <ul style={{listStyle:"none",padding:0,marginBottom:"24px",textAlign:"left"}}>
            {[
              "Unlimited eBay listing generations",
              "AI price estimator",
              "Keyword-optimized titles",
              "Full item descriptions",
              "Email support",
            ].map(f=>(
              <li key={f} style={{padding:"8px 0",borderBottom:"1px solid #1a1a1a",fontSize:"14px",color:"#aaa"}}>✓ {f}</li>
            ))}
          </ul>
          <a href="https://buy.stripe.com/aFaaEWeJE66EgLW9ti2cg00" target="_blank" style={{display:"block",background:"#22d3ee",color:"black",fontWeight:"bold",padding:"14px",borderRadius:"8px",textDecoration:"none",fontSize:"15px",marginBottom:"10px"}}>
            Get started — $9/mo
          </a>
          <p style={{color:"#444",fontSize:"12px"}}>3 free listings included. No credit card to start.</p>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{textAlign:"center",padding:"0 24px 80px"}}>
        <h2 style={{fontSize:"26px",fontWeight:"700",marginBottom:"12px"}}>Stop writing listings by hand.</h2>
        <p style={{color:"#555",marginBottom:"24px",fontSize:"15px"}}>Describe your item. Get a listing. Paste and sell.</p>
        <a href="#tools" style={{display:"inline-block",background:"#22d3ee",color:"black",fontWeight:"bold",padding:"14px 36px",borderRadius:"8px",textDecoration:"none",fontSize:"15px"}}>
          Write my first listing free
        </a>
      </section>

      {/* Footer */}
      <footer style={{textAlign:"center",padding:"28px 24px",borderTop:"1px solid #1a1a1a"}}>
        <p style={{color:"#333",fontSize:"13px",marginBottom:"6px"}}>© 2026 CopyAI Pro — All rights reserved.</p>
        <p style={{color:"#2a2a2a",fontSize:"13px"}}>Built by a Texas flipper who got tired of writing listings. Questions? DM me — <a href="https://x.com/ThriftAndStack" target="_blank" style={{color:"#333",textDecoration:"none"}}>@ThriftAndStack</a></p>
      </footer>

    </main>
  );
}
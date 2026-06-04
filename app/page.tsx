"use client";
import { useState } from "react";

export default function Home() {
  const [item, setItem] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    setResult("");
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topic: item,
        audience: "eBay buyers searching for this item",
        tone: "persuasive",
      }),
    });
    const data = await res.json();
    setResult(data.result || data.error);
    setLoading(false);
  };

  return (
    <main style={{minHeight:"100vh",background:"#0a0a0a",color:"white",fontFamily:"system-ui,sans-serif"}}>

      {/* Nav */}
      <nav style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"20px 40px",borderBottom:"1px solid #1a1a1a"}}>
        <div style={{fontWeight:"800",fontSize:"18px",letterSpacing:"-0.5px"}}>
          <span style={{color:"#22d3ee"}}>Copy</span>AI Pro
        </div>
        <div style={{display:"flex",gap:"24px",alignItems:"center"}}>
          <a href="#how" style={{color:"#9ca3af",textDecoration:"none",fontSize:"14px"}}>How it works</a>
          <a href="#pricing" style={{color:"#9ca3af",textDecoration:"none",fontSize:"14px"}}>Pricing</a>
          <a href="https://buy.stripe.com/aFaaEWeJE66EgLW9ti2cg00" target="_blank" style={{background:"#22d3ee",color:"black",fontWeight:"700",padding:"8px 20px",borderRadius:"8px",textDecoration:"none",fontSize:"14px"}}>Try free</a>
        </div>
      </nav>

      {/* Hero */}
      <section style={{maxWidth:"800px",margin:"0 auto",padding:"80px 40px 60px",textAlign:"center"}}>
        <div style={{display:"inline-block",background:"#111",border:"1px solid #222",borderRadius:"999px",padding:"6px 16px",fontSize:"13px",color:"#22d3ee",fontWeight:"600",marginBottom:"24px"}}>
          Built by a flipper, for flippers
        </div>
        <h1 style={{fontSize:"clamp(36px,6vw,62px)",fontWeight:"900",lineHeight:"1.1",marginBottom:"20px",letterSpacing:"-2px"}}>
          Your eBay listings are<br/>
          <span style={{color:"#22d3ee"}}>losing you sales</span>
        </h1>
        <p style={{fontSize:"18px",color:"#9ca3af",lineHeight:"1.7",marginBottom:"16px",maxWidth:"600px",margin:"0 auto 16px"}}>
          I've been flipping thrift finds on eBay for years. Bad titles and weak descriptions were costing me sales — so I built this.
        </p>
        <p style={{fontSize:"18px",color:"#d1d5db",lineHeight:"1.7",marginBottom:"40px",maxWidth:"600px",margin:"0 auto 40px"}}>
          Describe your item. CopyAI Pro writes an optimized title, description, and keywords in 30 seconds.
        </p>
        <div style={{display:"flex",gap:"12px",justifyContent:"center",flexWrap:"wrap"}}>
          <a href="https://buy.stripe.com/aFaaEWeJE66EgLW9ti2cg00" target="_blank" style={{background:"#22d3ee",color:"black",fontWeight:"800",padding:"16px 32px",borderRadius:"10px",textDecoration:"none",fontSize:"16px"}}>
            Try free — 3 listings on us
          </a>
          <a href="#how" style={{background:"#111",color:"white",fontWeight:"600",padding:"16px 32px",borderRadius:"10px",textDecoration:"none",fontSize:"16px",border:"1px solid #222"}}>
            See how it works
          </a>
        </div>
        <p style={{color:"#4b5563",fontSize:"13px",marginTop:"16px"}}>No credit card required to start</p>
      </section>

      {/* Before / After */}
      <section style={{maxWidth:"900px",margin:"0 auto",padding:"20px 40px 80px"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px"}}>
          <div style={{background:"#111",border:"1px solid #1f2937",borderRadius:"12px",padding:"24px"}}>
            <div style={{fontSize:"12px",fontWeight:"700",color:"#ef4444",marginBottom:"12px",textTransform:"uppercase",letterSpacing:"1px"}}>Before</div>
            <p style={{color:"#6b7280",fontSize:"14px",lineHeight:"1.7",fontStyle:"italic"}}>
              "Blue vintage jacket. Size M. Good condition. Pick up or shipping available."
            </p>
          </div>
          <div style={{background:"#0c1f1a",border:"1px solid #22d3ee",borderRadius:"12px",padding:"24px"}}>
            <div style={{fontSize:"12px",fontWeight:"700",color:"#22d3ee",marginBottom:"12px",textTransform:"uppercase",letterSpacing:"1px"}}>After — CopyAI Pro</div>
            <p style={{color:"#d1d5db",fontSize:"14px",lineHeight:"1.7",fontStyle:"italic"}}>
              "Vintage 90s Levi's Denim Jacket | Size M | Distressed Wash | Rare Find — Ships Fast. Head-turning vintage style meets everyday wearability..."
            </p>
          </div>
        </div>
      </section>

      {/* Founder Story */}
      <section style={{background:"#0f0f0f",borderTop:"1px solid #1a1a1a",borderBottom:"1px solid #1a1a1a",padding:"60px 40px"}}>
        <div style={{maxWidth:"680px",margin:"0 auto"}}>
          <div style={{fontSize:"13px",fontWeight:"700",color:"#22d3ee",marginBottom:"20px",textTransform:"uppercase",letterSpacing:"1px"}}>Why I built this</div>
          <p style={{fontSize:"18px",color:"#d1d5db",lineHeight:"1.8",marginBottom:"20px"}}>
            I flip thrift finds on eBay every week out of Conroe, TX. Writing listings always slowed me down — bad titles meant less visibility, weak descriptions meant fewer sales.
          </p>
          <p style={{fontSize:"18px",color:"#d1d5db",lineHeight:"1.8",marginBottom:"24px"}}>
            So I built CopyAI Pro to do it for me. It takes 30 seconds. I use it on every single listing.
          </p>
          <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
            <div style={{width:"44px",height:"44px",borderRadius:"999px",background:"#1a1a1a",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"18px"}}>🤠</div>
            <div>
              <div style={{fontWeight:"700",fontSize:"15px"}}>Stevie Ray</div>
              <a href="https://x.com/ThriftAndStack" target="_blank" style={{color:"#22d3ee",fontSize:"13px",textDecoration:"none"}}>@ThriftAndStack on X</a>
            </div>
          </div>
        </div>
      </section>

      {/* Try it */}
      <section style={{maxWidth:"700px",margin:"0 auto",padding:"80px 40px"}} id="how">
        <h2 style={{fontSize:"32px",fontWeight:"800",marginBottom:"8px",letterSpacing:"-1px"}}>Try it right now</h2>
        <p style={{color:"#9ca3af",marginBottom:"32px",fontSize:"15px"}}>Describe your item and see what CopyAI Pro writes — free, no account needed.</p>
        <div style={{background:"#111",border:"1px solid #1f2937",borderRadius:"14px",padding:"28px"}}>
          <label style={{display:"block",fontSize:"13px",color:"#9ca3af",marginBottom:"8px",fontWeight:"600"}}>Describe your item</label>
          <textarea
            value={item}
            onChange={e=>setItem(e.target.value)}
            placeholder="e.g. Vintage Levi's denim jacket, size M, 90s, distressed wash, minor wear on cuffs"
            rows={4}
            style={{width:"100%",background:"#0a0a0a",border:"1px solid #222",borderRadius:"8px",padding:"14px",color:"white",fontSize:"14px",boxSizing:"border-box",resize:"vertical",lineHeight:"1.6"}}
          />
          <button
            onClick={generate}
            disabled={loading||!item}
            style={{marginTop:"12px",width:"100%",background:loading?"#0e7490":"#22d3ee",color:"black",fontWeight:"800",padding:"14px",borderRadius:"8px",border:"none",cursor:loading?"not-allowed":"pointer",fontSize:"15px"}}>
            {loading ? "Writing your listing..." : "Generate my listing →"}
          </button>
          {result && (
            <div style={{marginTop:"24px",background:"#0c1f1a",border:"1px solid #22d3ee",borderRadius:"10px",padding:"20px"}}>
              <div style={{fontSize:"12px",fontWeight:"700",color:"#22d3ee",marginBottom:"12px",textTransform:"uppercase",letterSpacing:"1px"}}>Your listing:</div>
              <div style={{color:"#e2e8f0",fontSize:"14px",lineHeight:"1.8",whiteSpace:"pre-wrap"}}>{result}</div>
            </div>
          )}
        </div>
      </section>

      {/* How it works */}
      <section style={{background:"#0f0f0f",borderTop:"1px solid #1a1a1a",padding:"80px 40px"}}>
        <div style={{maxWidth:"800px",margin:"0 auto"}}>
          <h2 style={{fontSize:"32px",fontWeight:"800",marginBottom:"48px",letterSpacing:"-1px",textAlign:"center"}}>From blank page to live listing in 3 steps</h2>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"24px"}}>
            {[
              {num:"01",title:"Describe your item",body:"Type a few details — condition, brand, size, era, anything relevant. No need to be perfect."},
              {num:"02",title:"AI writes the listing",body:"CopyAI Pro generates your title, description, and keywords — optimized for eBay search."},
              {num:"03",title:"Paste and sell",body:"Copy your listing, paste into eBay, and go. Takes 30 seconds start to finish."},
            ].map(s=>(
              <div key={s.num} style={{background:"#111",border:"1px solid #1f2937",borderRadius:"12px",padding:"24px"}}>
                <div style={{fontSize:"28px",fontWeight:"900",color:"#22d3ee",marginBottom:"12px"}}>{s.num}</div>
                <div style={{fontWeight:"700",fontSize:"15px",marginBottom:"8px"}}>{s.title}</div>
                <div style={{color:"#9ca3af",fontSize:"14px",lineHeight:"1.6"}}>{s.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section style={{maxWidth:"500px",margin:"0 auto",padding:"80px 40px",textAlign:"center"}} id="pricing">
        <h2 style={{fontSize:"32px",fontWeight:"800",marginBottom:"8px",letterSpacing:"-1px"}}>Simple pricing</h2>
        <p style={{color:"#9ca3af",marginBottom:"40px",fontSize:"15px"}}>One plan. Everything included. Cancel anytime.</p>
        <div style={{background:"#111",border:"2px solid #22d3ee",borderRadius:"16px",padding:"36px"}}>
          <div style={{fontSize:"42px",fontWeight:"900",marginBottom:"4px"}}>$9<span style={{fontSize:"18px",color:"#9ca3af",fontWeight:"400"}}>/mo</span></div>
          <p style={{color:"#9ca3af",fontSize:"14px",marginBottom:"28px"}}>Cancel anytime. No contracts.</p>
          <ul style={{listStyle:"none",padding:0,marginBottom:"28px",textAlign:"left"}}>
            {["Unlimited AI listing generations","eBay, Etsy & Amazon ready","Title, description & keywords","X post for every listing","Email support"].map(f=>(
              <li key={f} style={{padding:"8px 0",borderBottom:"1px solid #1f2937",fontSize:"14px",color:"#d1d5db"}}>✓ {f}</li>
            ))}
          </ul>
          <a href="https://buy.stripe.com/aFaaEWeJE66EgLW9ti2cg00" target="_blank" style={{display:"block",background:"#22d3ee",color:"black",fontWeight:"800",padding:"14px",borderRadius:"8px",textDecoration:"none",fontSize:"15px"}}>
            Get started — $9/mo
          </a>
          <p style={{color:"#4b5563",fontSize:"12px",marginTop:"12px"}}>3 free listings included. No credit card to start.</p>
        </div>
      </section>

      {/* Footer CTA */}
      <section style={{background:"#0f0f0f",borderTop:"1px solid #1a1a1a",padding:"60px 40px",textAlign:"center"}}>
        <h2 style={{fontSize:"28px",fontWeight:"800",marginBottom:"12px",letterSpacing:"-1px"}}>Your next listing writes itself</h2>
        <p style={{color:"#9ca3af",marginBottom:"28px",fontSize:"15px"}}>Upload a photo. Get a listing. Start selling.</p>
        <a href="https://buy.stripe.com/aFaaEWeJE66EgLW9ti2cg00" target="_blank" style={{background:"#22d3ee",color:"black",fontWeight:"800",padding:"16px 32px",borderRadius:"10px",textDecoration:"none",fontSize:"16px",display:"inline-block"}}>
          Start free today
        </a>
      </section>

      {/* Footer */}
      <footer style={{textAlign:"center",padding:"24px",borderTop:"1px solid #1a1a1a",color:"#4b5563",fontSize:"13px"}}>
        © 2026 CopyAI Pro — Built by <a href="https://x.com/ThriftAndStack" target="_blank" style={{color:"#22d3ee",textDecoration:"none"}}>@ThriftAndStack</a>
      </footer>

    </main>
  );
}
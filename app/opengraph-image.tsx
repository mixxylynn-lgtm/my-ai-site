import { ImageResponse } from "next/og";

export const alt = "CopyAI Pro — AI eBay Listing Generator";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0a",
          color: "white",
          fontFamily: "sans-serif",
          padding: "80px",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 34, color: "#22d3ee", fontWeight: 700, letterSpacing: 2, marginBottom: 24 }}>
          COPYAI PRO
        </div>
        <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.1, marginBottom: 28 }}>
          AI eBay Listing Generator
        </div>
        <div style={{ fontSize: 34, color: "#aaa", maxWidth: 900 }}>
          Write optimized eBay, Etsy &amp; Depop listings with AI — plus pricing — in 30 seconds.
        </div>
      </div>
    ),
    { ...size }
  );
}

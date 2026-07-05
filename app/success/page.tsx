import Link from "next/link";

// Change this if your bot's @username ever changes (no leading @).
const BOT_USERNAME = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || "copyaipro_bot";

export const metadata = {
  title: "You're in! — CopyAI Pro Bot",
  robots: { index: false, follow: false },
};

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const { code } = await searchParams;
  const deepLink = code
    ? `https://t.me/${BOT_USERNAME}?start=${encodeURIComponent(code)}`
    : `https://t.me/${BOT_USERNAME}`;

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(1100px 600px at 50% -120px, rgba(34,211,238,0.16), rgba(34,211,238,0.05) 35%, transparent 70%), #0a0a0a",
        backgroundRepeat: "no-repeat",
        color: "white",
        fontFamily: "system-ui,sans-serif",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "460px",
          background: "#111",
          border: "1px solid #22d3ee",
          borderRadius: "18px",
          padding: "40px 32px",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "48px", marginBottom: "12px" }}>🎉</div>
        <h1 style={{ fontSize: "28px", fontWeight: 800, marginBottom: "10px", letterSpacing: "-0.5px" }}>
          You&apos;re in!
        </h1>
        <p style={{ color: "#aaa", fontSize: "15px", lineHeight: 1.7, marginBottom: "28px" }}>
          Payment received. Tap the button below to open Telegram and activate your access instantly.
        </p>

        <a
          href={deepLink}
          style={{
            display: "block",
            background: "#22d3ee",
            color: "black",
            fontWeight: 800,
            padding: "16px",
            borderRadius: "10px",
            textDecoration: "none",
            fontSize: "16px",
            marginBottom: "20px",
          }}
        >
          Activate on Telegram →
        </a>

        <div
          style={{
            background: "#0a0a0a",
            border: "1px solid #1f1f1f",
            borderRadius: "12px",
            padding: "18px 20px",
            textAlign: "left",
            marginBottom: "20px",
          }}
        >
          <div style={{ fontSize: "11px", fontWeight: 700, color: "#444", letterSpacing: "1.5px", marginBottom: "10px" }}>
            BUTTON NOT WORKING?
          </div>
          <p style={{ color: "#888", fontSize: "13px", lineHeight: 1.7, margin: 0 }}>
            Open Telegram, search for{" "}
            <strong style={{ color: "#22d3ee" }}>@{BOT_USERNAME}</strong>, and press{" "}
            <strong style={{ color: "white" }}>START</strong>.
            {code && (
              <>
                {" "}
                If it asks, send this word to activate:
                <br />
                <code
                  style={{
                    display: "inline-block",
                    marginTop: "8px",
                    background: "#1a1a1a",
                    border: "1px solid #2a2a2a",
                    borderRadius: "6px",
                    padding: "6px 10px",
                    color: "#ddd",
                    fontSize: "12px",
                    wordBreak: "break-all",
                  }}
                >
                  /start {code}
                </code>
              </>
            )}
          </p>
        </div>

        <Link href="/" style={{ color: "#555", fontSize: "13px", textDecoration: "none" }}>
          ← Back to home
        </Link>
      </div>
    </main>
  );
}

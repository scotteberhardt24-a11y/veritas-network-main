"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <main style={{ minHeight: "100vh", background: "#030d1e", color: "#fff" }}>
      {/* Hero */}
      <section
        style={{
          maxWidth: 960,
          margin: "0 auto",
          padding: "96px 24px 64px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            color: "#D4AF37",
            fontSize: 13,
            letterSpacing: 2,
            textTransform: "uppercase",
            marginBottom: 16,
          }}
        >
          Veritas Network
        </p>
        <h1
          style={{
            fontSize: "clamp(2.2rem, 5vw, 3.4rem)",
            fontWeight: 700,
            lineHeight: 1.15,
            margin: "0 0 20px",
          }}
        >
          One Badge. Any Job. Everywhere.
        </h1>
        <p
          style={{
            fontSize: 18,
            lineHeight: 1.6,
            color: "#94a3b8",
            maxWidth: 640,
            margin: "0 auto 32px",
          }}
        >
          Veritas is the professional identity layer for work — a lifetime,
          soulbound Trust Passport that only records verified acts, paired with
          a marketplace that hires on truth instead of profiles.
        </p>
        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/passport"
            style={{
              background: "#D4AF37",
              color: "#000",
              padding: "12px 22px",
              borderRadius: 8,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Get your Passport
          </Link>
          <Link
            href="/jobs"
            style={{
              background: "#1a6bff",
              color: "#fff",
              padding: "12px 22px",
              borderRadius: 8,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Browse jobs
          </Link>
        </div>
        <p style={{ marginTop: 16, fontSize: 14 }}>
          <Link href="https://github.com/scotteberhardt24-a11y/Veritas-Identity-Protocol" style={{ color: "#64748b" }}>
            Read the open protocol →
          </Link>
        </p>
      </section>

      {/* Trust strip */}
      <section
        style={{
          borderTop: "1px solid #1e293b",
          borderBottom: "1px solid #1e293b",
          padding: "20px 24px",
        }}
      >
        <div
          style={{
            maxWidth: 960,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: 12,
            textAlign: "center",
            fontSize: 13,
            color: "#94a3b8",
          }}
        >
          <span>Soulbound (non-transferable)</span>
          <span>Append-only history</span>
          <span>World ID–ready uniqueness</span>
          <span>Open Identity Protocol</span>
        </div>
      </section>

      {/* How it works */}
      <section style={{ maxWidth: 960, margin: "0 auto", padding: "64px 24px" }}>
        <h2 style={{ textAlign: "center", fontSize: 28, marginBottom: 40 }}>
          How it works
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 28,
          }}
        >
          <div
            style={{
              background: "#0a1628",
              border: "1px solid #1e293b",
              borderRadius: 12,
              padding: 24,
            }}
          >
            <h3 style={{ color: "#D4AF37", marginTop: 0 }}>For workers</h3>
            <ol style={{ color: "#cbd5e1", lineHeight: 1.7, paddingLeft: 20 }}>
              <li>Prove you’re unique — one human, one passport for life</li>
              <li>Mint your Trust Passport — soulbound identity on-chain</li>
              <li>Do real work — only verified completions count</li>
              <li>Grow TruScore — append-only, no resets</li>
              <li>Take reputation with you across platforms</li>
            </ol>
          </div>
          <div
            style={{
              background: "#0a1628",
              border: "1px solid #1e293b",
              borderRadius: 12,
              padding: 24,
            }}
          >
            <h3 style={{ color: "#1a6bff", marginTop: 0 }}>For clients</h3>
            <ol style={{ color: "#cbd5e1", lineHeight: 1.7, paddingLeft: 20 }}>
              <li>Post a job or rent a bot</li>
              <li>Match on verified skills and TruScore</li>
              <li>Lock funds in escrow until delivery</li>
              <li>Release payment on dual-attested completion</li>
              <li>Build a truth graph, not a stack of résumés</li>
            </ol>
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px 80px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
          }}
        >
          {[
            {
              href: "/passport",
              title: "Trust Passport",
              body: "Lifetime soulbound identity. Verified acts only.",
            },
            {
              href: "/bots",
              title: "Rent a Bot",
              body: "Escrowed automated workers with attested delivery.",
            },
            {
              href: "/jobs",
              title: "Job Board",
              body: "Hire on truth — history that can’t be wiped.",
            },
          ].map((card) => (
            <Link
              key={card.href}
              href={card.href}
              style={{
                display: "block",
                background: "#0a1628",
                border: "1px solid #1e293b",
                borderRadius: 12,
                padding: 20,
                textDecoration: "none",
                color: "#fff",
              }}
            >
              <h3 style={{ margin: "0 0 8px", color: "#D4AF37" }}>{card.title}</h3>
              <p style={{ margin: 0, color: "#94a3b8", fontSize: 14, lineHeight: 1.5 }}>
                {card.body}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

import React, { useRef } from 'react';

/* ═══════════════════════════════════════════════════════════════════════════
   Footer — Clean, professional minimalist footer
   ═══════════════════════════════════════════════════════════════════════════ */
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        marginTop: 80,
        borderTop: '1px solid var(--slate-100)',
        background: 'var(--white)',
      }}
    >
      <div
        style={{
          maxWidth: 1380,
          margin: '0 auto',
          padding: '40px 40px 36px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 20,
          textAlign: 'center',
        }}
      >
        {/* ── Brand wordmark ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'var(--gradient-blue)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 15,
              boxShadow: '0 2px 8px rgba(37,99,235,0.3)',
            }}
          >
            🎨
          </div>
          <div
            className="font-sora"
            style={{
              fontSize: '0.95rem',
              fontWeight: 800,
              background: 'var(--gradient-blue)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.01em',
            }}
          >
            ARTISTIC ANKIT
          </div>
          <div
            className="font-mono"
            style={{
              fontSize: '0.6rem',
              letterSpacing: '0.2em',
              color: 'var(--slate-300)',
              textTransform: 'uppercase',
              paddingLeft: 4,
              borderLeft: '1px solid var(--slate-200)',
              marginLeft: 4,
            }}
          >
            STUDIO GALLERY
          </div>
        </div>

        {/* ── Tagline ── */}
        <p
          style={{
            fontSize: '0.8rem',
            color: 'var(--slate-400)',
            fontWeight: 500,
            letterSpacing: '0.02em',
            maxWidth: 480,
            lineHeight: 1.6,
          }}
        >
          Designed for Artistic Ankit Studio · Official Physical Canvas Archive · Every painting hand-crafted with real brush strokes.
        </p>

        {/* ── Divider ── */}
        <div
          style={{
            height: 1,
            width: '100%',
            maxWidth: 480,
            background:
              'linear-gradient(90deg, transparent, rgba(37,99,235,0.2), rgba(56,189,248,0.2), transparent)',
          }}
        />

        {/* ── Copyright row ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          <span
            className="font-mono"
            style={{ fontSize: '0.68rem', color: 'var(--slate-300)', letterSpacing: '0.08em' }}
          >
            © {year} Artistic Ankit
          </span>
          <span style={{ color: 'var(--slate-200)', fontSize: '0.7rem' }}>·</span>
          <span
            className="font-mono"
            style={{ fontSize: '0.68rem', color: 'var(--slate-300)', letterSpacing: '0.08em' }}
          >
            All artworks hand-painted
          </span>
          <span style={{ color: 'var(--slate-200)', fontSize: '0.7rem' }}>·</span>
          <span
            className="font-mono"
            style={{
              fontSize: '0.68rem',
              color: 'var(--blue-400)',
              letterSpacing: '0.08em',
              fontWeight: 600
            }}
          >
            Est. 2024 on YouTube
          </span>
        </div>
      </div>
    </footer>
  );
}

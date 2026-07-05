import React, { useState, useEffect } from 'react';
import Image from 'next/image';

/* ═══════════════════════════════════════════════════════════════════════════
   AboutModal — Ankit's full creator profile, story, skills & social links
   Props:
     isOpen   {boolean}
     onClose  {() => void}
   ═══════════════════════════════════════════════════════════════════════════ */

const SKILLS = [
  { label: 'Anime Sketch',   pct: 95, color: '#2563eb' },
  { label: 'Acrylic',        pct: 90, color: '#0ea5e9' },
  { label: 'Watercolor',     pct: 85, color: '#6366f1' },
  { label: 'Oil Painting',   pct: 75, color: '#f59e0b' },
  { label: 'Charcoal',       pct: 88, color: '#64748b' },
  { label: 'Digital Art',    pct: 70, color: '#10b981' },
];

const TIMELINE = [
  { year: '2020', title: 'Pehli Brush Stroke', desc: 'Anime se pyaar hua aur canvas pe utaarna shuru kiya.' },
  { year: '2022', title: 'YouTube Channel Shuru', desc: 'Painting videos upload karne lage — community banne lagi.' },
  { year: '2023', title: 'Studio Gallery Launch', desc: 'Physical paintings sell karna shuru — pehli sale 🎉' },
  { year: '2024', title: 'Commissions Open', desc: 'Ab har koi apni pasand ki painting order kar sakta hai!' },
];

const SOCIALS = [
  {
    label: 'YouTube',
    handle: '@ArtisticAnkit',
    href: 'https://www.youtube.com/@Artisticankit0',
    emoji: '📺',
    color: '#ef4444',
    bg: 'rgba(239,68,68,0.07)',
    border: 'rgba(239,68,68,0.2)',
  },
  {
    label: 'Instagram',
    handle: '@artistic.ankitInsta',
    href: 'https://www.instagram.com/artisticankit0?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==',
    emoji: '📸',
    color: '#ec4899',
    bg: 'rgba(236,72,153,0.07)',
    border: 'rgba(236,72,153,0.2)',
  },
  {
    label: 'Email',
    handle: 'artisticankit0@gmail.com',
    href: 'mailto:artisticankit0@gmail.com',
    emoji: '📧',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.07)',
    border: 'rgba(245,158,11,0.2)',
  },
];

/* ── Animated skill bar ── */
function SkillBar({ label, pct, color, animate }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        marginBottom: 6,
      }}>
        <span style={{
          fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-700)',
          fontFamily: 'Inter, sans-serif',
        }}>{label}</span>
        <span style={{
          fontSize: '0.72rem', fontWeight: 700, color,
          fontFamily: 'JetBrains Mono, monospace',
        }}>{pct}%</span>
      </div>
      <div style={{
        height: 7, borderRadius: 999,
        background: 'var(--slate-100)',
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: animate ? `${pct}%` : '0%',
          background: `linear-gradient(90deg, ${color}, ${color}99)`,
          borderRadius: 999,
          transition: 'width 1.1s cubic-bezier(0.4,0,0.2,1)',
          transitionDelay: '0.1s',
        }} />
      </div>
    </div>
  );
}

export default function AboutModal({ isOpen, onClose }) {
  const [animateBars, setAnimateBars] = useState(false);

  /* ── Trigger skill bar animation after modal opens ── */
  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => setAnimateBars(true), 200);
      return () => clearTimeout(t);
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAnimateBars(false);
    }
  }, [isOpen]);

  /* ── Body scroll lock ── */
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  /* ── ESC to close ── */
  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* ── Backdrop ── */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'rgba(15,23,42,0.6)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          animation: 'fadeIn 0.25s ease',
        }}
      />

      {/* ── Modal ── */}
      <div style={{
        position: 'fixed',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 201,
        width: '95%', maxWidth: 820,
        maxHeight: '92vh', overflowY: 'auto',
        background: 'var(--white)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: '0 40px 100px rgba(37,99,235,0.2), 0 8px 32px rgba(15,23,42,0.16)',
        animation: 'modalPop 0.35s cubic-bezier(0.34,1.56,0.64,1)',
      }}>

        {/* ── Top gradient bar ── */}
        <div style={{
          height: 4,
          background: 'var(--gradient-blue)',
          backgroundSize: '200% 200%',
          animation: 'gradientFlow 4s ease infinite',
          borderRadius: '24px 24px 0 0',
        }} />

        {/* ══════════════════════════════════════
            HERO — Avatar + Name + Bio
            ══════════════════════════════════════ */}
        <div style={{
          padding: '32px 36px 28px',
          background: 'linear-gradient(135deg, rgba(37,99,235,0.03) 0%, rgba(56,189,248,0.03) 100%)',
          borderBottom: '1px solid var(--slate-100)',
          display: 'flex', alignItems: 'center', gap: 28, flexWrap: 'wrap',
          position: 'relative',
        }}>

          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: 20, right: 20,
              width: 36, height: 36, borderRadius: '50%',
              border: '1.5px solid var(--slate-200)', background: 'var(--white)',
              color: 'var(--slate-500)', fontSize: 18, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s ease', flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background  = 'rgba(244,63,94,0.06)';
              e.currentTarget.style.borderColor = 'rgba(244,63,94,0.3)';
              e.currentTarget.style.color       = '#be123c';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background  = 'var(--white)';
              e.currentTarget.style.borderColor = 'var(--slate-200)';
              e.currentTarget.style.color       = 'var(--slate-500)';
            }}
          >✕</button>

          {/* Avatar */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{
              position: 'absolute', inset: -5, borderRadius: '50%',
              background: 'conic-gradient(from 0deg, #2563eb, #38bdf8, #6366f1, #2563eb)',
              animation: 'spinRing 6s linear infinite',
            }} />
            <div style={{
              position: 'absolute', inset: -1, borderRadius: '50%',
              background: 'var(--white)',
            }} />
            <div style={{
              width: 110, height: 110, borderRadius: '50%',
              overflow: 'hidden', position: 'relative', zIndex: 1,
              boxShadow: '0 8px 32px rgba(37,99,235,0.22)',
              background: 'linear-gradient(135deg, rgba(37,99,235,0.1), rgba(56,189,248,0.07))',
            }}>
              <Image
                src="/avatar.png"
                alt="Artistic Ankit"
                width={110} height={110}
                unoptimized
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            </div>
            {/* LIVE dot */}
            <div style={{
              position: 'absolute', bottom: 4, right: 0, zIndex: 2,
              display: 'flex', alignItems: 'center', gap: 4,
              padding: '3px 8px', borderRadius: 999,
              background: 'var(--white)',
              border: '1.5px solid rgba(37,99,235,0.2)',
              boxShadow: '0 2px 8px rgba(37,99,235,0.15)',
            }}>
              <span style={{
                width: 5, height: 5, borderRadius: '50%',
                background: 'var(--blue-600)', display: 'block',
                animation: 'activeDot 2s ease-in-out infinite',
              }} />
              <span className="font-mono" style={{
                fontSize: '0.5rem', fontWeight: 700,
                letterSpacing: '0.1em', color: 'var(--blue-600)',
              }}>LIVE</span>
            </div>
          </div>

          {/* Name + bio */}
          <div style={{ flex: 1, minWidth: 220 }}>
            <div className="font-mono" style={{
              fontSize: '0.62rem', fontWeight: 700,
              letterSpacing: '0.14em', color: 'var(--blue-600)',
              textTransform: 'uppercase', marginBottom: 8,
            }}>
              🎨 Anime Art Creator · YouTube
            </div>
            <h2 className="font-sora" style={{
              fontSize: 'clamp(1.6rem, 4vw, 2.2rem)',
              fontWeight: 900, letterSpacing: '-0.03em',
              marginBottom: 10, lineHeight: 1.1,
            }}>
              <span style={{ color: 'var(--slate-900)' }}>Ankit </span>
              <span style={{
                background: 'var(--gradient-blue)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                animation: 'gradientFlow 5s ease infinite',
              }}>Kumar ✦</span>
            </h2>
            <p style={{
              fontSize: '0.88rem', color: 'var(--slate-500)',
              lineHeight: 1.75, maxWidth: 480,
            }}>
              Ek passionate anime artist jo apni soul canvas pe uundel deta hai.
              Har painting ek kahani hai — real brushstrokes, real emotion.
              YouTube pe journey share karta hoon aur tumhare sapne canvas pe banata hoon. 🙏
            </p>
          </div>
        </div>

        {/* ══════════════════════════════════════
            BODY — 2 columns
            ══════════════════════════════════════ */}
        <div style={{
          padding: '28px 36px 32px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 36,
        }}>

          {/* ── Left column ── */}
          <div>

            {/* Skills */}
            <div style={{ marginBottom: 32 }}>
              <div className="font-mono" style={{
                fontSize: '0.62rem', fontWeight: 700,
                letterSpacing: '0.14em', color: 'var(--blue-600)',
                textTransform: 'uppercase', marginBottom: 16,
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <span style={{
                  height: 1, width: 20, background: 'var(--blue-600)',
                  display: 'inline-block', opacity: 0.5,
                }} />
                Art Skills
              </div>
              {SKILLS.map((s) => (
                <SkillBar key={s.label} {...s} animate={animateBars} />
              ))}
            </div>

            {/* Fun facts */}
            <div>
              <div className="font-mono" style={{
                fontSize: '0.62rem', fontWeight: 700,
                letterSpacing: '0.14em', color: 'var(--blue-600)',
                textTransform: 'uppercase', marginBottom: 16,
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <span style={{
                  height: 1, width: 20, background: 'var(--blue-600)',
                  display: 'inline-block', opacity: 0.5,
                }} />
                Quick Facts
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { emoji: '🎌', text: 'Favourite Anime: Naruto + Demon Slayer' },
                  { emoji: '🖌️', text: 'Medium: Acrylic aur Watercolor' },
                  { emoji: '📍', text: 'Based in: India 🇮🇳' },
                  { emoji: '⏱️', text: 'Ek painting: 6–20 ghante lagta hai' },
                  { emoji: '🎯', text: 'Goal: Har anime fan ke paas uski painting ho' },
                ].map(({ emoji, text }) => (
                  <div key={text} style={{
                    display: 'flex', alignItems: 'flex-start', gap: 10,
                    padding: '10px 14px', borderRadius: 'var(--radius-sm)',
                    background: 'var(--slate-50)',
                    border: '1px solid var(--slate-100)',
                  }}>
                    <span style={{ fontSize: 16, flexShrink: 0 }}>{emoji}</span>
                    <span style={{
                      fontSize: '0.82rem', color: 'var(--slate-600)',
                      fontWeight: 500, lineHeight: 1.5,
                    }}>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right column ── */}
          <div>

            {/* Journey timeline */}
            <div style={{ marginBottom: 32 }}>
              <div className="font-mono" style={{
                fontSize: '0.62rem', fontWeight: 700,
                letterSpacing: '0.14em', color: 'var(--blue-600)',
                textTransform: 'uppercase', marginBottom: 16,
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <span style={{
                  height: 1, width: 20, background: 'var(--blue-600)',
                  display: 'inline-block', opacity: 0.5,
                }} />
                Ankit Ki Journey
              </div>

              <div style={{ position: 'relative', paddingLeft: 28 }}>
                {/* Vertical line */}
                <div style={{
                  position: 'absolute', left: 9, top: 6, bottom: 6,
                  width: 2, borderRadius: 2,
                  background: 'linear-gradient(180deg, var(--blue-600), var(--cyan-400))',
                  opacity: 0.25,
                }} />

                {TIMELINE.map((item, i) => (
                  <div key={item.year} style={{
                    position: 'relative', marginBottom: i < TIMELINE.length - 1 ? 22 : 0,
                  }}>
                    {/* Dot */}
                    <div style={{
                      position: 'absolute', left: -23, top: 4,
                      width: 10, height: 10, borderRadius: '50%',
                      background: 'var(--gradient-blue)',
                      boxShadow: '0 0 0 3px rgba(37,99,235,0.15)',
                    }} />
                    <div className="font-mono" style={{
                      fontSize: '0.62rem', fontWeight: 700,
                      color: 'var(--blue-600)', letterSpacing: '0.08em',
                      marginBottom: 3,
                    }}>{item.year}</div>
                    <div className="font-sora" style={{
                      fontSize: '0.9rem', fontWeight: 700,
                      color: 'var(--slate-800)', marginBottom: 4,
                    }}>{item.title}</div>
                    <div style={{
                      fontSize: '0.8rem', color: 'var(--slate-500)', lineHeight: 1.55,
                    }}>{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social links */}
            <div>
              <div className="font-mono" style={{
                fontSize: '0.62rem', fontWeight: 700,
                letterSpacing: '0.14em', color: 'var(--blue-600)',
                textTransform: 'uppercase', marginBottom: 16,
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <span style={{
                  height: 1, width: 20, background: 'var(--blue-600)',
                  display: 'inline-block', opacity: 0.5,
                }} />
                Connect Karo
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {SOCIALS.map(({ label, handle, href, emoji, color, bg, border }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'flex', alignItems: 'center',
                      gap: 14, padding: '12px 16px',
                      borderRadius: 'var(--radius-md)',
                      background: bg,
                      border: `1.5px solid ${border}`,
                      textDecoration: 'none',
                      transition: 'transform 0.22s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.22s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform  = 'translateY(-3px)';
                      e.currentTarget.style.boxShadow  = `0 8px 24px ${color}22`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{
                      width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                      background: `${color}15`,
                      border: `1.5px solid ${color}25`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 18,
                    }}>{emoji}</div>
                    <div>
                      <div style={{
                        fontSize: '0.85rem', fontWeight: 700,
                        color: 'var(--slate-800)', fontFamily: 'Sora, sans-serif',
                      }}>{label}</div>
                      <div style={{
                        fontSize: '0.72rem', color,
                        fontFamily: 'JetBrains Mono, monospace',
                        fontWeight: 600, letterSpacing: '0.04em',
                      }}>{handle}</div>
                    </div>
                    <span style={{
                      marginLeft: 'auto', fontSize: 14,
                      color: 'var(--slate-300)',
                    }}>→</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Keyframes ── */}
      <style>{`
        @keyframes fadeIn  { from { opacity:0 } to { opacity:1 } }
        @keyframes modalPop {
          from { opacity:0; transform:translate(-50%,calc(-50% + 24px)) scale(0.96); }
          to   { opacity:1; transform:translate(-50%,-50%) scale(1); }
        }
      `}</style>
    </>
  );
}

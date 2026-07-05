import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { API_URL } from '../config/env';
import CommissionModal from './CommissionModal';
import ParticleBackground from './ParticleBackground';

/* ═══════════════════════════════════════════════════════════════════════════
   Hero — YouTube Creator-style profile hero section
   Props:
     count  {number}  — live painting count to display in stats
   ═══════════════════════════════════════════════════════════════════════════ */
export default function Hero({ count }) {
  const [imgLoaded,         setImgLoaded]         = useState(false);
  const [isCommissionOpen,  setIsCommissionOpen]   = useState(false);
  const [activeSpotlightIdx, setActiveSpotlightIdx] = useState(0);

  const CAROUSEL_IMAGES = [
    "/uploads/paintings/b0329b75-3055-48b7-bb5f-14fdc62967e2.jpeg",
    "/uploads/paintings/23d3aeb1-4057-49b9-a6c8-c8efd90f6f6a.jpeg",
    "/uploads/paintings/132e964f-e080-40af-b079-4568e7cf6249.jpeg"
  ];

  /* Auto-rotate spotlight */
  useEffect(() => {
    const imagesLength = CAROUSEL_IMAGES.length;
    const spotId = setInterval(() => {
      setActiveSpotlightIdx(prev => (prev + 1) % imagesLength);
    }, 4000);
    return () => { clearInterval(spotId); };
  }, [CAROUSEL_IMAGES.length]);

  const stats = [
    { val: count > 0 ? `${count}+` : '—', label: 'Artworks',       icon: '🎨' },
    { val: '100%',                          label: 'Hand-Painted',   icon: '✋' },
    { val: '2024',                          label: 'Est. YouTube',   icon: '📺' },
    { val: 'OPEN',                          label: 'Commissions',    icon: '✉️'  },
  ];

  return (
    <section
      className="hero-section"
      style={{
        position: 'relative',
        padding: '72px 40px 80px',
        overflow: 'hidden',
      }}
    >
      {/* ── Decorative background blobs & Particles ── */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
      }}>
        <ParticleBackground />

        {/* Large blue ellipse — top right */}
        <div style={{
          position: 'absolute',
          width: 600, height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37,99,235,0.07) 0%, transparent 70%)',
          top: '-30%', right: '-10%',
          animation: 'blueOrb 20s ease-in-out infinite',
        }} />
        {/* Cyan splash — bottom left */}
        <div style={{
          position: 'absolute',
          width: 400, height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(56,189,248,0.06) 0%, transparent 70%)',
          bottom: '-20%', left: '5%',
          animation: 'blueOrb 28s ease-in-out infinite reverse',
        }} />
      </div>

      {/* ── Content wrapper ── */}
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* ════════════════════════════════════
            TOP ROW — Avatar + Identity
            ════════════════════════════════════ */}
        <div
          className="hero-flex"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 48,
            flexWrap: 'wrap',
            justifyContent: 'center',
            animation: 'fadeSlideUp 0.7s ease 0.1s both',
          }}
        >
          {/* ── Avatar column ── */}
          <div style={{ position: 'relative', flexShrink: 0 }}>

            {/* Outer animated glow ring */}
            <div style={{
              position: 'absolute',
              inset: -6,
              borderRadius: '50%',
              background: 'conic-gradient(from 0deg, #2563eb, #38bdf8, #6366f1, #2563eb)',
              animation: 'spinRing 5s linear infinite',
              zIndex: 0,
            }} />

            {/* White gap ring */}
            <div style={{
              position: 'absolute',
              inset: -2,
              borderRadius: '50%',
              background: 'var(--snow)',
              zIndex: 1,
            }} />

            {/* Avatar image */}
            <div
              style={{
                width: 148,
                height: 148,
                borderRadius: '50%',
                overflow: 'hidden',
                position: 'relative',
                zIndex: 2,
                background: 'linear-gradient(135deg, rgba(37,99,235,0.12), rgba(56,189,248,0.08))',
                boxShadow: '0 8px 40px rgba(37,99,235,0.25)',
                transition: 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.06)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <Image
                src="/avatar.jpg"
                alt="Artistic Ankit — Anime Art Creator"
                onLoad={() => setImgLoaded(true)}
                fill
                sizes="148px"
                priority
                style={{
                  objectFit: 'cover',
                  opacity: imgLoaded ? 1 : 0,
                  transition: 'opacity 0.5s ease',
                }}
              />
              {/* Fallback emoji if image fails */}
              {!imgLoaded && (
                <div style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 52,
                }}>
                  🎨
                </div>
              )}
            </div>

            {/* Live badge */}
            <div style={{
              position: 'absolute',
              bottom: 8,
              right: 4,
              zIndex: 3,
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              padding: '4px 10px',
              borderRadius: 999,
              background: 'var(--white)',
              border: '1.5px solid rgba(37,99,235,0.2)',
              boxShadow: '0 2px 12px rgba(37,99,235,0.15)',
            }}>
              <span style={{
                width: 6, height: 6, borderRadius: '50%',
                background: 'var(--blue-600)',
                display: 'inline-block',
                animation: 'activeDot 2s ease-in-out infinite, pulseBlue 2s ease-in-out infinite',
              }} />
              <span className="font-mono" style={{
                fontSize: '0.56rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                color: 'var(--blue-600)',
              }}>LIVE</span>
            </div>
          </div>

          {/* ── Identity column ── */}
          <div style={{ flex: 1, minWidth: 280 }}>

            {/* Channel tag */}
            <div
              className="font-mono"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '5px 14px',
                borderRadius: 999,
                background: 'rgba(37,99,235,0.07)',
                border: '1.5px solid rgba(37,99,235,0.18)',
                fontSize: '0.68rem',
                fontWeight: 600,
                letterSpacing: '0.12em',
                color: 'var(--blue-600)',
                marginBottom: 18,
                textTransform: 'uppercase',
              }}
            >
              <span>📺</span>
              YouTube · Anime Art Creator
            </div>

            {/* Name headline */}
            <h1
              className="font-sora hero-title"
              style={{
                fontSize: 'clamp(2.4rem, 5.5vw, 4.2rem)',
                fontWeight: 900,
                lineHeight: 1.05,
                letterSpacing: '-0.035em',
                marginBottom: 14,
              }}
            >
              <span style={{ color: 'var(--slate-900)', display: 'block' }}>
                Artistic
              </span>
              <span
                style={{
                  display: 'block',
                  background: 'linear-gradient(100deg, #1e40af 0%, #2563eb 40%, #38bdf8 100%)',
                  backgroundSize: '200% auto',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  animation: 'gradientFlow 5s ease infinite',
                }}
              >
                Ankit ✦
              </span>
            </h1>

            {/* Tagline */}
            <p className="hero-text" style={{
              fontSize: '1rem',
              color: 'var(--slate-500)',
              lineHeight: 1.7,
              maxWidth: 520,
              marginBottom: 28,
            }}>
              Hand-crafted anime paintings on real canvas — inspired by the stories,
              painted with soul. Every brushstroke from Ankit&apos;s YouTube channel,
              now available as a physical masterpiece.
            </p>

            {/* ── CTA Buttons ── */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <a
                href="#"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '12px 26px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--gradient-blue)',
                  backgroundSize: '200% 200%',
                  animation: 'gradientFlow 4s ease infinite',
                  color: '#fff',
                  fontFamily: 'Sora, sans-serif',
                  fontSize: '0.86rem',
                  fontWeight: 700,
                  letterSpacing: '0.03em',
                  textDecoration: 'none',
                  boxShadow: 'var(--shadow-blue)',
                  transition: 'transform 0.22s ease, box-shadow 0.28s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 12px 36px rgba(37,99,235,0.35)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-blue)';
                }}
              >
                🎨 Browse Gallery
              </a>

              <a
                href="https://www.youtube.com/@Artisticankit0"
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '12px 26px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--white)',
                  color: 'var(--slate-700)',
                  border: '1.5px solid var(--slate-200)',
                  fontFamily: 'Sora, sans-serif',
                  fontSize: '0.86rem',
                  fontWeight: 600,
                  letterSpacing: '0.03em',
                  textDecoration: 'none',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'transform 0.22s ease, border-color 0.2s ease, box-shadow 0.22s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.borderColor = 'rgba(37,99,235,0.3)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(37,99,235,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'var(--slate-200)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                }}
              >
                📺 YouTube Channel
              </a>

              <button
                onClick={() => setIsCommissionOpen(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '12px 26px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--white)',
                  color: 'var(--slate-700)',
                  border: '1.5px solid var(--slate-200)',
                  fontFamily: 'Sora, sans-serif',
                  fontSize: '0.86rem',
                  fontWeight: 600,
                  letterSpacing: '0.03em',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'transform 0.22s ease, border-color 0.2s ease, box-shadow 0.22s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.borderColor = 'rgba(37,99,235,0.3)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(37,99,235,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'var(--slate-200)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                }}
              >
                ✉️ Commission Me
              </button>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════
            STATS ROW
            ════════════════════════════════════ */}
        <div
          className="stats-grid"
          style={{
            marginTop: 60,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 16,
            animation: 'fadeSlideUp 0.7s ease 0.35s both',
          }}
        >
          {stats.map(({ val, label, icon }) => (
            <div
              key={label}
              style={{
                background: 'var(--white)',
                border: '1px solid var(--slate-100)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-sm)',
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                transition: 'transform 0.28s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.28s ease, border-color 0.2s',
                cursor: 'default',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(37,99,235,0.12)';
                e.currentTarget.style.borderColor = 'rgba(37,99,235,0.18)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                e.currentTarget.style.borderColor = 'var(--slate-100)';
              }}
            >
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                background: 'linear-gradient(135deg, rgba(37,99,235,0.08), rgba(56,189,248,0.06))',
                border: '1px solid rgba(37,99,235,0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 20,
                flexShrink: 0,
              }}>
                {icon}
              </div>
              <div>
                <div className="font-sora" style={{
                  fontSize: '1.45rem',
                  fontWeight: 800,
                  background: 'var(--gradient-blue)',
                  backgroundSize: '200% 200%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  animation: 'gradientFlow 5s ease infinite',
                  lineHeight: 1.1,
                }}>
                  {val}
                </div>
                <div style={{
                  fontSize: '0.72rem',
                  color: 'var(--slate-400)',
                  fontWeight: 500,
                  letterSpacing: '0.05em',
                  marginTop: 3,
                  textTransform: 'uppercase',
                  fontFamily: 'JetBrains Mono, monospace',
                }}>
                  {label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Spotlight Carousel ── */}
        <div style={{ marginTop: 80, position: 'relative', height: 400, perspective: 1000, display: 'flex', justifyContent: 'center' }}>
          {CAROUSEL_IMAGES.map((src, idx) => {
            let offset = idx - activeSpotlightIdx;
            if (offset < 0) offset += CAROUSEL_IMAGES.length;
            
            const isActive = offset === 0;
            const isPrev = offset === CAROUSEL_IMAGES.length - 1;
            const isNext = offset === 1;

            let transform = 'translateZ(-400px) scale(0.5)';
            let opacity = 0;
            let zIndex = 0;

            if (isActive) {
              transform = 'translateZ(0) scale(1) translateX(0)';
              opacity = 1;
              zIndex = 10;
            } else if (isPrev) {
              transform = 'translateZ(-100px) scale(0.8) translateX(-50%)';
              opacity = 0.6;
              zIndex = 5;
            } else if (isNext) {
              transform = 'translateZ(-100px) scale(0.8) translateX(50%)';
              opacity = 0.6;
              zIndex = 5;
            }

            return (
              <div 
                key={idx}
                style={{
                  position: 'absolute',
                  width: 300,
                  height: 400,
                  borderRadius: 16,
                  overflow: 'hidden',
                  transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  transform,
                  opacity,
                  zIndex,
                  boxShadow: isActive ? '0 30px 60px rgba(0,0,0,0.4)' : '0 10px 30px rgba(0,0,0,0.2)',
                  cursor: isActive ? 'default' : 'pointer'
                }}
                onClick={() => !isActive && setActiveSpotlightIdx(idx)}
              >
                <Image src={src} alt="Featured Artwork" fill style={{ objectFit: 'cover' }} unoptimized />
                {isActive && (
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0, 
                    background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                    padding: '30px 20px 20px', color: '#fff', textAlign: 'center'
                  }}>
                    <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px', opacity: 0.8 }}>Featured Masterpiece</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>



        {/* ── Gradient divider ── */}
        <div style={{
          height: 1,
          marginTop: 64,
          background: 'linear-gradient(90deg, transparent, rgba(37,99,235,0.25), rgba(56,189,248,0.25), transparent)',
        }} />
      </div>
      {/* ── Commission Modal ── */}
      <CommissionModal
        isOpen={isCommissionOpen}
        onClose={() => setIsCommissionOpen(false)}
      />

    </section>
  );
}

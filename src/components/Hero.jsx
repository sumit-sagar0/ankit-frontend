import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { API_URL } from '../config/env';
import CommissionModal from './CommissionModal';

/* ═══════════════════════════════════════════════════════════════════════════
   Hero — YouTube Creator-style profile hero section
   Props:
     count  {number}  — live painting count to display in stats
   ═══════════════════════════════════════════════════════════════════════════ */
export default function Hero({ count }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [isCommissionOpen, setIsCommissionOpen] = useState(false);
  const [activeSpotlightIdx, setActiveSpotlightIdx] = useState(0);

  const [stageTilt, setStageTilt] = useState({ rotX: 6, rotY: -12 });

  const handleMouseMove3D = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setStageTilt({
      rotX: -(y / (rect.height / 2)) * 16,
      rotY: (x / (rect.width / 2)) * 16,
    });
  };

  const handleMouseLeave3D = () => {
    setStageTilt({ rotX: 6, rotY: -12 });
  };

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
    { val: count > 0 ? `${count}+` : '—', label: 'Artworks', icon: '🎨' },
    { val: '100%', label: 'Hand-Painted', icon: '✋' },
    { val: '2024', label: 'Est. YouTube', icon: '📺' },
    { val: 'OPEN', label: 'Commissions', icon: '✉️' },
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
            justifyContent: 'space-between',
            animation: 'fadeSlideUp 0.7s ease 0.1s both',
          }}
        >
          {/* ── Avatar column with 3D Animated Ring & Floating Badge ── */}
          <div style={{ position: 'relative', flexShrink: 0, perspective: 800 }}>

            {/* Glowing Conic Gradient Ring */}
            <div style={{
              position: 'absolute',
              inset: -6,
              borderRadius: '50%',
              background: 'conic-gradient(from 0deg, #8b5cf6, #ec4899, #06b6d4, #8b5cf6)',
              animation: 'spinSlow 12s linear infinite',
              filter: 'blur(6px)',
              opacity: 0.85,
            }} />

            {/* Avatar image frame */}
            <div
              style={{
                width: 156,
                height: 156,
                borderRadius: '50%',
                overflow: 'hidden',
                position: 'relative',
                zIndex: 2,
                background: 'var(--white)',
                boxShadow: '0 16px 40px rgba(139,92,246,0.3)',
                transition: 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)',
                border: '4px solid var(--white)',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.06) rotate(2deg)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1) rotate(0deg)'}
            >
              <Image
                src="/avatar.jpg"
                alt="Artistic Ankit — Anime Art Creator"
                onLoad={() => setImgLoaded(true)}
                fill
                sizes="156px"
                priority
                style={{
                  objectFit: 'cover',
                  opacity: imgLoaded ? 1 : 0,
                  transition: 'opacity 0.5s ease',
                }}
              />
              {!imgLoaded && (
                <div style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 56,
                }}>
                  🎨
                </div>
              )}
            </div>

            {/* Floating Live Badge */}
            <div style={{
              position: 'absolute',
              bottom: 4,
              right: -6,
              zIndex: 4,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '5px 12px',
              borderRadius: 999,
              background: 'rgba(15,23,42,0.9)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(139,92,246,0.5)',
              boxShadow: '0 6px 20px rgba(139,92,246,0.35)',
              color: '#ffffff',
            }}>
              <span style={{
                width: 7, height: 7, borderRadius: '50%',
                background: '#22c55e',
                display: 'inline-block',
                animation: 'activeDot 2s ease-in-out infinite',
                boxShadow: '0 0 10px #22c55e',
              }} />
              <span className="font-mono" style={{
                fontSize: '0.62rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
                color: '#ffffff',
              }}>LIVE STUDIO</span>
            </div>
          </div>

          {/* ── Identity column (Headline, Description & 3D Styling) ── */}
          <div style={{ flex: 1, minWidth: 280, maxWidth: 540 }}>

            {/* Channel tag pill */}
            <div
              className="font-mono"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 16px',
                borderRadius: 999,
                background: 'var(--white)',
                border: '1px solid rgba(139,92,246,0.3)',
                fontSize: '0.7rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
                color: 'var(--slate-800)',
                marginBottom: 20,
                textTransform: 'uppercase',
                boxShadow: '0 4px 15px rgba(139,92,246,0.12)',
              }}
            >
              <span style={{ color: '#ef4444' }}>🔴</span>
              YouTube · Anime Art Creator
            </div>

            {/* 3D Impact Headline */}
            <h1
              className="font-sora hero-title"
              style={{
                fontSize: 'clamp(2.6rem, 5.8vw, 4.5rem)',
                fontWeight: 800,
                lineHeight: 1.08,
                letterSpacing: '-0.03em',
                marginBottom: 16,
                color: 'var(--slate-900)',
              }}
            >
              <span style={{ display: 'block', fontWeight: 800, color: 'var(--slate-900)' }}>
                Artistic
              </span>
              <div style={{ display: 'inline-flex', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                <span
                  style={{
                    display: 'inline-block',
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #f59e0b 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontStyle: 'italic',
                    fontWeight: 900,
                    filter: 'drop-shadow(0 4px 14px rgba(139,92,246,0.35))',
                  }}
                >
                  Ankit
                </span>

                {/* 🎨🖌️ 3D Paint Brush & Color Palette Logo Badge */}
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    padding: '6px 14px',
                    borderRadius: 999,
                    background: 'linear-gradient(135deg, rgba(139,92,246,0.14) 0%, rgba(236,72,153,0.14) 50%, rgba(245,158,11,0.14) 100%)',
                    border: '1.5px solid rgba(236,72,153,0.4)',
                    boxShadow: '0 6px 20px rgba(139,92,246,0.25), inset 0 0 12px rgba(236,72,153,0.15)',
                    transform: 'translateY(-2px) rotate(-3deg)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    verticalAlign: 'middle',
                    userSelect: 'none',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-6px) scale(1.08) rotate(4deg)';
                    e.currentTarget.style.boxShadow = '0 10px 28px rgba(236,72,153,0.45)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px) rotate(-3deg)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(139,92,246,0.25), inset 0 0 12px rgba(236,72,153,0.15)';
                  }}
                  title="Artistic Ankit — Master Paint Brush & Color Studio"
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 2px 8px rgba(139,92,246,0.6))' }}>
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C13.1 22 14 21.1 14 20C14 19.5 13.8 19.05 13.48 18.72C13.17 18.39 12.98 17.94 12.98 17.44C12.98 16.34 13.88 15.44 14.98 15.44H16.84C19.69 15.44 22 13.13 22 10.28C22 5.71 17.52 2 12 2Z" fill="url(#hero-palette-grad)" />
                    <circle cx="6.5" cy="11.5" r="1.6" fill="#ef4444" />
                    <circle cx="9.5" cy="7.5" r="1.6" fill="#f59e0b" />
                    <circle cx="14.5" cy="7.5" r="1.6" fill="#10b981" />
                    <circle cx="17.5" cy="11.5" r="1.6" fill="#06b6d4" />
                    <defs>
                      <linearGradient id="hero-palette-grad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#8b5cf6" />
                        <stop offset="0.5" stopColor="#ec4899" />
                        <stop offset="1" stopColor="#f59e0b" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <span style={{ fontSize: '1.25rem', filter: 'drop-shadow(0 2px 6px rgba(245,158,11,0.6))', display: 'inline-block', transform: 'rotate(12deg)' }}>
                    🖌️
                  </span>
                </span>
              </div>
            </h1>

            {/* Tagline */}
            <p className="hero-text" style={{
              fontSize: '1.02rem',
              color: 'var(--slate-500)',
              lineHeight: 1.7,
              maxWidth: 520,
              marginBottom: 20,
            }}>
              Hand-crafted anime paintings on real canvas — inspired by the stories,
              painted with soul. Every brushstroke from Ankit&apos;s YouTube channel,
              now available as a physical masterpiece.
            </p>

            {/* Feature Chips */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 28 }}>
              <span style={{
                background: 'var(--slate-100)',
                color: 'var(--slate-700)',
                padding: '4px 12px',
                borderRadius: 999,
                fontSize: '0.72rem',
                fontWeight: 600,
                border: '1px solid var(--slate-200)'
              }}>
                🎨 100% Acrylic Canvas
              </span>
              <span style={{
                background: 'var(--slate-100)',
                color: 'var(--slate-700)',
                padding: '4px 12px',
                borderRadius: 999,
                fontSize: '0.72rem',
                fontWeight: 600,
                border: '1px solid var(--slate-200)'
              }}>
                ✨ 100K+ YouTube Fans
              </span>
              <span style={{
                background: 'var(--slate-100)',
                color: 'var(--slate-700)',
                padding: '4px 12px',
                borderRadius: 999,
                fontSize: '0.72rem',
                fontWeight: 600,
                border: '1px solid var(--slate-200)'
              }}>
                📜 Certificate Signed
              </span>
            </div>

            {/* ── CTA Buttons ── */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <a
                href="#"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '13px 28px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                  color: '#ffffff',
                  fontFamily: 'Sora, sans-serif',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  letterSpacing: '0.03em',
                  textDecoration: 'none',
                  boxShadow: '0 6px 20px rgba(139,92,246,0.4)',
                  transition: 'transform 0.22s ease, box-shadow 0.28s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(236,72,153,0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(139,92,246,0.4)';
                }}
              >
                Explore Gallery ➔
              </a>

              <a
                href="https://www.youtube.com/@Artisticankit0"
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '13px 24px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--white)',
                  color: 'var(--slate-800)',
                  border: '1px solid var(--slate-200)',
                  fontFamily: 'Sora, sans-serif',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  letterSpacing: '0.03em',
                  textDecoration: 'none',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'transform 0.22s ease, border-color 0.2s ease, box-shadow 0.22s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.borderColor = 'rgba(239,68,68,0.5)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(239,68,68,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'var(--slate-200)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                }}
              >
                <span style={{ color: '#ef4444' }}>▶</span> YouTube Channel
              </a>

              <button
                onClick={() => setIsCommissionOpen(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '13px 24px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--white)',
                  color: 'var(--slate-800)',
                  border: '1px solid var(--slate-200)',
                  fontFamily: 'Sora, sans-serif',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  letterSpacing: '0.03em',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'transform 0.22s ease, border-color 0.2s ease, box-shadow 0.22s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.borderColor = 'rgba(139,92,246,0.5)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(139,92,246,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'var(--slate-200)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                }}
              >
                <span>🖌️</span> Custom Commission
              </button>
            </div>
          </div>

          {/* ── 3D Interactive Studio Easel Stage (Right Side Showcase) ── */}
          <div 
            style={{ 
              position: 'relative', 
              flexShrink: 0,
              width: 'min(360px, 94vw)',
              maxWidth: '100%',
              height: 440,
              perspective: 1200,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
            onMouseMove={handleMouseMove3D}
            onMouseLeave={handleMouseLeave3D}
          >
            {/* Ambient Back Glow Ring */}
            <div style={{
              position: 'absolute',
              width: 'min(320px, 80vw)',
              height: 'min(320px, 80vw)',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(139,92,246,0.35) 0%, rgba(236,72,153,0.2) 55%, transparent 70%)',
              filter: 'blur(30px)',
              zIndex: 0,
              animation: 'blueOrb 8s ease-in-out infinite'
            }} />

            {/* 3D Tilted Easel Canvas Deck */}
            <div
              style={{
                position: 'relative',
                width: 'min(310px, 86vw)',
                height: 390,
                borderRadius: 24,
                transformStyle: 'preserve-3d',
                transform: `rotateX(${stageTilt.rotX}deg) rotateY(${stageTilt.rotY}deg)`,
                transition: 'transform 0.15s ease-out',
                background: 'linear-gradient(145deg, rgba(255,255,255,0.95), rgba(241,245,249,0.95))',
                border: '2px solid rgba(139,92,246,0.3)',
                boxShadow: '0 25px 60px -15px rgba(15,23,42,0.3), 0 0 40px rgba(139,92,246,0.2)',
                zIndex: 1,
                overflow: 'visible',
              }}
            >
              {/* Inner Canvas Image Frame */}
              <div style={{
                position: 'absolute',
                inset: 12,
                borderRadius: 18,
                overflow: 'hidden',
                boxShadow: 'inset 0 0 10px rgba(0,0,0,0.4)',
                background: '#0f172a',
              }}>
                <Image
                  src={CAROUSEL_IMAGES[activeSpotlightIdx]}
                  alt="Featured 3D Studio Painting"
                  fill
                  sizes="310px"
                  style={{ objectFit: 'cover' }}
                  unoptimized
                />

                {/* Canvas Overlay Gradient */}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.75) 100%)',
                }} />
              </div>

              {/* 3D FLOATING SEAL: Golden Wax Authenticity Seal (Top Right) */}
              <div style={{
                position: 'absolute',
                top: -14,
                right: -14,
                transform: 'translateZ(50px) rotate(8deg)',
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: '#ffffff',
                padding: '6px 14px',
                borderRadius: 999,
                fontSize: '0.68rem',
                fontWeight: 800,
                letterSpacing: '0.06em',
                boxShadow: '0 10px 24px rgba(217,119,6,0.45)',
                border: '2px solid #fef08a',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                zIndex: 10,
              }}>
                <span>🏅</span> 100% HAND PAINTED
              </div>

              {/* 3D FLOATING PALETTE: Artist Glass Palette & Brush (Bottom Left) */}
              <div style={{
                position: 'absolute',
                bottom: 30,
                left: -24,
                transform: 'translateZ(65px)',
                background: 'rgba(15,23,42,0.88)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 16,
                padding: '8px 14px',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                boxShadow: '0 15px 30px rgba(0,0,0,0.35)',
                animation: 'float3DSlow 4s ease-in-out infinite',
                zIndex: 10,
              }}>
                <div style={{ fontSize: 20 }}>🎨</div>
                <div>
                  <div style={{ fontSize: '0.62rem', fontWeight: 800, color: '#ec4899', letterSpacing: '0.05em' }}>ACRYLIC ON CANVAS</div>
                  <div style={{ fontSize: '0.74rem', fontWeight: 600 }}>Masterpiece Edition</div>
                </div>
              </div>

              {/* 3D FLOATING GLASS OVERLAY: Live Interactive Info (Bottom Inside Canvas) */}
              <div style={{
                position: 'absolute',
                bottom: 12,
                left: 12,
                right: 12,
                transform: 'translateZ(35px)',
                background: 'rgba(255,255,255,0.12)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.25)',
                borderRadius: 14,
                padding: '12px 14px',
                color: '#ffffff',
                zIndex: 5,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontSize: '0.6rem', color: '#a7f3d0', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                      Studio Original · 2026
                    </span>
                    <div style={{ fontFamily: 'Sora, sans-serif', fontSize: '0.9rem', fontWeight: 700 }}>
                      Custom Anime Original
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsCommissionOpen(true)}
                    style={{
                      background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                      border: 'none',
                      borderRadius: 8,
                      padding: '6px 12px',
                      color: '#fff',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(139,92,246,0.4)',
                    }}
                  >
                    Custom Art ⚡
                  </button>
                </div>
              </div>

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
                borderRadius: '50%',
                background: 'var(--slate-50)',
                border: '1px solid var(--slate-200)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
                flexShrink: 0,
                color: 'var(--slate-700)'
              }}>
                {icon}
              </div>
              <div>
                <div className="font-sora" style={{
                  fontSize: '1.45rem',
                  fontWeight: 600,
                  color: 'var(--slate-900)',
                  lineHeight: 1.1,
                }}>
                  {val}
                </div>
                <div style={{
                  fontSize: '0.72rem',
                  color: 'var(--slate-500)',
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



        {/* ── Line divider ── */}
        <div style={{
          height: 1,
          marginTop: 64,
          background: 'var(--slate-200)',
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

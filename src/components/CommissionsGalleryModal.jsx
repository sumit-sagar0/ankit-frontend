import React, { useState, useEffect } from 'react';
import CommissionModal from './CommissionModal';
import UserAuthModal from './UserAuthModal';
import { useAppData } from '../hooks/useAppData';
import Image from 'next/image';

/* ═══════════════════════════════════════════════════════════════════════════
   CommissionsGalleryModal
   Shows 12 sample anime paintings. User clicks one to select as reference,
   then hits "Commission This Style" to open the commission request form.
   If commissions are closed, shows a Waitlist form instead.
   ═══════════════════════════════════════════════════════════════════════════ */

const SAMPLES = [
  { id: 1,  file: '/samples/01_anime_sketch.png',    label: 'Anime Sketch',   style: 'Pencil & Ink',    color: '#2563eb' },
  { id: 2,  file: '/samples/02_acrylic.png',         label: 'Acrylic',        style: 'Acrylic Canvas',  color: '#0ea5e9' },
  { id: 3,  file: '/samples/03_watercolor.png',      label: 'Watercolor',     style: 'Watercolor Paper',color: '#6366f1' },
  { id: 4,  file: '/samples/04_oil.png',             label: 'Oil Painting',   style: 'Oil on Canvas',   color: '#f59e0b' },
  { id: 5,  file: '/samples/05_charcoal.png',        label: 'Charcoal',       style: 'Charcoal Sketch', color: '#64748b' },
  { id: 6,  file: '/samples/06_shonen.png',          label: 'Shonen Style',   style: 'Acrylic Canvas',  color: '#ef4444' },
  { id: 7,  file: '/samples/07_isekai.png',          label: 'Isekai Style',   style: 'Watercolor',      color: '#0891b2' },
  { id: 8,  file: '/samples/08_shojo.png',           label: 'Shōjo Style',    style: 'Watercolor Paper',color: '#ec4899' },
  { id: 9,  file: '/samples/09_mecha.png',           label: 'Mecha Style',    style: 'Acrylic Canvas',  color: '#f59e0b' },
  { id: 10, file: '/samples/10_digital.png',         label: 'Digital Art',    style: 'Print on Canvas', color: '#10b981' },
  { id: 11, file: '/samples/11_seinen.png',          label: 'Seinen Style',   style: 'Acrylic Canvas',  color: '#7c3aed' },
  { id: 12, file: '/samples/12_slice_of_life.png',   label: 'Slice of Life',  style: 'Watercolor',      color: '#f97316' },
];

export default function CommissionsGalleryModal({ isOpen, onClose }) {
  const [selected,         setSelected]         = useState(null);
  const [showForm,         setShowForm]         = useState(false);
  const [showAuth,         setShowAuth]         = useState(false);
  const [previewImg,       setPreviewImg]       = useState(null);
  
  const { appData } = useAppData();
  const commissionsOpen = appData?.commissionsOpen;
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistSuccess, setWaitlistSuccess] = useState(false);

  /* ── Lock body scroll ── */
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  /* ── ESC key closes ── */
  useEffect(() => {
    const fn = (e) => {
      if (e.key === 'Escape') {
        if (previewImg)  { setPreviewImg(null); return; }
        if (showForm)    { setShowForm(false);  return; }
        onClose();
      }
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [onClose, previewImg, showForm]);

  /* ── Reset on close ── */
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => { setSelected(null); setShowForm(false); setPreviewImg(null); setWaitlistSuccess(false); setWaitlistEmail(''); }, 350);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* ── Full-screen image preview overlay ── */}
      {previewImg && (
        <div
          onClick={() => setPreviewImg(null)}
          style={{
            position:   'fixed', inset: 0,
            zIndex:     400,
            background: 'rgba(10,15,30,0.92)',
            display:    'flex', alignItems: 'center', justifyContent: 'center',
            animation:  'fadeIn 0.2s ease',
            cursor:     'zoom-out',
            padding:    24,
          }}
        >
          <Image
            src={previewImg.file}
            alt={previewImg.label}
            width={800} height={800}
            unoptimized
            style={{
              maxWidth: '88vw', maxHeight: '85vh', width: 'auto', height: 'auto',
              borderRadius: 16,
              boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
              objectFit: 'contain',
              animation: 'modalPop 0.3s cubic-bezier(0.34,1.56,0.64,1)',
            }}
          />
          <div style={{
            position: 'absolute', bottom: 32,
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(12px)',
            padding: '8px 20px', borderRadius: 999,
            color: '#fff', fontSize: '0.82rem', fontWeight: 600,
          }}>
            {previewImg.label} · {previewImg.style} · Click anywhere to close
          </div>
        </div>
      )}

      {/* ── Main backdrop ── */}
      <div
        onClick={onClose}
        style={{
          position:   'fixed', inset: 0, zIndex: 200,
          background: 'rgba(15,23,42,0.65)',
          backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
          animation:  'fadeIn 0.25s ease',
        }}
      />

      {/* ── Modal Window ── */}
      <div
        style={{
          position:  'fixed',
          top:       '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex:    201,
          width:     '95%',
          maxWidth:  920,
          maxHeight: '92vh',
          overflowY: 'auto',
          background: 'var(--snow)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: '0 40px 100px rgba(37,99,235,0.2), 0 8px 32px rgba(15,23,42,0.16)',
          animation: 'modalPop 0.35s cubic-bezier(0.34,1.56,0.64,1)',
        }}
      >
        {/* ── Top gradient bar ── */}
        <div style={{
          height: 4,
          background: 'var(--gradient-blue)',
          backgroundSize: '200% 200%',
          animation: 'gradientFlow 4s ease infinite',
          borderRadius: '24px 24px 0 0',
        }} />

        {/* ── Header ── */}
        <div style={{
          padding: '28px 32px 0',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12,
        }}>
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              padding: '4px 12px', borderRadius: 999, marginBottom: 12,
              background: 'rgba(37,99,235,0.07)',
              border: '1.5px solid rgba(37,99,235,0.18)',
            }}>
              <span style={{
                width: 6, height: 6, borderRadius: '50%',
                background: 'var(--blue-600)', display: 'inline-block',
                animation: 'activeDot 2s ease-in-out infinite',
              }} />
              <span className="font-mono" style={{
                fontSize: '0.62rem', fontWeight: 700,
                letterSpacing: '0.12em', color: 'var(--blue-600)',
                textTransform: 'uppercase',
              }}>
                Ankit&apos;s Sample Works
              </span>
            </div>
            <h2 className="font-sora" style={{
              fontSize: '1.5rem', fontWeight: 800,
              color: 'var(--slate-900)', letterSpacing: '-0.02em', marginBottom: 6,
            }}>
              {commissionsOpen ? '🎨 Choose Your Style' : '⏳ Waitlist Joined'}
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--slate-500)', lineHeight: 1.6 }}>
              {commissionsOpen 
                ? 'Choose a painting as a reference for your commission - then fill out the form!' 
                : 'Commissions are currently full. Join the waitlist to be notified when slots open up!'}
            </p>
          </div>

          {/* Close ✕ */}
          <button
            onClick={onClose}
            style={{
              flexShrink: 0, width: 36, height: 36, borderRadius: '50%',
              border: '1.5px solid var(--slate-200)', background: 'var(--white)',
              color: 'var(--slate-500)', fontSize: 18, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s ease',
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
        </div>

        {/* ── Dynamic Content: Gallery OR Waitlist ── */}
        {!commissionsOpen ? (
          <div style={{ padding: '60px 40px', textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', marginBottom: 20 }}>⏳</div>
            <h3 className="font-sora" style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: 12 }}>
              Currently at Full Capacity
            </h3>
            <p style={{ color: 'var(--slate-600)', marginBottom: 30, maxWidth: 400, margin: '0 auto 30px' }}>
              I am currently working on existing commissions and my slots are full ({appData?.commissionSlots} available). Leave your email below and you&apos;ll be the first to know when I open new slots!
            </p>
            
            {waitlistSuccess ? (
              <div style={{ padding: '16px', background: '#dcfce7', color: '#15803d', borderRadius: 'var(--radius-md)', display: 'inline-block', fontWeight: 600 }}>
                ✓ You&apos;re on the waitlist! I&apos;ll email you soon.
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setWaitlistSuccess(true); }} style={{ display: 'flex', gap: 10, maxWidth: 400, margin: '0 auto' }}>
                <input 
                  type="email" 
                  placeholder="Enter your email address" 
                  required 
                  value={waitlistEmail}
                  onChange={(e) => setWaitlistEmail(e.target.value)}
                  style={{ flex: 1, padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-300)', fontSize: '0.9rem' }}
                />
                <button type="submit" style={{ padding: '12px 24px', borderRadius: 'var(--radius-md)', background: 'var(--slate-900)', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer' }}>
                  Join List
                </button>
              </form>
            )}
          </div>
        ) : (
          <>
            {/* ── Sample image grid ── */}
            <div style={{ padding: '24px 32px' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: 16,
              }}>
                {SAMPLES.map((sample) => {
                  const isSelected = selected?.id === sample.id;
                  return (
                    <div
                      key={sample.id}
                      onClick={() => setSelected(sample)}
                      style={{
                        borderRadius: 'var(--radius-md)',
                        overflow: 'hidden',
                        border: isSelected
                          ? `2.5px solid ${sample.color}`
                          : '2px solid var(--slate-100)',
                        background: 'var(--white)',
                        cursor: 'pointer',
                        boxShadow: isSelected
                          ? `0 8px 32px ${sample.color}30`
                          : 'var(--shadow-sm)',
                        transition: 'all 0.28s cubic-bezier(0.34,1.56,0.64,1)',
                        transform: isSelected ? 'scale(1.03)' : 'scale(1)',
                        position: 'relative',
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.transform   = 'translateY(-6px) scale(1.02)';
                          e.currentTarget.style.boxShadow   = `0 16px 40px ${sample.color}25`;
                          e.currentTarget.style.borderColor = `${sample.color}60`;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.transform   = 'scale(1)';
                          e.currentTarget.style.boxShadow   = 'var(--shadow-sm)';
                          e.currentTarget.style.borderColor = 'var(--slate-100)';
                        }
                      }}
                    >
                      {/* Selected checkmark badge */}
                      {isSelected && (
                        <div style={{
                          position: 'absolute', top: 10, right: 10, zIndex: 3,
                          width: 28, height: 28, borderRadius: '50%',
                          background: sample.color,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 14, color: '#fff', fontWeight: 800,
                          boxShadow: `0 2px 12px ${sample.color}60`,
                        }}>✓</div>
                      )}

                      {/* Colour stripe */}
                      <div style={{
                        height: 3,
                        background: `linear-gradient(90deg, ${sample.color}, ${sample.color}44, transparent)`,
                      }} />

                      {/* Image */}
                      <div style={{
                        width: '100%', paddingTop: '100%', position: 'relative',
                        background: 'var(--snow)',
                      }}>
                        <Image
                          src={sample.file} alt={sample.label}
                          width={400} height={400}
                          unoptimized
                          style={{
                            position: 'absolute', inset: 0,
                            width: '100%', height: '100%', objectFit: 'cover',
                            transition: 'transform 0.4s ease',
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.08)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                        />
                        
                        {/* Zoom hint overlay */}
                        <div
                          onClick={(e) => { e.stopPropagation(); setPreviewImg(sample); }}
                          style={{
                            position: 'absolute', bottom: 6, right: 6,
                            background: 'rgba(0,0,0,0.55)',
                            borderRadius: 6, padding: '3px 7px',
                            color: '#fff', fontSize: '0.65rem',
                            fontFamily: 'JetBrains Mono, monospace',
                            letterSpacing: '0.06em',
                            cursor: 'zoom-in',
                            opacity: 0,
                            transition: 'opacity 0.2s ease',
                          }}
                          className="zoom-hint"
                        >
                          🔍 Zoom
                        </div>
                      </div>

                      {/* Label */}
                      <div style={{ padding: '12px 14px 14px' }}>
                        <div style={{
                          display: 'inline-block',
                          padding: '2px 8px', borderRadius: 4, marginBottom: 6,
                          background: `${sample.color}12`,
                          border: `1px solid ${sample.color}30`,
                          color: sample.color,
                          fontFamily: 'JetBrains Mono, monospace',
                          fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.08em',
                        }}>
                          {sample.style.toUpperCase()}
                        </div>
                        <div className="font-sora" style={{
                          fontSize: '0.88rem', fontWeight: 700,
                          color: 'var(--slate-900)', letterSpacing: '-0.01em',
                        }}>
                          {sample.label}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Bottom action bar ── */}
            <div style={{
              padding: '0 32px 28px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              gap: 14, flexWrap: 'wrap',
              borderTop: '1px solid var(--slate-100)',
              paddingTop: 20, marginTop: 4,
            }}>
              {/* Selected info */}
              <div>
                {selected ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 8, overflow: 'hidden',
                      border: `2px solid ${selected.color}40`,
                      flexShrink: 0,
                    }}>
                      <Image src={selected.file} alt="" width={100} height={100} unoptimized style={{ width: '100%', height: 'auto', objectFit: 'cover' }} />
                    </div>
                    <div>
                      <div className="font-sora" style={{
                        fontSize: '0.88rem', fontWeight: 700, color: 'var(--slate-900)',
                      }}>
                        {selected.label} selected ✓
                      </div>
                      <div style={{
                        fontSize: '0.72rem', color: 'var(--slate-400)',
                        fontFamily: 'JetBrains Mono, monospace',
                      }}>
                        {selected.style}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p style={{ fontSize: '0.82rem', color: 'var(--slate-400)' }}>
                    👆 Select a style
                  </p>
                )}
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={onClose}
                  style={{
                    padding: '11px 22px', borderRadius: 'var(--radius-sm)',
                    border: '1.5px solid var(--slate-200)', background: 'var(--white)',
                    color: 'var(--slate-600)', fontFamily: 'Sora, sans-serif',
                    fontSize: '0.84rem', fontWeight: 600, cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--blue-400)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--slate-200)'; }}
                >
                  Cancel
                </button>

                <button
                  disabled={!selected}
                  onClick={() => {
                    if (localStorage.getItem('aa_user_auth')) {
                      setShowForm(true);
                    } else {
                      setShowAuth(true);
                    }
                  }}
                  style={{
                    padding: '11px 24px', borderRadius: 'var(--radius-sm)',
                    background: selected ? 'var(--gradient-blue)' : 'var(--slate-100)',
                    backgroundSize: '200% 200%',
                    animation: selected ? 'gradientFlow 4s ease infinite' : 'none',
                    color: selected ? '#fff' : 'var(--slate-400)',
                    border: 'none',
                    fontFamily: 'Sora, sans-serif', fontSize: '0.86rem',
                    fontWeight: 700, letterSpacing: '0.03em',
                    cursor: selected ? 'pointer' : 'not-allowed',
                    transition: 'transform 0.22s ease, box-shadow 0.22s ease',
                    boxShadow: selected ? 'var(--shadow-blue)' : 'none',
                  }}
                  onMouseEnter={(e) => {
                    if (selected) {
                      e.currentTarget.style.transform  = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow  = '0 12px 32px rgba(37,99,235,0.35)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = selected ? 'var(--shadow-blue)' : 'none';
                  }}
                >
                  ✉️ Commission This Style →
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── Commission form modal — opens after style is chosen ── */}
      {showForm && (
        <CommissionModal
          isOpen={showForm}
          onClose={() => { setShowForm(false); onClose(); }}
          prefillStyle={selected?.label}
        />
      )}

      {/* ── User Auth Modal ── */}
      <UserAuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onSuccess={() => {
          setShowAuth(false);
          setShowForm(true);
        }}
      />

      {/* ── Keyframes ── */}
      <style>{`
        @keyframes fadeIn  { from { opacity:0 } to { opacity:1 } }
        @keyframes modalPop {
          from { opacity:0; transform:translate(-50%,calc(-50% + 24px)) scale(0.96); }
          to   { opacity:1; transform:translate(-50%,-50%) scale(1); }
        }
        .zoom-hint { opacity: 0 !important; }
        div:hover > div > .zoom-hint { opacity: 1 !important; }
      `}</style>
    </>
  );
}

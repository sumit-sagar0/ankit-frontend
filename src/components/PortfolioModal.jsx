import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { API_BASE } from '../constants/categoryMeta';
import { API_URL } from '../config/env';

/* ═══════════════════════════════════════════════════════════════════════════
   PortfolioModal — Cinematic Dark Gallery Overlay
   Props:
     isOpen   {boolean}
     onClose  {() => void}
   ═══════════════════════════════════════════════════════════════════════════ */

const CATEGORY_COLORS = {
  'Sketch':       '#60a5fa',
  'Acrylic':      '#38bdf8',
  'Watercolor':   '#818cf8',
  'Shonen':       '#f87171',
  'Fantasy':      '#fbbf24',
  'Digital':      '#34d399',
  'Isekai':       '#22d3ee',
  'Shōjo':        '#f472b6',
  'Mecha':        '#fbbf24',
  'Seinen':       '#a78bfa',
  'Slice of Life':'#fb923c',
};

export default function PortfolioModal({ isOpen, onClose }) {
  const [paintings, setPaintings] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [activeFilter, setActiveFilter] = useState('All');
  const [preview,      setPreview]      = useState(null); 
  const [hoveredId,    setHoveredId]    = useState(null);

  useEffect(() => {
    if (isOpen) {
      axios.get(API_BASE).then(res => {
        const data = Array.isArray(res.data) ? res.data : [];
        const formatted = data.map(p => ({
          id: p.id,
          file: (p.imageUrl?.startsWith('/samples') || p.imageUrl?.startsWith('/uploads')) ? p.imageUrl : (p.imageUrl?.startsWith('/') ? `${API_URL}${p.imageUrl}` : (p.imageUrl || '/samples/01_anime_sketch.png')),
          title: p.title || 'Untitled',
          medium: p.artist || 'Artistic Ankit',
          category: p.category || 'Art',
          size: p.size || '',
          year: p.year || new Date().getFullYear().toString(),
          desc: p.description || 'An original artwork by Artistic Ankit.',
        }));
        setPaintings(formatted);
        setCategories(['All', ...new Set(formatted.map(f => f.category))]);
      }).catch(err => console.error("Failed to load portfolio", err));
    }
  }, [isOpen]);

  const filtered = activeFilter === 'All'
    ? paintings
    : paintings.filter((a) => a.category === activeFilter);

  /* ── Body scroll lock ── */
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  /* ── ESC key ── */
  useEffect(() => {
    const fn = (e) => {
      if (e.key === 'Escape') {
        if (preview) { setPreview(null); return; }
        onClose();
      }
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [onClose, preview]);

  /* ── Reset filter on close ── */
  useEffect(() => {
    if (!isOpen) setTimeout(() => { setActiveFilter('All'); setPreview(null); }, 350);
  }, [isOpen]);

  /* ── Navigate preview with arrow keys ── */
  const navigatePreview = useCallback((dir) => {
    if (!preview) return;
    const idx  = filtered.findIndex((a) => a.id === preview.id);
    const next = filtered[(idx + dir + filtered.length) % filtered.length];
    setPreview(next);
  }, [preview, filtered]);

  useEffect(() => {
    const fn = (e) => {
      if (!preview) return;
      if (e.key === 'ArrowRight') navigatePreview(1);
      if (e.key === 'ArrowLeft')  navigatePreview(-1);
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [navigatePreview, preview]);

  if (!isOpen) return null;

  return (
    <>
      {/* ── Fullscreen Exhibition ── */}
      <div
        className="portfolio-exhibition custom-scroll"
        style={{
          position: 'fixed', inset: 0, zIndex: 300,
          background: 'var(--snow)',
          overflowY: 'auto',
          color: 'var(--slate-900)',
          animation: 'galleryFadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Abstract background glows */}
        <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)', filter: 'blur(60px)', zIndex: 0, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '50%', height: '50%', background: 'radial-gradient(circle, rgba(236,72,153,0.08) 0%, transparent 70%)', filter: 'blur(80px)', zIndex: 0, pointerEvents: 'none' }} />

        {/* ── Sticky Header ── */}
        <div style={{
          position: 'sticky', top: 0, zIndex: 20,
          background: 'var(--white)',
          backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--slate-100)',
          padding: '20px 5vw',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          boxShadow: 'var(--shadow-sm)'
        }}>
           <div style={{ zIndex: 1 }}>
             <h2 className="font-sora" style={{ fontSize: '1.7rem', fontWeight: 400, letterSpacing: '0.02em', margin: 0, color: 'var(--slate-900)' }}>
               Exhibition <span style={{ fontWeight: 800, background: 'var(--gradient-blue)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Archive</span>
             </h2>
             <div className="font-mono" style={{ fontSize: '0.68rem', color: 'var(--slate-500)', marginTop: 4, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600 }}>
               A visual journey by Artistic Ankit
             </div>
           </div>
           
           <button onClick={onClose} style={{
             width: 44, height: 44, borderRadius: '50%', background: 'var(--slate-50)',
             border: '1px solid var(--slate-200)', color: 'var(--slate-700)', fontSize: '1.2rem',
             cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
             display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1
           }}
           onMouseEnter={e => { e.currentTarget.style.background = 'var(--slate-900)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'rotate(90deg) scale(1.05)'; }}
           onMouseLeave={e => { e.currentTarget.style.background = 'var(--slate-50)'; e.currentTarget.style.color = 'var(--slate-700)'; e.currentTarget.style.transform = 'rotate(0deg) scale(1)'; }}
           >✕</button>
        </div>

        {/* ── Body content ── */}
        <div style={{ maxWidth: 1600, margin: '0 auto', padding: '40px 5vw 100px', position: 'relative', zIndex: 1 }}>
          
          {/* ── Filters ── */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 40, justifyContent: 'center' }}>
            {categories.map(cat => {
              const isActive = activeFilter === cat;
              const activeBg = cat === 'All' ? 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)' : (CATEGORY_COLORS[cat] || '#8b5cf6');
              return (
                <button key={cat} onClick={() => setActiveFilter(cat)} style={{
                  padding: '9px 22px', borderRadius: 999,
                  background: isActive ? activeBg : 'var(--white)',
                  color: isActive ? '#ffffff' : 'var(--slate-700)',
                  border: `1.5px solid ${isActive ? 'transparent' : 'var(--slate-200)'}`,
                  fontSize: '0.75rem', fontWeight: isActive ? 700 : 600, letterSpacing: '0.06em',
                  fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase',
                  cursor: 'pointer', transition: 'all 0.25s ease',
                  boxShadow: isActive ? `0 4px 16px rgba(139,92,246,0.35)` : 'var(--shadow-sm)'
                }}
                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.color = 'var(--blue-600)'; e.currentTarget.style.borderColor = 'var(--blue-600)'; e.currentTarget.style.background = 'rgba(139,92,246,0.08)'; } }}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.color = 'var(--slate-700)'; e.currentTarget.style.borderColor = 'var(--slate-200)'; e.currentTarget.style.background = 'var(--white)'; } }}
                >{cat}</button>
              )
            })}
          </div>

          {/* ── Grid ── */}
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '100px 0', color: 'var(--slate-400)', fontSize: '1.1rem', fontFamily: 'Sora, sans-serif' }}>
              No artworks found in this category. 🎨
            </div>
          ) : (
            <div style={{ columns: 'auto 3', columnGap: 24 }}>
              {filtered.map(art => {
                const isHovered = hoveredId === art.id;
                const anyHovered = hoveredId !== null;
                const color = CATEGORY_COLORS[art.category] || '#8b5cf6';
                
                return (
                  <div
                    key={art.id}
                    onClick={() => setPreview(art)}
                    onMouseEnter={() => setHoveredId(art.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    style={{
                      breakInside: 'avoid',
                      marginBottom: 24,
                      position: 'relative',
                      cursor: 'pointer',
                      borderRadius: 16,
                      overflow: 'hidden',
                      background: 'var(--white)',
                      border: '1px solid var(--slate-100)',
                      transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                      transform: isHovered ? 'scale(1.02) translateY(-6px)' : 'scale(1) translateY(0)',
                      boxShadow: isHovered ? `0 20px 48px rgba(139,92,246,0.2), 0 0 30px ${color}20` : '0 6px 20px rgba(15,23,42,0.06)',
                      opacity: anyHovered && !isHovered ? 0.4 : 1, // Dim others
                      filter: anyHovered && !isHovered ? 'grayscale(70%) blur(1px)' : 'grayscale(0%) blur(0)',
                    }}
                  >
                    {/* Image */}
                    <div style={{ overflow: 'hidden', position: 'relative' }}>
                      <Image
                        src={art.file} alt={art.title} width={400} height={400}
                        style={{
                          width: '100%', height: 'auto', display: 'block',
                          transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                          transform: isHovered ? 'scale(1.06)' : 'scale(1)'
                        }}
                        unoptimized
                      />
                      {/* Gradient overlay on hover */}
                      <div style={{
                        position: 'absolute', inset: 0,
                        background: `linear-gradient(to top, rgba(15,23,42,0.85) 0%, transparent 60%)`,
                        opacity: isHovered ? 1 : 0,
                        transition: 'opacity 0.4s ease',
                        pointerEvents: 'none'
                      }} />
                    </div>

                    {/* Meta info (fades in on hover) */}
                    <div style={{
                      position: 'absolute', bottom: 0, left: 0, right: 0,
                      padding: 20, zIndex: 2,
                      transform: isHovered ? 'translateY(0)' : 'translateY(12px)',
                      opacity: isHovered ? 1 : 0,
                      transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                      pointerEvents: 'none'
                    }}>
                      <div style={{
                        display: 'inline-block', padding: '4px 10px', borderRadius: 4,
                        background: color, color: '#ffffff',
                        fontFamily: 'JetBrains Mono, monospace', fontSize: '0.6rem', fontWeight: 800,
                        letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                      }}>{art.category}</div>
                      
                      <h3 className="font-sora" style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 6px', color: '#ffffff', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                        {art.title}
                      </h3>
                      
                      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: 'rgba(255,255,255,0.8)', letterSpacing: '0.05em' }}>
                        {art.medium} · {art.year}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Fullscreen Lightbox Overlay (Preview) ── */}
      {preview && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 400,
            background: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(20px)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            animation: 'fadeIn 0.3s ease',
          }}
        >
          {/* Close */}
          <button onClick={() => setPreview(null)} style={{
            position: 'absolute', top: 24, right: 30, background: 'transparent', border: 'none',
            color: 'rgba(255,255,255,0.6)', fontSize: 28, cursor: 'pointer', transition: 'color 0.2s', zIndex: 401
          }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}>✕</button>

          {/* Prev arrow */}
          <button onClick={() => navigatePreview(-1)} style={{
            position: 'absolute', left: 30, top: '50%', transform: 'translateY(-50%)',
            background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 50,
            cursor: 'pointer', transition: 'all 0.2s', zIndex: 401, padding: 20
          }} onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'translateY(-50%) translateX(-5px)'; }} onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; e.currentTarget.style.transform = 'translateY(-50%) translateX(0)'; }}>‹</button>

          {/* Next arrow */}
          <button onClick={() => navigatePreview(1)} style={{
            position: 'absolute', right: 30, top: '50%', transform: 'translateY(-50%)',
            background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 50,
            cursor: 'pointer', transition: 'all 0.2s', zIndex: 401, padding: 20
          }} onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'translateY(-50%) translateX(5px)'; }} onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; e.currentTarget.style.transform = 'translateY(-50%) translateX(0)'; }}>›</button>

          {/* Image */}
          <Image src={preview.file} alt={preview.title} width={800} height={800} style={{
            maxWidth: '85vw', maxHeight: '80vh', width: 'auto', height: 'auto', objectFit: 'contain',
            boxShadow: '0 20px 80px rgba(0,0,0,0.8)',
            animation: 'modalPop 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          }} unoptimized />

          {/* Info bar */}
          <div style={{ marginTop: 30, textAlign: 'center', animation: 'fadeSlideUp 0.4s ease both', animationDelay: '0.1s' }}>
            <h3 className="font-sora" style={{ fontSize: '1.5rem', fontWeight: 600, color: '#fff', margin: '0 0 10px', letterSpacing: '0.02em' }}>{preview.title}</h3>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.05em' }}>
              {preview.category} · {preview.medium} · {preview.size}
            </div>
            <p style={{ marginTop: 14, fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)', maxWidth: 500, lineHeight: 1.6 }}>{preview.desc}</p>
          </div>
        </div>
      )}

      {/* ── Keyframes & Styles ── */}
      <style>{`
        @keyframes fadeIn  { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes galleryFadeIn {
          0% { opacity: 0; transform: scale(1.03) translateY(20px); filter: blur(10px); }
          100% { opacity: 1; transform: scale(1) translateY(0); filter: blur(0); }
        }
        @keyframes modalPop {
          0% { opacity: 0; transform: scale(0.92) translateY(20px); filter: blur(5px); }
          100% { opacity: 1; transform: scale(1) translateY(0); filter: blur(0); }
        }
        
        /* Custom scrollbar for exhibition */
        .custom-scroll::-webkit-scrollbar { width: 8px; }
        .custom-scroll::-webkit-scrollbar-track { background: var(--snow); }
        .custom-scroll::-webkit-scrollbar-thumb { background: var(--slate-300); border-radius: 4px; }
        .custom-scroll::-webkit-scrollbar-thumb:hover { background: var(--blue-600); }
      `}</style>
    </>
  );
}

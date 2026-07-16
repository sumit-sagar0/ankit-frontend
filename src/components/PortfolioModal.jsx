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
          file: p.imageUrl?.startsWith('/') ? `${API_URL}${p.imageUrl}` : (p.imageUrl || '/samples/01_anime_sketch.png'),
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
      {/* ── Cinematic Fullscreen Exhibition ── */}
      <div
        className="portfolio-exhibition custom-scroll"
        style={{
          position: 'fixed', inset: 0, zIndex: 300,
          background: '#050a14',
          overflowY: 'auto',
          color: '#fff',
          animation: 'galleryFadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Abstract background glows */}
        <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%)', filter: 'blur(60px)', zIndex: 0, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '50%', height: '50%', background: 'radial-gradient(circle, rgba(244,63,94,0.1) 0%, transparent 70%)', filter: 'blur(80px)', zIndex: 0, pointerEvents: 'none' }} />

        {/* ── Sticky Header ── */}
        <div style={{
          position: 'sticky', top: 0, zIndex: 20,
          background: 'rgba(5, 10, 20, 0.7)',
          backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          padding: '24px 5vw',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
           <div style={{ zIndex: 1 }}>
             <h2 className="font-sora" style={{ fontSize: '1.8rem', fontWeight: 300, letterSpacing: '0.05em', margin: 0 }}>
               Exhibition <span style={{ fontWeight: 800, background: 'linear-gradient(90deg, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Archive</span>
             </h2>
             <div className="font-mono" style={{ fontSize: '0.7rem', color: '#64748b', marginTop: 6, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
               A visual journey by Artistic Ankit
             </div>
           </div>
           
           <button onClick={onClose} style={{
             width: 54, height: 54, borderRadius: '50%', background: 'rgba(255,255,255,0.03)',
             border: '1px solid rgba(255,255,255,0.08)', color: '#fff', fontSize: '1.4rem',
             cursor: 'pointer', transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
             display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1
           }}
           onMouseEnter={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#000'; e.currentTarget.style.transform = 'rotate(90deg) scale(1.1)'; }}
           onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'rotate(0deg) scale(1)'; }}
           >✕</button>
        </div>

        {/* ── Body content ── */}
        <div style={{ maxWidth: 1600, margin: '0 auto', padding: '50px 5vw 100px', position: 'relative', zIndex: 1 }}>
          
          {/* ── Filters ── */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginBottom: 50, justifyContent: 'center' }}>
            {categories.map(cat => {
              const isActive = activeFilter === cat;
              const color = cat === 'All' ? '#fff' : (CATEGORY_COLORS[cat] || '#fff');
              return (
                <button key={cat} onClick={() => setActiveFilter(cat)} style={{
                  padding: '10px 24px', borderRadius: 999,
                  background: isActive ? color : 'rgba(255,255,255,0.02)',
                  color: isActive ? '#050a14' : 'rgba(255,255,255,0.4)',
                  border: `1px solid ${isActive ? color : 'rgba(255,255,255,0.08)'}`,
                  fontSize: '0.75rem', fontWeight: isActive ? 700 : 500, letterSpacing: '0.08em',
                  fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase',
                  cursor: 'pointer', transition: 'all 0.3s ease',
                  boxShadow: isActive ? `0 0 24px ${color}50` : 'none'
                }}
                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; } }}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; } }}
                >{cat}</button>
              )
            })}
          </div>

          {/* ── Grid ── */}
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '100px 0', color: '#475569', fontSize: '1.2rem', fontFamily: 'Sora, sans-serif' }}>
              No artworks found in this category. 🎨
            </div>
          ) : (
            <div style={{ columns: 'auto 3', columnGap: 30 }}>
              {filtered.map(art => {
                const isHovered = hoveredId === art.id;
                const anyHovered = hoveredId !== null;
                const color = CATEGORY_COLORS[art.category] || '#3b82f6';
                
                return (
                  <div
                    key={art.id}
                    onClick={() => setPreview(art)}
                    onMouseEnter={() => setHoveredId(art.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    style={{
                      breakInside: 'avoid',
                      marginBottom: 30,
                      position: 'relative',
                      cursor: 'pointer',
                      borderRadius: 16,
                      overflow: 'hidden',
                      background: '#0a1122',
                      border: '1px solid rgba(255,255,255,0.04)',
                      transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                      transform: isHovered ? 'scale(1.02) translateY(-8px)' : 'scale(1) translateY(0)',
                      boxShadow: isHovered ? `0 30px 60px rgba(0,0,0,0.6), 0 0 40px ${color}15` : '0 10px 30px rgba(0,0,0,0.4)',
                      opacity: anyHovered && !isHovered ? 0.3 : 1, // Dim others
                      filter: anyHovered && !isHovered ? 'grayscale(80%) blur(2px)' : 'grayscale(0%) blur(0)',
                    }}
                  >
                    {/* Image */}
                    <div style={{ overflow: 'hidden', position: 'relative' }}>
                      <Image
                        src={art.file} alt={art.title} width={400} height={400}
                        style={{
                          width: '100%', height: 'auto', display: 'block',
                          transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
                          transform: isHovered ? 'scale(1.08)' : 'scale(1)'
                        }}
                        unoptimized
                      />
                      {/* Gradient overlay on hover */}
                      <div style={{
                        position: 'absolute', inset: 0,
                        background: `linear-gradient(to top, #050a14 0%, transparent 60%)`,
                        opacity: isHovered ? 1 : 0,
                        transition: 'opacity 0.5s ease',
                        pointerEvents: 'none'
                      }} />
                    </div>

                    {/* Meta info (fades in on hover) */}
                    <div style={{
                      position: 'absolute', bottom: 0, left: 0, right: 0,
                      padding: 24, zIndex: 2,
                      transform: isHovered ? 'translateY(0)' : 'translateY(15px)',
                      opacity: isHovered ? 1 : 0,
                      transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                      pointerEvents: 'none'
                    }}>
                      <div style={{
                        display: 'inline-block', padding: '4px 10px', borderRadius: 4,
                        background: color, color: '#000',
                        fontFamily: 'JetBrains Mono, monospace', fontSize: '0.6rem', fontWeight: 800,
                        letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12
                      }}>{art.category}</div>
                      
                      <h3 className="font-sora" style={{ fontSize: '1.4rem', fontWeight: 700, margin: '0 0 8px', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                        {art.title}
                      </h3>
                      
                      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.05em' }}>
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
            background: 'rgba(0, 0, 0, 0.95)', backdropFilter: 'blur(20px)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            animation: 'fadeIn 0.3s ease',
          }}
        >
          {/* Close */}
          <button onClick={() => setPreview(null)} style={{
            position: 'absolute', top: 24, right: 30, background: 'transparent', border: 'none',
            color: 'rgba(255,255,255,0.5)', fontSize: 28, cursor: 'pointer', transition: 'color 0.2s', zIndex: 401
          }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}>✕</button>

          {/* Prev arrow */}
          <button onClick={() => navigatePreview(-1)} style={{
            position: 'absolute', left: 30, top: '50%', transform: 'translateY(-50%)',
            background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.3)', fontSize: 50,
            cursor: 'pointer', transition: 'all 0.2s', zIndex: 401, padding: 20
          }} onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'translateY(-50%) translateX(-5px)'; }} onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.3)'; e.currentTarget.style.transform = 'translateY(-50%) translateX(0)'; }}>‹</button>

          {/* Next arrow */}
          <button onClick={() => navigatePreview(1)} style={{
            position: 'absolute', right: 30, top: '50%', transform: 'translateY(-50%)',
            background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.3)', fontSize: 50,
            cursor: 'pointer', transition: 'all 0.2s', zIndex: 401, padding: 20
          }} onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'translateY(-50%) translateX(5px)'; }} onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.3)'; e.currentTarget.style.transform = 'translateY(-50%) translateX(0)'; }}>›</button>

          {/* Image */}
          <Image src={preview.file} alt={preview.title} width={800} height={800} style={{
            maxWidth: '85vw', maxHeight: '80vh', width: 'auto', height: 'auto', objectFit: 'contain',
            boxShadow: '0 20px 80px rgba(0,0,0,0.8)',
            animation: 'modalPop 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          }} unoptimized />

          {/* Info bar */}
          <div style={{ marginTop: 30, textAlign: 'center', animation: 'fadeSlideUp 0.4s ease both', animationDelay: '0.1s' }}>
            <h3 className="font-sora" style={{ fontSize: '1.5rem', fontWeight: 600, color: '#fff', margin: '0 0 10px', letterSpacing: '0.02em' }}>{preview.title}</h3>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em' }}>
              {preview.category} · {preview.medium} · {preview.size}
            </div>
            <p style={{ marginTop: 14, fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', maxWidth: 500, lineHeight: 1.6 }}>{preview.desc}</p>
          </div>
        </div>
      )}

      {/* ── Keyframes ── */}
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
        .custom-scroll::-webkit-scrollbar-track { background: #050a14; }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
        .custom-scroll::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `}</style>
    </>
  );
}

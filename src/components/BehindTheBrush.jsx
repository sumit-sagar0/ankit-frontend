import React, { useState } from 'react';

/* ═══════════════════════════════════════════════════════════════════════════
   BehindTheBrush & Collector Reviews — Video Showcase + Testimonials + Studio Guarantees
   ═══════════════════════════════════════════════════════════════════════════ */

const VIDEOS = [
  { id: '1', ytId: 'WhcMAzQFG8E', type: 'short', title: 'Gojo Satoru Speed Art', views: '250K+ views', category: 'ANIME SKETCH' },
  { id: '2', ytId: 'yQ2mPgID1rQ', type: 'short', title: 'Demon Slayer Canvas Process', views: '180K+ views', category: 'ACRYLIC' },
  { id: '3', ytId: 'ri-ROtMBRdY', type: 'short', title: 'Studio Vlogs & Painting Setup', views: '120K+ views', category: 'BEHIND THE SCENES' },
];

const REVIEWS = [
  {
    id: 1,
    name: 'Rohan Sharma',
    city: 'Mumbai, MH',
    rating: 5,
    painting: 'Gojo Satoru Acrylic Canvas',
    comment: 'The painting quality in real life is mindblowing! The brush textures and colors pop so beautifully on my studio wall. Safe wooden framing delivery too!',
    avatar: '👨‍🎨',
    date: '2 weeks ago',
  },
  {
    id: 2,
    name: 'Priya Nair',
    city: 'Bengaluru, KA',
    rating: 5,
    painting: 'Custom Demon Slayer Canvas',
    comment: 'Ordered a custom painting for my brother’s birthday. Ankit executed the exact vision with incredible detail. Best handcrafted artwork purchase!',
    avatar: '🎨',
    date: '1 month ago',
  },
  {
    id: 3,
    name: 'Aman Verma',
    city: 'Delhi, NCR',
    rating: 5,
    painting: 'Luffy Gear 5 Painting',
    comment: 'Extremely authentic canvas work! Came with a signed certificate of authenticity and packaging was 100% damage-proof. Highly recommended!',
    avatar: '✨',
    date: '3 weeks ago',
  },
];

const GUARANTEES = [
  { icon: '🖌️', title: '100% Hand-Painted', desc: 'Real acrylic brushstrokes on premium cotton canvas.' },
  { icon: '📦', title: 'Safe Insured Shipping', desc: 'Custom protective wooden crate packaging.' },
  { icon: '📜', title: 'Authenticity Certificate', desc: 'Signed certificate included with every physical artwork.' },
  { icon: '🎨', title: 'Custom Commissions', desc: 'Direct 1-on-1 customization based on your favorite anime.' },
];

export default function BehindTheBrush() {
  const [activeVideo, setActiveVideo] = useState(VIDEOS[0]);

  return (
    <section style={{ 
      padding: '90px 40px', 
      background: 'linear-gradient(180deg, var(--snow) 0%, var(--white) 100%)',
      borderTop: '1px solid var(--slate-100)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ maxWidth: 1380, margin: '0 auto' }}>
        
        {/* ════════════════ SECTION 1: STUDIO GUARANTEES BAR ════════════════ */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 20,
          marginBottom: 90,
          padding: '24px 30px',
          borderRadius: 24,
          background: 'var(--white)',
          border: '1px solid var(--slate-200)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          {GUARANTEES.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{
                width: 48, height: 48, borderRadius: 14,
                background: 'rgba(139,92,246,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.4rem', flexShrink: 0
              }}>
                {item.icon}
              </div>
              <div>
                <div style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: '0.9rem', color: 'var(--slate-900)' }}>
                  {item.title}
                </div>
                <div style={{ fontSize: '0.76rem', color: 'var(--slate-500)', marginTop: 2, lineHeight: 1.3 }}>
                  {item.desc}
                </div>
              </div>
            </div>
          ))}
        </div>


        {/* ════════════════ SECTION 2: YOUTUBE STUDIO VLOGS & SHORTS ════════════════ */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 40, flexWrap: 'wrap', gap: 20 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#ef4444', fontWeight: 800, fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 10 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
              </svg>
              YouTube Process Vlogs · 100K+ Art Lovers
            </div>
            <h2 className="font-sora" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, color: 'var(--slate-900)', letterSpacing: '-0.02em', margin: 0 }}>
              Behind The Brush
            </h2>
            <p style={{ color: 'var(--slate-500)', fontSize: '0.92rem', marginTop: 8, margin: '8px 0 0' }}>
              Watch real painting timelapses, sketch breakdowns, and studio creation process.
            </p>
          </div>
          
          <a 
            href="https://youtube.com/@artisticankit0" 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              padding: '12px 28px', borderRadius: 999,
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', 
              color: '#ffffff',
              textDecoration: 'none', fontSize: '0.88rem', fontWeight: 700,
              boxShadow: '0 4px 16px rgba(239,68,68,0.3)',
              transition: 'all 0.25s ease'
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(239,68,68,0.45)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(239,68,68,0.3)'; }}
          >
            ▶ Subscribe on YouTube
          </a>
        </div>

        {/* Video Cards Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: 28,
          marginBottom: 100
        }}>
          {VIDEOS.map(vid => (
            <div key={vid.id} style={{
              borderRadius: 20, overflow: 'hidden', 
              background: 'var(--white)',
              border: '1px solid var(--slate-200)',
              boxShadow: 'var(--shadow-sm)',
              position: 'relative',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
            >
              <div style={{ position: 'relative', paddingTop: '160%' }}>
                <iframe 
                  src={`https://www.youtube.com/embed/${vid.ytId}?autoplay=0&controls=1&rel=0&modestbranding=1`} 
                  title={vid.title}
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                  style={{
                    position: 'absolute', top: 0, left: 0,
                    width: '100%', height: '100%',
                    border: 'none'
                  }}
                />
              </div>
              <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--white)' }}>
                <div>
                  <div style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: '0.92rem', color: 'var(--slate-900)' }}>
                    {vid.title}
                  </div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.68rem', color: 'var(--slate-500)', marginTop: 4 }}>
                    {vid.views}
                  </div>
                </div>
                <span style={{ fontSize: '0.65rem', padding: '4px 10px', borderRadius: 999, background: 'rgba(139,92,246,0.12)', color: 'var(--blue-600)', fontWeight: 700, fontFamily: 'JetBrains Mono, monospace' }}>
                  {vid.category}
                </span>
              </div>
            </div>
          ))}
        </div>


        {/* ════════════════ SECTION 3: COLLECTOR REVIEWS & SOCIAL PROOF ════════════════ */}
        <div>
          <div style={{ textAlign: 'center', marginBottom: 50 }}>
            <div style={{ display: 'inline-block', padding: '6px 16px', borderRadius: 999, background: 'rgba(16,185,129,0.12)', color: '#10b981', fontWeight: 700, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>
              Verified Buyers & Collectors
            </div>
            <h2 className="font-sora" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, color: 'var(--slate-900)', letterSpacing: '-0.02em', margin: '0 0 10px' }}>
              What Collectors Say
            </h2>
            <p style={{ color: 'var(--slate-500)', fontSize: '0.95rem', maxWidth: 600, margin: '0 auto' }}>
              Real feedback from anime enthusiasts & art collectors who brought physical paintings to their homes.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 28
          }}>
            {REVIEWS.map(rev => (
              <div key={rev.id} style={{
                padding: '28px 24px',
                borderRadius: 20,
                background: 'var(--white)',
                border: '1px solid var(--slate-200)',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                transition: 'transform 0.3s ease, border-color 0.3s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'rgba(139,92,246,0.4)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--slate-200)'; }}
              >
                <div>
                  {/* Rating Stars */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#f59e0b', fontSize: '1rem', marginBottom: 14 }}>
                    {'★'.repeat(rev.rating)}
                    <span style={{ fontSize: '0.72rem', color: 'var(--slate-400)', marginLeft: 6, fontFamily: 'JetBrains Mono, monospace' }}>
                      5.0 Verified Order
                    </span>
                  </div>

                  <p style={{ fontSize: '0.92rem', color: 'var(--slate-700)', lineHeight: 1.6, margin: '0 0 16px', fontStyle: 'italic' }}>
                    "{rev.comment}"
                  </p>
                </div>

                <div style={{ paddingTop: 16, borderTop: '1px solid var(--slate-100)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(139,92,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                      {rev.avatar}
                    </div>
                    <div>
                      <div style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: '0.88rem', color: 'var(--slate-900)' }}>
                        {rev.name}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--slate-500)' }}>
                        {rev.city} · <span style={{ color: 'var(--blue-600)', fontWeight: 600 }}>{rev.painting}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}


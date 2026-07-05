import React from 'react';

/* ═══════════════════════════════════════════════════════════════════════════
   BehindTheBrush — YouTube video integration
   Shows recent shorts/videos of the artist at work.
   ═══════════════════════════════════════════════════════════════════════════ */

const VIDEOS = [
  { id: '1', ytId: 'WhcMAzQFG8E', type: 'short', title: 'Anime Sketch Speed Art' },
  { id: '2', ytId: 'yQ2mPgID1rQ', type: 'short', title: 'Character Drawing' },
  { id: '3', ytId: 'ri-ROtMBRdY', type: 'short', title: 'Behind the Scenes' },
];

export default function BehindTheBrush() {
  return (
    <section style={{ 
      padding: '80px 40px', 
      background: 'linear-gradient(to bottom, transparent, rgba(37,99,235,0.03))',
      borderTop: '1px solid rgba(15,23,42,0.05)',
      marginTop: 40
    }}>
      <div style={{ maxWidth: 1380, margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 40 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#e52d27', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
              </svg>
              Studio Vlogs & Shorts
            </div>
            <h2 className="font-sora" style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--slate-900)', letterSpacing: '-0.02em', margin: 0 }}>
              Behind The Brush
            </h2>
          </div>
          
          <a href="https://youtube.com/@artisticankit0" target="_blank" rel="noopener noreferrer" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '10px 24px', borderRadius: 999,
            background: 'var(--slate-900)', color: '#fff',
            textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600,
            transition: 'transform 0.2s, background 0.2s'
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            Subscribe to Channel 
            <span style={{ fontSize: '1.2rem' }}>→</span>
          </a>
        </div>

        {/* Video Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: 24 
        }}>
          {VIDEOS.map(vid => (
            <div key={vid.id} style={{
              borderRadius: 20, overflow: 'hidden', 
              background: '#000',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              position: 'relative',
              paddingTop: vid.type === 'short' ? '177.77%' : '56.25%', // 16:9 or 9:16 aspect ratio
            }}>
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
          ))}
        </div>
        
      </div>
    </section>
  );
}

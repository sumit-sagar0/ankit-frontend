import React from 'react';
import Image from 'next/image';

/* ═══════════════════════════════════════════════════════════════════════════
   Testimonials — Client Reviews Section
   ═══════════════════════════════════════════════════════════════════════════ */

const REVIEWS = [
  {
    id: 1,
    name: "Rohan Sharma",
    type: "Portrait Commission",
    text: "Ankit is incredibly talented! The portrait he made for my parents' anniversary was so realistic it brought tears to their eyes. 10/10 recommend!",
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Rohan&backgroundColor=e2e8f0"
  },
  {
    id: 2,
    name: "Aisha Khan",
    type: "Anime Glass Painting",
    text: "The details on the Gojo glass painting are INSANE. The colors pop perfectly when light hits it. Packaging was also super safe.",
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Aisha&backgroundColor=ffedd5"
  },
  {
    id: 3,
    name: "Vikram Reddy",
    type: "Original Canvas",
    text: "I bought one of his original landscapes. The texture and depth of the acrylics are mesmerizing. It's now the centerpiece of my living room.",
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Vikram&backgroundColor=dcfce7"
  }
];

export default function Testimonials() {
  return (
    <section style={{ 
      padding: '80px 40px', 
      background: 'linear-gradient(180deg, var(--snow) 0%, rgba(37,99,235,0.03) 100%)',
      borderTop: '1px solid rgba(15,23,42,0.05)',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <div style={{ 
            display: 'inline-flex', alignItems: 'center', gap: 8, 
            color: '#2563eb', fontWeight: 700, fontSize: '0.85rem', 
            textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            Client Stories
          </div>
          <h2 className="font-sora" style={{ 
            fontSize: '2.5rem', fontWeight: 800, color: 'var(--slate-900)', 
            letterSpacing: '-0.02em', margin: 0 
          }}>
            Happy Collectors
          </h2>
          <p style={{ color: 'var(--slate-500)', fontSize: '1.1rem', marginTop: 12, maxWidth: 500, margin: '12px auto 0' }}>
            Don&apos;t just take my word for it. Here&apos;s what people say about their custom artworks.
          </p>
        </div>

        {/* Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: 24 
        }}>
          {REVIEWS.map((rev, i) => (
            <div key={rev.id} style={{
              background: '#fff',
              borderRadius: 24,
              padding: 32,
              boxShadow: '0 10px 40px rgba(0,0,0,0.04)',
              border: '1px solid rgba(15,23,42,0.03)',
              position: 'relative',
              animation: `fadeSlideUp 0.6s ease ${i * 0.15}s both`
            }}>
              {/* Quote Mark Watermark */}
              <div style={{
                position: 'absolute', top: 20, right: 30,
                fontSize: '4rem', color: 'rgba(37,99,235,0.05)',
                fontFamily: 'serif', lineHeight: 1
              }}>
                &quot;
              </div>
              
              {/* Stars */}
              <div style={{ display: 'flex', gap: 4, color: '#f59e0b', marginBottom: 20 }}>
                {[...Array(rev.rating)].map((_, idx) => (
                  <svg key={idx} width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                ))}
              </div>

              {/* Text */}
              <p style={{ 
                color: 'var(--slate-700)', fontSize: '1.05rem', 
                lineHeight: 1.6, marginBottom: 32, fontStyle: 'italic' 
              }}>
                &quot;{rev.text}&quot;
              </p>

              {/* Author */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <Image src={rev.avatar} alt={rev.name} width={48} height={48} style={{
                  borderRadius: '50%',
                  border: '2px solid rgba(37,99,235,0.1)'
                }} unoptimized />
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--slate-900)' }}>{rev.name}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--slate-400)' }}>{rev.type}</div>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

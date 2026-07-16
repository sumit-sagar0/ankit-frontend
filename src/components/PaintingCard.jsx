import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { API_URL } from '../config/env';
import { getCategoryMeta } from '../constants/categoryMeta';
import { useAppData } from '../hooks/useAppData';

/* ═══════════════════════════════════════════════════════════════════════════
   PaintingCard — Individual artwork capsule
   Props:
     painting  {object}  — a single painting record from the API
     index     {number}  — used to stagger the card entrance animation
   ═══════════════════════════════════════════════════════════════════════════ */
export default function PaintingCard({ painting, index, onDelete, onEdit, isAdmin }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isIgModalOpen, setIsIgModalOpen] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;
    const tiltX = (y - 0.5) * -15; 
    const tiltY = (x - 0.5) * 15;
    setTilt({ rx: tiltX, ry: tiltY });
  };

  const handleMouseLeave = () => {
    setTilt({ rx: 0, ry: 0 });
  };
  
  const { appData, toggleLike } = useAppData();
  const [likes, setLikes] = useState(painting.likesCount || 0);
  
  const isLiked = appData.userLikes.includes(painting.id);

  const catMeta     = getCategoryMeta(painting.category);
  const isAvailable = painting.status?.toUpperCase() !== 'SOLD';
  // Serve both samples and uploads from frontend.
  const imageUrl = (painting.imageUrl?.startsWith('/samples') || painting.imageUrl?.startsWith('/uploads'))
                     ? painting.imageUrl 
                     : (painting.imageUrl?.startsWith('/') ? `${API_URL}${painting.imageUrl}` : painting.imageUrl);

  const getYouTubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };
  const videoId = getYouTubeId(painting.youtubeUrl);

  const handleLike = async () => {
    const wasLiked = isLiked;
    
    toggleLike(painting.id);
    setLikes(l => wasLiked ? Math.max(0, l - 1) : l + 1);

    if (!wasLiked) {
      window.dispatchEvent(new CustomEvent('showGlobalToast', { detail: { message: 'You loved this artwork! ❤️' } }));
    }

    try {
      if (!wasLiked) {
        await axios.put(`${API_URL}/api/paintings/${painting.id}/like`);
      }
    } catch (err) {
      console.warn("Could not sync like with backend", err);
    }
  };

  const handleShare = (e) => {
    e.stopPropagation();
    const url = `${window.location.origin}?painting=${painting.id}`;
    navigator.clipboard.writeText(url).then(() => {
      window.dispatchEvent(new CustomEvent('showGlobalToast', { detail: { message: 'Link Copied! 📤' } }));
    });
  };

  const handlePayment = async () => {
    const userStr = typeof window !== 'undefined' ? localStorage.getItem('aa_user_auth') : null;
    if (!userStr) {
      window.dispatchEvent(new Event('openUserAuth'));
      window.dispatchEvent(new CustomEvent('showGlobalToast', { detail: { message: 'Please sign in to continue.', type: 'error' } }));
      return;
    }
    const user = JSON.parse(userStr);

    if (!painting.price || painting.price <= 0) {
      setIsIgModalOpen(true);
      return;
    }

    try {
      const { data: order } = await axios.post(`${API_URL}/api/orders/create`, {
        amount: painting.price,
        paintingId: painting.id
      });

      const options = {
        key: "rzp_test_placeholder", // Typically loaded from env
        amount: order.amount,
        currency: order.currency,
        name: "Artistic Ankit",
        description: `Purchase ${painting.title}`,
        order_id: order.id,
        handler: async function (response) {
          try {
            await axios.post(`${API_URL}/api/orders/verify`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              paintingId: painting.id
            });
            window.dispatchEvent(new CustomEvent('showGlobalToast', { detail: { message: 'Payment Successful! 🎉' } }));
            // Optional: trigger refresh
          } catch (verifyError) {
            window.dispatchEvent(new CustomEvent('showGlobalToast', { detail: { message: 'Payment verification failed ❌' } }));
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: ""
        },
        theme: {
          color: "#0f172a"
        }
      };
      
      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error("Error starting payment", error);
      window.dispatchEvent(new CustomEvent('showGlobalToast', { detail: { message: 'Failed to initiate payment ❌' } }));
    }
  };

  return (
    <div
      style={{
        perspective: 1200,
        animation: `cardEntrance 0.5s ease ${index * 0.07}s both`,
        cursor: isFlipped ? 'default' : 'crosshair'
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <article
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transition: 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
          transformStyle: 'preserve-3d',
          transform: `rotateY(${isFlipped ? 180 : tilt.ry}deg) rotateX(${isFlipped ? 0 : tilt.rx}deg)`,
          minHeight: 460
        }}
      >
        {/* ════════════════ FRONT FACE ════════════════ */}
        <div 
          className="gallery-card"
          style={{
            position: 'absolute', inset: 0,
            backfaceVisibility: 'hidden',
            display: 'flex', flexDirection: 'column',
            margin: 0,
            height: '100%'
          }}
        >
          {/* ── Glare Effect (only visible on tilt) ── */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 10,
            background: `linear-gradient(105deg, transparent 20%, rgba(255,255,255,${Math.abs(tilt.rx) * 0.015}) 25%, transparent 30%)`,
            mixBlendMode: 'overlay'
          }} />

          {/* ── Category colour stripe (top) ── */}
          <div style={{ height: 4, background: `linear-gradient(90deg, ${catMeta.color}, ${catMeta.color}55, transparent)` }} />

          <div
            className="painting-image-wrapper"
            style={{
              aspectRatio: '1/1',
              background: `linear-gradient(135deg, ${catMeta.bg} 0%, rgba(37,99,235,0.04) 100%)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderBottom: '1px solid var(--slate-100)', position: 'relative', overflow: 'hidden',
            }}
          >
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={painting.title || 'Painting'}
                onClick={() => setIsFullscreen(true)}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                placeholder="empty" // Or "blur" if we have blurDataURL
                style={{
                  objectFit: 'cover', objectPosition: 'center',
                  display: 'block', transition: 'transform 0.4s ease', cursor: 'zoom-in',
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              />
            ) : (
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: `linear-gradient(135deg, ${catMeta.color}22, ${catMeta.color}44)`, border: `2px solid ${catMeta.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>🎨</div>
            )}

            {/* Status / Admin badges */}
            <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 8, zIndex: 5 }}>
              {isAdmin && (
                <>
                  <button onClick={(e) => { e.stopPropagation(); onEdit?.(painting); }} style={{ background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.3)', color: 'var(--blue-600)', width: 26, height: 26, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '0.8rem', backdropFilter: 'blur(4px)' }}>✏️</button>
                  <button onClick={(e) => { e.stopPropagation(); onDelete?.(painting.id); }} style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.3)', color: '#be123c', width: 26, height: 26, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '0.8rem', backdropFilter: 'blur(4px)' }}>🗑️</button>
                </>
              )}
              {isAvailable ? <span className="status-available">AVAILABLE</span> : <span className="status-sold">SOLD OUT</span>}
            </div>
          </div>

          <div style={{ padding: '18px 20px 22px', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: 12 }}>
              <span className="cat-badge font-mono" style={{ color: catMeta.color, backgroundColor: catMeta.bg, borderColor: catMeta.border }}>[{catMeta.label}]</span>
            </div>

            <h3 className="font-sora" style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--slate-900)', letterSpacing: '-0.01em', marginBottom: 6, lineHeight: 1.35 }}>
              {painting.title || 'Untitled Artwork'}
            </h3>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: '0.62rem', color: 'var(--blue-600)', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, letterSpacing: '0.08em' }}>BY</span>
                <span style={{ fontSize: '0.88rem', color: 'var(--slate-800)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>{painting.artist || 'Ankit Kumar'}</span>
              </div>
              <button onClick={handleLike} disabled={isLiked} style={{ background: 'transparent', border: 'none', cursor: isLiked ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8rem', color: isLiked ? '#ef4444' : 'var(--slate-400)', fontWeight: 600, transition: 'transform 0.2s', transform: isLiked ? 'scale(1.1)' : 'scale(1)' }}>
                {isLiked ? '❤️' : '🤍'} {likes > 0 ? likes : ''}
              </button>
            </div>

            {/* Footer Front: Flip for details */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 14, borderTop: '1px solid var(--slate-100)' }}>
              <button 
                onClick={() => setIsFlipped(true)}
                style={{
                  background: 'var(--slate-100)', color: 'var(--slate-700)', border: 'none',
                  padding: '6px 14px', borderRadius: 999, fontSize: '0.8rem', fontWeight: 700,
                  cursor: 'pointer', transition: 'background 0.2s, color 0.2s'
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--slate-200)'; e.currentTarget.style.color = 'var(--slate-900)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--slate-100)'; e.currentTarget.style.color = 'var(--slate-700)' }}
              >
                🔄 Flip to view Details
              </button>

              <div style={{ display: 'flex', gap: 6 }}>
                <button
                  onClick={handleShare}
                  style={{ background: 'rgba(37,99,235,0.1)', color: 'var(--blue-600)', padding: '4px 10px', borderRadius: 999, fontSize: '0.7rem', fontWeight: 700, border: 'none', cursor: 'pointer' }}
                >
                  🔗 Share
                </button>

                {painting.youtubeUrl && (
                  <button
                    onClick={() => videoId ? setIsVideoOpen(true) : window.open(painting.youtubeUrl, '_blank')}
                    style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', padding: '4px 10px', borderRadius: 999, fontSize: '0.7rem', fontWeight: 700, border: 'none', cursor: 'pointer' }}
                  >▶ YouTube</button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ════════════════ BACK FACE ════════════════ */}
        <div 
          className="gallery-card"
          style={{
            position: 'absolute', inset: 0,
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            display: 'flex', flexDirection: 'column',
            margin: 0, padding: 30
          }}
        >
          <div style={{ flex: 1 }}>
            <h3 className="font-sora" style={{ fontSize: '1.2rem', marginBottom: 20, color: 'var(--slate-900)' }}>{painting.title}</h3>
            
            <p style={{ color: 'var(--slate-500)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: 20 }}>
              {painting.description || "An exclusive original piece crafted with premium materials. Perfect for collectors who appreciate high-quality anime art."}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 30 }}>
              <div style={{ background: 'var(--slate-50)', padding: 12, borderRadius: 8 }}>
                <div style={{ fontSize: '0.65rem', color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Category</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, marginTop: 4, color: 'var(--slate-900)' }}>{catMeta.label}</div>
              </div>
              <div style={{ background: 'var(--slate-50)', padding: 12, borderRadius: 8 }}>
                <div style={{ fontSize: '0.65rem', color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, marginTop: 4, color: isAvailable ? '#4ade80' : '#f87171' }}>
                  {isAvailable ? 'Available' : 'Sold Out'}
                </div>
              </div>
            </div>

            {/* Price & Buy Button */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--slate-400)' }}>Investment</div>
                {(!painting.price || painting.price <= 0) ? (
                   <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#25D366' }}>WhatsApp for Price</div>
                ) : (
                   <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--slate-900)' }}>
                     ₹{Number(painting.price).toLocaleString('en-IN')}
                   </div>
                )}
              </div>
              
              {isAvailable && (
                <button 
                  onClick={handlePayment}
                  style={{
                    background: (!painting.price || painting.price <= 0) ? '#25D366' : 'var(--slate-900)',
                    color: 'white', border: 'none', padding: '10px 20px', borderRadius: 999, fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer',
                    boxShadow: (!painting.price || painting.price <= 0) ? '0 4px 15px rgba(37, 211, 102, 0.3)' : '0 4px 15px rgba(15, 23, 42, 0.3)'
                  }}
                >
                  {(!painting.price || painting.price <= 0) ? 'WhatsApp Inquiry' : 'Buy with Razorpay'}
                </button>
              )}
            </div>
          </div>

          <button 
            onClick={() => setIsFlipped(false)}
            style={{
              background: 'var(--slate-100)', color: 'var(--slate-700)', border: 'none',
              padding: '8px', borderRadius: 999, fontSize: '0.8rem', fontWeight: 600,
              cursor: 'pointer', marginTop: 'auto'
            }}
          >
             ↩️ Back to Gallery
          </button>
        </div>
      </article>

      {/* ── Fullscreen Lightbox Overlay ── */}
      {isFullscreen && imageUrl && (
        <div
          onClick={() => setIsFullscreen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 99999,
            background: 'rgba(15,23,42,0.95)',
            backdropFilter: 'blur(10px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 40, cursor: 'zoom-out',
            animation: 'fadeIn 0.25s ease',
          }}
        >
          <button
            onClick={() => setIsFullscreen(false)}
            style={{
              position: 'absolute', top: 30, right: 30,
              background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(4px)',
              color: '#fff', fontSize: 24, width: 44, height: 44,
              borderRadius: '50%', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.2s, transform 0.2s',
              zIndex: 10,
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(15,23,42,0.9)'; e.currentTarget.style.transform = 'scale(1.1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(15,23,42,0.6)'; e.currentTarget.style.transform = 'scale(1)'; }}
          >
            ✕
          </button>
          
          <div
            onClick={(e) => e.stopPropagation()}
            onMouseMove={(e) => {
              const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
              const x = ((e.clientX - left) / width) * 100;
              const y = ((e.clientY - top) / height) * 100;
              const img = e.currentTarget.querySelector('img');
              if (img) {
                img.style.transformOrigin = `${x}% ${y}%`;
                img.style.transform = 'scale(2.5)';
              }
            }}
            onMouseLeave={(e) => {
              const img = e.currentTarget.querySelector('img');
              if (img) {
                img.style.transformOrigin = 'center center';
                img.style.transform = 'scale(1)';
              }
            }}
            style={{
              position: 'relative',
              overflow: 'hidden',
              maxWidth: '90vw',
              maxHeight: '90vh',
              borderRadius: 8,
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
              animation: 'fadeSlideUp 0.4s ease',
              cursor: 'zoom-in',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Image
              src={imageUrl}
              alt={painting.title}
              width={1200}
              height={1200}
              style={{
                maxWidth: '90vw',
                maxHeight: '90vh',
                width: 'auto',
                height: 'auto',
                objectFit: 'contain',
                transition: 'transform 0.2s ease-out',
                pointerEvents: 'none' /* Let the wrapper handle mouse events */
              }}
            />
          </div>
        </div>
      )}
      {/* ── YouTube Video Modal ── */}
      {isVideoOpen && (
        <div
          onClick={() => setIsVideoOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 99999,
            background: 'rgba(15,23,42,0.95)',
            backdropFilter: 'blur(10px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 40,
            animation: 'fadeIn 0.25s ease',
          }}
        >
          <button
            onClick={() => setIsVideoOpen(false)}
            style={{
              position: 'absolute', top: 30, right: 30,
              background: 'rgba(255,255,255,0.1)', border: 'none',
              color: '#fff', fontSize: 24, width: 44, height: 44,
              borderRadius: '50%', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          >
            ✕
          </button>
          
          <div 
            onClick={(e) => e.stopPropagation()} 
            style={{ 
              width: '100%', maxWidth: 900, aspectRatio: '16/9', 
              background: '#000', borderRadius: 12, overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
              animation: 'fadeSlideUp 0.4s ease',
            }}
          >
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}

      {/* ── Contact Modal (WhatsApp) ── */}
      {isIgModalOpen && (
        <div 
          style={{
            position: 'fixed', inset: 0, zIndex: 99999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)',
          }}
          onClick={() => setIsIgModalOpen(false)}
        >
          <div 
            style={{
              background: 'white', padding: 40, borderRadius: 24, width: '90%', maxWidth: 420,
              textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              position: 'relative'
            }}
            onClick={e => e.stopPropagation()}
          >
            <button 
              onClick={() => setIsIgModalOpen(false)}
              style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--slate-400)' }}
            >
              ×
            </button>
            <div style={{
              width: 70, height: 70, borderRadius: '50%', background: '#25D366',
              color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px'
            }}>
              <svg width="34" height="34" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </div>
            <h3 style={{ fontSize: '1.4rem', color: 'var(--slate-800)', marginBottom: 12 }}>Interested in this piece?</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--slate-500)', lineHeight: 1.5, marginBottom: 24 }}>
              To purchase <strong>{painting.title}</strong>, please send a message to Artistic Ankit on WhatsApp.
            </p>
            <button 
              onClick={(e) => {
                const userStr = typeof window !== 'undefined' ? localStorage.getItem('aa_user_auth') : null;
                if (!userStr) {
                  setIsIgModalOpen(false);
                  window.dispatchEvent(new Event('openUserAuth'));
                  // Also dispatch a toast message to let them know why the login modal opened
                  window.dispatchEvent(new CustomEvent('showGlobalToast', { 
                    detail: { message: 'Please sign in to send a WhatsApp inquiry.', type: 'error' } 
                  }));
                  return;
                }
                const user = JSON.parse(userStr);
                const text = `Hi Artistic Ankit, I'm interested in purchasing the painting: ${painting.title}. My name is ${user.name} and my email is ${user.email}.`;
                setIsIgModalOpen(false);
                window.open(`https://wa.me/916203382530?text=${encodeURIComponent(text)}`, '_blank');
              }}
              style={{
                display: 'block', width: '100%', padding: '14px', borderRadius: 12,
                background: '#25D366', border: 'none', cursor: 'pointer',
                color: 'white', textDecoration: 'none', fontWeight: 700, fontSize: '1rem',
                boxShadow: '0 8px 24px rgba(37, 211, 102, 0.3)', transition: 'opacity 0.2s',
                fontFamily: 'inherit'
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              Message on WhatsApp
            </button>
          </div>
        </div>
      )}

    </div>
  );
}


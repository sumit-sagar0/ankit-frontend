import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAppData } from '../hooks/useAppData';
import { API_BASE } from '../constants/categoryMeta';
import { API_URL } from '../config/env';
import Image from 'next/image';

/* ═══════════════════════════════════════════════════════════════════════════
   ClientDashboardModal — User Profile & Collection
   Displays saved/liked paintings and simulated commission requests.
   ═══════════════════════════════════════════════════════════════════════════ */

export default function ClientDashboardModal({ isOpen, onClose }) {
  const [paintings, setPaintings] = useState([]);
  const [myCommissions, setMyCommissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { appData } = useAppData();
  
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const stored = localStorage.getItem('aa_user_auth');
      let currentUser = null;
      if (stored) {
        try {
          currentUser = JSON.parse(stored);
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setUser(currentUser);
        } catch (e) {
          console.error("Failed to parse user auth from localStorage", e);
          localStorage.removeItem('aa_user_auth');
        }
      }
      
      const fetchData = async () => {
        try {
          const [paintingsRes, commRes] = await Promise.all([
            axios.get(API_BASE || 'http://localhost:8080/api/paintings'),
            axios.get(`${API_URL}/api/commissions`).catch(() => ({ data: [] }))
          ]);
          setPaintings(Array.isArray(paintingsRes.data) ? paintingsRes.data : []);
          
          if (currentUser && commRes.data) {
            // Filter commissions for the logged-in user by email
            const userComms = commRes.data.filter(c => c.email === currentUser.email);
            // Sort by newest first
            setMyCommissions(userComms.reverse());
          }
        } catch (e) {
          console.warn("Could not fetch data for dashboard", e);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const [categoryFilter, setCategoryFilter] = useState('ALL');

  if (!isOpen) return null;

  const likedPaintings = paintings.filter(p => appData.userLikes.includes(p.id));
  const uniqueLikedCategories = ['ALL', ...new Set(likedPaintings.map(p => p.category).filter(Boolean))];
  const filteredLikedPaintings = categoryFilter === 'ALL' ? likedPaintings : likedPaintings.filter(p => p.category === categoryFilter);

  const handleLogout = () => {
    localStorage.removeItem('aa_user_auth');
    window.dispatchEvent(new Event('userAuthChange'));
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(8px)',
          animation: 'fadeIn 0.3s ease'
        }}
      />

      {/* Slide-in Panel */}
      <div 
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0,
          width: '100%', maxWidth: 500,
          background: 'var(--white)',
          zIndex: 10000,
          boxShadow: '-20px 0 80px rgba(15,23,42,0.15)',
          display: 'flex', flexDirection: 'column',
          animation: 'slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Header */}
        <div style={{ padding: '32px 40px', borderBottom: '1px solid var(--slate-100)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--gradient-blue)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 800, marginBottom: 16 }}>
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <h2 className="font-sora" style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--slate-900)', margin: '0 0 4px' }}>
              {user?.name || 'My Profile'}
            </h2>
            <div className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
              {user?.email || 'Collector'}
            </div>
          </div>
          
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 24, color: 'var(--slate-400)', cursor: 'pointer', padding: 8 }}>✕</button>
        </div>

        {/* Scrollable Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '32px 40px' }}>
          
          {/* Section: My Commissions */}
          <div style={{ marginBottom: 48 }}>
            <h3 className="font-sora" style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--slate-900)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              🎨 My Commission Requests
            </h3>
            
            {loading ? (
              <div style={{ fontSize: '0.9rem', color: 'var(--slate-500)' }}>Loading requests...</div>
            ) : myCommissions.length === 0 ? (
              <div style={{ padding: 24, background: 'var(--snow)', borderRadius: 12, textAlign: 'center', color: 'var(--slate-500)', fontSize: '0.9rem' }}>
                You haven&apos;t requested any custom artworks yet.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {myCommissions.map(req => (
                  <div key={req.id} style={{ 
                    padding: 16, 
                    border: req.status === 'ACCEPTED' ? '2px solid rgba(16,185,129,0.3)' : req.status === 'REJECTED' ? '2px solid rgba(244,63,94,0.3)' : '1px solid var(--slate-200)', 
                    borderRadius: 12, 
                    background: req.status === 'ACCEPTED' ? 'rgba(16,185,129,0.03)' : req.status === 'REJECTED' ? 'rgba(244,63,94,0.03)' : '#fff' 
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                      <span style={{ fontWeight: 600, color: 'var(--slate-900)' }}>{req.paintingType}</span>
                      <span style={{ 
                        fontSize: '0.75rem', fontWeight: 700, padding: '4px 10px', borderRadius: 999, 
                        background: req.status === 'PENDING' ? '#fef3c7' : req.status === 'ACCEPTED' ? '#dcfce7' : '#ffe4e6', 
                        color: req.status === 'PENDING' ? '#d97706' : req.status === 'ACCEPTED' ? '#15803d' : '#e11d48' 
                      }}>
                        {req.status}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', display: 'flex', gap: 12, marginBottom: 12 }}>
                      <span>Size: {req.size || 'N/A'}</span>
                      <span>Budget: ₹{req.budget || 'N/A'}</span>
                    </div>
                    
                    {/* Status Message */}
                    <div style={{ padding: 12, borderRadius: 8, fontSize: '0.85rem', lineHeight: 1.5, background: 'var(--white)', border: '1px solid var(--slate-100)' }}>
                      {req.status === 'PENDING' && (
                        <div style={{ color: 'var(--slate-600)' }}>
                          ⏳ Your request is under review. Please wait while Ankit checks your requirements.
                        </div>
                      )}
                      {req.status === 'ACCEPTED' && (
                        <div style={{ color: '#059669', fontWeight: 500 }}>
                          🎉 Great news! Your commission request has been accepted. Ankit will contact you soon on your email or you can DM him on WhatsApp with your details.
                        </div>
                      )}
                      {req.status === 'IN_PROGRESS' && (
                        <div style={{ color: '#2563eb', fontWeight: 500 }}>
                          🖌️ Your artwork is currently being painted! It&apos;s in progress.
                        </div>
                      )}
                      {req.status === 'COMPLETED' && (
                        <div style={{ color: '#0d9488', fontWeight: 500 }}>
                          ✨ Masterpiece completed! We are getting it ready for shipping.
                        </div>
                      )}
                      {req.status === 'SHIPPED' && (
                        <div style={{ color: '#7c3aed', fontWeight: 500 }}>
                          📦 Your painting is on its way! Check your email for tracking details.
                        </div>
                      )}
                      {req.status === 'REJECTED' && (
                        <div style={{ color: '#e11d48', fontWeight: 500 }}>
                          😔 Sorry, Ankit is currently unable to accept this request due to tight schedule or other constraints. Thank you for your interest!
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section: My Collection (Liked Paintings) */}
          <div>
            <h3 className="font-sora" style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--slate-900)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              ❤️ Saved Collection
            </h3>
            
            {/* ── Category Pills for Saved Collection ── */}
            {uniqueLikedCategories.length > 2 && (
              <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
                {uniqueLikedCategories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    style={{
                      padding: '4px 12px',
                      borderRadius: 999,
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      border: '1px solid',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      background: categoryFilter === cat ? 'var(--blue-600)' : 'transparent',
                      color: categoryFilter === cat ? 'white' : 'var(--slate-500)',
                      borderColor: categoryFilter === cat ? 'var(--blue-600)' : 'var(--slate-200)',
                    }}
                  >
                    {cat === 'ALL' ? 'All Mediums' : cat}
                  </button>
                ))}
              </div>
            )}
            
            {loading ? (
              <div style={{ fontSize: '0.9rem', color: 'var(--slate-500)' }}>Loading collection...</div>
            ) : likedPaintings.length === 0 ? (
              <div style={{ padding: 24, background: 'var(--snow)', borderRadius: 12, textAlign: 'center', color: 'var(--slate-500)', fontSize: '0.9rem' }}>
                You haven&apos;t liked any paintings yet. Click the heart icon on a painting to save it here.
              </div>
            ) : filteredLikedPaintings.length === 0 ? (
              <div style={{ padding: 24, background: 'var(--snow)', borderRadius: 12, textAlign: 'center', color: 'var(--slate-500)', fontSize: '0.9rem' }}>
                No saved paintings found in this category.
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {filteredLikedPaintings.map(p => (
                  <div key={p.id} style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid var(--slate-100)' }}>
                    <div style={{ width: '100%', paddingTop: '100%', position: 'relative', background: 'var(--snow)' }}>
                      <Image src={`${API_URL}${p.imageUrl}`} alt={p.title} width={300} height={300} unoptimized style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ padding: 12, background: '#fff' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--blue-600)', fontWeight: 700, marginBottom: 4 }}>{p.category}</div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--slate-900)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.title}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div style={{ padding: 24, borderTop: '1px solid var(--slate-100)', background: 'var(--snow)' }}>
          <button 
            onClick={handleLogout}
            style={{ width: '100%', padding: '12px', background: 'transparent', border: '1px solid var(--slate-200)', borderRadius: 8, color: 'var(--slate-600)', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#ffe4e6'; e.currentTarget.style.color = '#be123c'; e.currentTarget.style.borderColor = '#fecdd3'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--slate-600)'; e.currentTarget.style.borderColor = 'var(--slate-200)'; }}
          >
            Sign Out
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  );
}


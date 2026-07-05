import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import PaintingCard from './PaintingCard';
import EditPaintingModal from './EditPaintingModal';
import { API_BASE } from '../constants/categoryMeta';

/* ═══════════════════════════════════════════════════════════════════════════
   PaintingGrid — Axios GET engine + filter tabs + responsive card grid
   Props:
     onCountChange  {(n: number) => void}  — reports live count up to Hero
   ═══════════════════════════════════════════════════════════════════════════ */
export default function PaintingGrid({ onCountChange }) {
  const [paintings, setPaintings] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState('');
  const [filter,    setFilter]    = useState('ALL'); // AVAILABLE / SOLD
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingPainting, setEditingPainting] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setIsAdmin(typeof window !== 'undefined' && sessionStorage.getItem('aa_admin_auth') === 'true'); }, []);

  useEffect(() => {
    const handleAuthChange = () => setIsAdmin(sessionStorage.getItem('aa_admin_auth') === 'true');
    window.addEventListener('authChange', handleAuthChange);
    return () => window.removeEventListener('authChange', handleAuthChange);
  }, []);

  /* ── Fetch all paintings ── */
  const fetchPaintings = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(API_BASE);
      const data = Array.isArray(res.data) ? res.data : [];
      setPaintings(data);
      onCountChange?.(data.length);
    } catch {
      setError('Could not connect to the backend server.');
    } finally {
      setLoading(false);
    }
  }, [onCountChange]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchPaintings(); }, [fetchPaintings]);

  /* ── Delete logic ── */
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this painting permanently?')) return;
    try {
      await axios.delete(`${API_BASE}/${id}`);
      // Optimistic update
      setPaintings(prev => prev.filter(p => p.id !== id));
      onCountChange?.(paintings.length - 1);
    } catch (err) {
      alert('Delete failed. ' + (err.response?.data?.message || ''));
    }
  };

  /* ── Edit Success ── */
  const handleEditSuccess = (updatedPainting) => {
    setPaintings(prev => prev.map(p => p.id === updatedPainting.id ? updatedPainting : p));
    setEditingPainting(null);
  };

  /* ── Filter logic ── */
  const filterTabs = [
    { key: 'ALL',       label: 'All Works' },
    { key: 'AVAILABLE', label: 'Available' },
    { key: 'SOLD',      label: 'Sold Out'  },
  ];

  const displayed = paintings.filter((p) => {
    let matchStatus = true;
    if (filter !== 'ALL') {
      matchStatus = p.status?.toUpperCase() === filter;
    }
    let matchCat = true;
    if (categoryFilter !== 'ALL') {
      matchCat = p.category === categoryFilter;
    }
    let matchSearch = true;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      matchSearch = p.title?.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q);
    }
    return matchStatus && matchCat && matchSearch;
  });

  const uniqueCategories = ['ALL', ...new Set(paintings.map(p => p.category).filter(Boolean))];

  const countForTab = (key) =>
    key === 'AVAILABLE'
      ? paintings.filter((p) => p.status?.toUpperCase() !== 'SOLD').length
      : paintings.filter((p) => p.status?.toUpperCase() === 'SOLD').length;

  return (
    <div style={{ animation: 'fadeSlideUp 0.7s ease 0.25s both' }}>

      {/* ── Section header ── */}
      <div
        style={{
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
          marginBottom:   24,
          gap:            12,
          flexWrap:       'wrap',
        }}
      >
        <div>
          <div
            className="font-mono"
            style={{
              fontSize:      '0.62rem',
              letterSpacing: '0.28em',
              color:         'var(--blue-600)',
              textTransform: 'uppercase',
              marginBottom:  6,
            }}
          >
            ◈ Live Exhibition · Physical Canvas Archive
          </div>
          <h2
            className="font-sora"
            style={{
              fontSize:      '1.22rem',
              fontWeight:    700,
              color:         'var(--slate-900)',
              letterSpacing: '-0.01em',
            }}
          >
            Studio Collection
          </h2>
        </div>

        <button className="sync-btn" onClick={fetchPaintings} id="aa-refresh-btn">
          ↻ Sync Gallery
        </button>
      </div>

      {/* ── Filter tabs & Search Bar ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {filterTabs.map((tab) => (
              <button
                key={tab.key}
                className={`filter-tab ${filter === tab.key ? 'active' : ''}`}
                onClick={() => setFilter(tab.key)}
                id={`aa-filter-${tab.key.toLowerCase()}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div style={{ position: 'relative', flex: '1 1 200px', maxWidth: 350 }}>
            <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>🔍</span>
            <input 
              type="text" 
              placeholder="Search paintings (e.g. Gojo)..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 16px 10px 40px',
                borderRadius: 999,
                border: '1px solid var(--slate-200)',
                background: 'rgba(255,255,255,0.8)',
                backdropFilter: 'blur(10px)',
                fontSize: '0.85rem',
                fontFamily: 'Sora, sans-serif',
                color: 'var(--slate-800)',
                outline: 'none',
                transition: 'all 0.2s',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--blue-400)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--slate-200)'}
            />
          </div>
          <span
            style={{
              fontSize:    '0.78rem',
              color:       'var(--slate-400)',
              fontWeight:  500,
            }}
          >
            {displayed.length} artwork{displayed.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* ── Category Pills ── */}
      {uniqueCategories.length > 2 && (
        <div style={{ display: 'flex', gap: 6, marginBottom: 30, flexWrap: 'wrap' }}>
          {uniqueCategories.map(cat => (
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

      {/* ── Loading spinner ── */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '64px 0' }}>
          <div
            style={{
              width:       44,
              height:      44,
              borderRadius:'50%',
              border:      '3px solid rgba(37,99,235,0.15)',
              borderTopColor: 'var(--blue-600)',
              animation:   'spinRing 0.8s linear infinite',
              margin:      '0 auto 18px',
            }}
          />
          <p style={{ color: 'var(--slate-400)', fontSize: '0.85rem' }}>Loading the gallery…</p>
        </div>
      )}

      {/* ── Error state ── */}
      {!loading && error && (
        <div
          style={{
            padding:      '24px 28px',
            borderRadius: 'var(--radius-lg)',
            background:   'rgba(244,63,94,0.05)',
            border:       '1.5px solid rgba(244,63,94,0.2)',
            color:        '#be123c',
            fontSize:     '0.85rem',
            lineHeight:   1.6,
            textAlign:    'center',
          }}
        >
          <div style={{ fontSize: 28, marginBottom: 10 }}>⚠️</div>
          <strong>Gallery Unavailable</strong><br />
          {error}
        </div>
      )}

      {/* ── Empty state ── */}
      {!loading && !error && displayed.length === 0 && (
        <div
          style={{
            padding:      '64px 28px',
            borderRadius: 'var(--radius-xl)',
            background:   'var(--white)',
            border:       '1.5px dashed var(--slate-200)',
            textAlign:    'center',
            boxShadow:    'var(--shadow-sm)',
          }}
        >
          <div style={{ fontSize: 44, marginBottom: 14 }}>🎨</div>
          <p
            className="font-sora"
            style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--slate-700)', marginBottom: 6 }}
          >
            No artworks found
          </p>
          <p style={{ fontSize: '0.82rem', color: 'var(--slate-400)', lineHeight: 1.6 }}>
            {filter !== 'ALL'
              ? `No paintings with status "${filter}". Try a different filter.`
              : 'The gallery is empty. Use the Creator Portal to upload the first painting!'}
          </p>
        </div>
      )}

      {/* ── Responsive card grid ── */}
      {!loading && !error && displayed.length > 0 && (
        <div
          style={{
            display:             'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap:                 20,
          }}
        >
          {displayed.map((painting, i) => (
            <PaintingCard 
              key={painting.id || i} 
              painting={painting} 
              index={i} 
              isAdmin={isAdmin}
              onDelete={handleDelete}
              onEdit={setEditingPainting}
            />
          ))}
        </div>
      )}

      {/* ── Edit Modal ── */}
      {editingPainting && (
        <EditPaintingModal
          painting={editingPainting}
          onClose={() => setEditingPainting(null)}
          onSuccess={handleEditSuccess}
        />
      )}

    </div>
  );
}

